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
    const loader = new TextureLoader();
    const image = loader.load(
        "/images/florian-biedermann-y-puBc1azy4-unsplash.jpg"
    );
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
        uniform float scale;
        uniform float mixFac;
        vec3 threads(float scale) {
            vec3 uvScale = vec3(vUv, 0.0) * vec3(scale);
            float ping = 1.0 - abs(mod(uvScale.x, 2.0) - 1.0);
            vec3 pong = vec3(ping + uvScale.y);
            vec3 convine = vec3(uvScale.x, pong.x, 0.0);
            convine = floor(convine * 1.0) / vec3(1.0);
            convine /= vec3(scale, scale, 0.0);
            vec3 modulo = mod(convine, vec3(1.0));
            vec3 center = modulo - vec3(0.5, 0.5, 0.0);
            vec3 length = vec3(length(center));
            vec3 invert = vec3(1.0) - length;
            vec3 colorBurn = vec3(1.0) - (vec3(1.0) - invert) / vec3(facColorBurn);
            vec3 colorDodge = colorBurn / (vec3(1.0) - (vec3(0.6)));
            return convine;
        }
        void main(){
            vec3 shit = threads(scale);
            vec4 backgroundImage = texture2D(image, shit.xy);
            gl_FragColor = backgroundImage;
        }
    `;
    const plane = new Mesh(
        new PlaneBufferGeometry(),
        new ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: DoubleSide,
            uniforms: {
                facColorBurn: { value: 0.65, type: "f" },
                image: { value: image, type: "t" },
                scale: { value: 6, type: "f" },
                mixFac: { value: 0.5, type: "f" },
            },
        })
    );

    gui.add(plane.material.uniforms.facColorBurn, "value")
        .min(0)
        .max(1)
        .step(0.01);
    gui.add(plane.material.uniforms.scale, "value").min(5).max(100).step(1);
    gui.add(plane.material.uniforms.mixFac, "value").min(0).max(1).step(0.01);
    scene.add(plane);
    camera.position.set(0, 0, 2);
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
