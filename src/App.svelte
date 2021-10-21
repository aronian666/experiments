<script>
    import { onMount } from "svelte";
    import {
        DoubleSide,
        Mesh,
        PerspectiveCamera,
        PlaneBufferGeometry,
        Scene,
        ShaderMaterial,
        TextureLoader,
        WebGLRenderer,
        Vector3,
        Vector2,
        BoxBufferGeometry,
        CubeTextureLoader,
        sRGBEncoding,
        Color,
        RepeatWrapping,
        AmbientLight,
        NoToneMapping,
        Group,
    } from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        100
    );
    import * as dat from "dat.gui";
    const gui = new dat.GUI();
    const scene = new Scene();
    const genCubeUrls = function (prefix, postfix) {
        return [
            prefix + "px" + postfix,
            prefix + "nx" + postfix,
            prefix + "py" + postfix,
            prefix + "ny" + postfix,
            prefix + "pz" + postfix,
            prefix + "nz" + postfix,
        ];
    };
    const cubeLoader = new CubeTextureLoader();
    const environmentMap = cubeLoader.load(
        genCubeUrls("textures/environmentMaps/1/", ".jpg"),
        (envMap) => {
            //lightProbe.copy(LightProbeGenerator.fromCubeTexture(envMap));
        }
    );
    environmentMap.encoding = sRGBEncoding;
    scene.background = environmentMap;
    const loader = new TextureLoader();
    const image = loader.load("/images/galaxy.jpg");
    const vertexShader = `
        #define PI 3.141592653589793
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float scale;
        uniform float angle;
        uniform float facColorBurn;
        uniform float facColorDodge;
        uniform float direction;
        uniform float time;

        vec3 colorDodge(vec3 vector, float fac){
            return vector / vec3(1.0 - fac);
        }
        vec3 colorBurn(vec3 vector, float fac) {
            return vec3(1.0) - (vec3(1.0) - vector) / vec3(fac);
        }
        vec2 rotate(vec2 vector, float angle){
            return vector.x * vec2(cos(angle), sin(angle)) + vector.y * vec2(cos(angle + PI / 2.0), sin(angle + PI / 2.0));
        }
        vec3 lines(vec2 threadAxis, vec2 axis) {
            float facRotation = step(0.5, abs(mod(axis.x, 2.0) - 0.5));
            vec2 axisRotate = rotate(threadAxis, angle + facRotation * angle);
            vec3 color = vec3(sin(axisRotate.y * 20.0) * 3.0 + 3.5);
            return color;
        }
        vec3 getDisplacement(vec2 axis){
            float newy = abs(mod(axis.x, 2.0) - 1.0);
            vec2 pingPong = vec2(axis.x, newy + axis.y);
            vec2 threadAxis = fract(pingPong);
            vec3 linesRotate = lines(threadAxis, axis);
            vec3 threadsShape = vec3(1.0 - length(threadAxis - 0.5));
            vec3 displacement = colorBurn(threadsShape, 0.49);
            displacement = clamp(colorDodge(displacement, facColorDodge) * linesRotate, vec3(0.0), vec3(1.0));
            return displacement;
        }
        void main() {
            vec2 axis = vec2(abs(direction - uv.x), uv.y) * scale;
            vec3 displacement = getDisplacement(axis);
            float noise = displacement.x;
            vec3 newPosition = position + normal * noise * 0.2/scale;
            vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
            modelPosition.z += sin(modelPosition.x * 10.0 - time * 0.001) * 0.025;
            modelPosition.z += sin(modelPosition.y * 5.0 - time * 0.001) * 0.025;
            vec4 modelFinal = projectionMatrix * viewMatrix * modelPosition;
            gl_Position = modelFinal;
            vUv = axis;
            vNormal = normal;
        }
    `;
    const fragmentShader = `
        #define PI 3.141592653589793
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform sampler2D image;
        uniform float facColorBurn;
        uniform float facColorDodge;
        uniform float scale;
        uniform float mixFac;
        uniform float angle;
        vec3 colorBurn(vec3 vector, float fac) {
            return vec3(1.0) - (vec3(1.0) - vector) / vec3(fac);
        }
        vec3 colorDodge(vec3 vector, float fac){
            return vector / vec3(1.0 - fac);
        }
        vec3 softLight(vec3 color1, vec3 color2, float fac) {
            if (fac > 0.5){
                return (1.0 - 2.0 * (color2 - 0.5)) * (1.0 - color1);
            }
            return 2.0 * color1 * color2;
        }
        vec2 rotate(vec2 vector, float angle){
            return vector.x * vec2(cos(angle), sin(angle)) + vector.y * vec2(cos(angle + PI / 2.0), sin(angle + PI / 2.0));
        }
        vec3 lines(vec2 threadAxis, vec2 axis) {
            float facRotation = step(0.5, abs(mod(axis.x, 2.0) - 0.5));
            vec2 axisRotate = rotate(threadAxis, angle + facRotation * angle);
            vec3 color = vec3(sin(axisRotate.y * 20.0) * 3.0 + 3.5);
            return color;
        }
        void main(){
            vec2 axis = vUv;
            float newy = abs(mod(axis.x, 2.0) - 1.0);
            vec2 pingPong = vec2(axis.x, newy + axis.y);
            vec2 snap = floor(pingPong);
            vec2 divide = snap / scale;
            vec4 imageTexture = texture2D(image, divide);
            vec2 threadAxis =  fract(pingPong);
            vec3 linesRotate = lines(threadAxis, axis) * 1.7;
            vec3 threadsShape = vec3(1.0 - pow(length(threadAxis - 0.5), 2.0));
            vec3 color = colorBurn(threadsShape, facColorBurn);
            vec3 alpha = colorDodge(color, 0.99);
            color = clamp(colorDodge(color, facColorDodge) * linesRotate, vec3(0.0), vec3(1.0)) * 0.8;
            gl_FragColor = imageTexture * vec4(color, alpha.x);
            //gl_FragColor = vec4(color, alpha.x);
        }
    `;
    const uniform1 = {
        facColorBurn: { value: 0.34, type: "f" },
        image: { value: image, type: "t" },
        scale: { value: 50, type: "f" },
        facColorDodge: { value: 0.1, type: "f" },
        angle: { value: 4.45, type: "f" },
        direction: { value: 0, type: "f" },
        time: { value: 0 },
    };
    const uniform2 = {
        facColorBurn: { value: 0.34, type: "f" },
        image: { value: image, type: "t" },
        scale: { value: 50, type: "f" },
        facColorDodge: { value: 0.1, type: "f" },
        angle: { value: 4.45, type: "f" },
        direction: { value: 1, type: "f" },
        time: { value: 0 },
    };
    const material1 = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniform1,
        transparent: true,
    });
    const material2 = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: uniform2,
        transparent: true,
    });
    const plane = new Mesh(
        new PlaneBufferGeometry(1, 1, 1000, 1000),
        material1
    );
    const planeb = new Mesh(
        new PlaneBufferGeometry(1, 1, 1000, 1000),
        material2
    );
    planeb.rotateY(Math.PI);
    const parameters = {
        "Color Burn": 0.36,
        "Color Dodge": 0.1,
        Scale: 79,
        Angle: 4.45,
    };
    gui.add(parameters, "Color Burn")
        .min(0)
        .max(1)
        .step(0.01)
        .onChange((value) => {
            material1.uniforms.facColorBurn.value = value;
            material2.uniforms.facColorBurn.value = value;
        });
    gui.add(parameters, "Color Dodge")
        .min(0)
        .max(1)
        .step(0.01)
        .onChange((value) => {
            material1.uniforms.facColorDodge.value = value;
            material2.uniforms.facColorDodge.value = value;
        });
    gui.add(parameters, "Scale")
        .min(25)
        .max(150)
        .step(1)
        .onChange((value) => {
            material1.uniforms.scale.value = value;
            material2.uniforms.scale.value = value;
        });
    gui.add(parameters, "Angle")
        .min(0)
        .max(2 * Math.PI)
        .step(0.01)
        .onChange((value) => {
            material1.uniforms.angle.value = value;
            material2.uniforms.angle.value = value;
        });
    camera.position.set(0, 0, 1);
    const thread = new Group();
    thread.add(plane);
    thread.add(planeb);
    scene.add(thread);
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const controls = new OrbitControls(camera, canvas);
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true,
        });
        renderer.toneMapping = NoToneMapping;

        renderer.outputEncoding = sRGBEncoding;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        const animate = (time) => {
            material1.uniforms.time.value = time;
            material2.uniforms.time.value = time;
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate(0);
    });
</script>

<canvas />
