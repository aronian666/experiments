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
        genCubeUrls("textures/environmentMaps/2/", ".jpg"),
        (envMap) => {
            //lightProbe.copy(LightProbeGenerator.fromCubeTexture(envMap));
        }
    );
    environmentMap.encoding = sRGBEncoding;
    scene.background = environmentMap;
    const loader = new TextureLoader();
    const vector = new Vector2(1, 1);
    vector.normalize();
    console.log(vector);
    const image = loader.load("/images/totoro.jpg");
    const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vec4 modelPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
            gl_Position = modelPosition;
            vUv = uv;
            vPosition = position;


        }
    `;
    const fragmentShader = `
        #define PI 3.141592653589793
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform sampler2D image;
        uniform float facColorBurn;
        uniform float facColorDodge;
        uniform float scale;
        uniform float mixFac;
        uniform float x;
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
            vec2 axis = vUv * scale;
            float newy = abs(mod(axis.x, 2.0) - 1.0);
            vec2 pingPong = vec2(axis.x, newy + axis.y);
            vec2 snap = floor(pingPong);
            vec2 divide = snap / scale;
            vec4 imageTexture = texture2D(image, divide);
            vec2 threadAxis =  fract(pingPong);
            vec3 linesRotate = lines(threadAxis, axis);
            vec3 threadsShape = vec3(1.0 - pow(length(threadAxis - 0.5), 2.0));
            vec3 color = colorBurn(threadsShape, facColorBurn);
            vec3 alpha = colorDodge(color, 0.99);
            color = clamp(colorDodge(color, facColorDodge) * linesRotate, vec3(0.0), vec3(1.0));
            gl_FragColor = imageTexture * vec4(color, alpha.x);
            //gl_FragColor = vec4(color, 1.0);
        }
    `;
    const plane = new Mesh(
        new PlaneBufferGeometry(1, 1),
        new ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: DoubleSide,
            uniforms: {
                facColorBurn: { value: 0.32, type: "f" },
                image: { value: image, type: "t" },
                scale: { value: 5, type: "f" },
                x: { value: 0, type: "f" },
                facColorDodge: { value: 0.1, type: "f" },
                angle: { value: 4.45, type: "f" },
            },
            transparent: true,
        })
    );
    const newUv = new Float32Array([
        0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0,
    ]);
    plane.geometry.attributes.uv.array = newUv;
    gui.add(plane.material.uniforms.facColorBurn, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("Color Burn");
    gui.add(plane.material.uniforms.facColorDodge, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("Color dodge");
    gui.add(plane.material.uniforms.scale, "value")
        .min(5)
        .max(100)
        .step(1)
        .name("Scale");
    gui.add(plane.material.uniforms.x, "value")
        .min(-5)
        .max(5)
        .step(0.1)
        .name("x axis");
    gui.add(plane.material.uniforms.angle, "value")
        .min(0)
        .max(2 * Math.PI)
        .step(0.01)
        .name("angle");
    scene.add(plane);
    camera.position.set(0, 0, 1);
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const controls = new OrbitControls(camera, canvas);
        const renderer = new WebGLRenderer({
            canvas,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const animate = (time) => {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate(0);
    });
</script>

<canvas />
