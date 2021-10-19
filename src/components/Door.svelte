<script>
    import { onMount } from "svelte";
    import * as dat from "dat.gui";
    import {
        AmbientLight,
        BoxBufferGeometry,
        BufferAttribute,
        Clock,
        DirectionalLight,
        DoubleSide,
        Mesh,
        MeshBasicMaterial,
        MeshLambertMaterial,
        MeshPhongMaterial,
        MeshStandardMaterial,
        MeshToonMaterial,
        NearestFilter,
        PerspectiveCamera,
        PlaneBufferGeometry,
        PointLight,
        Scene,
        SphereBufferGeometry,
        TextureLoader,
        WebGLRenderer,
    } from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    const gui = new dat.GUI();
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    );
    const scene = new Scene();
    const textureLoader = new TextureLoader();
    const colorTexture = textureLoader.load("/textures/door/color.jpg");
    const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
    const heightTexture = textureLoader.load("/textures/door/height.jpg");
    const normalTexture = textureLoader.load("/textures/door/normal.jpg");
    const ambientOcclusionTexture = textureLoader.load(
        "/textures/door/ambientOcclusion.jpg"
    );
    const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
    const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

    const material = new MeshStandardMaterial();
    material.map = colorTexture;
    material.displacementMap = heightTexture;
    material.displacementScale = 0.05;
    material.metalnessMap = metalnessTexture;
    material.roughnessMap = roughnessTexture;
    material.normalMap = normalTexture;
    material.alphaMap = alphaTexture;
    material.transparent = true;
    //material.wireframe = true;
    gui.add(material, "metalness").min(0).max(1).step(0.001);
    gui.add(material, "roughness").min(0).max(1).step(0.001);
    const plane = new Mesh(new PlaneBufferGeometry(1, 1, 32, 32), material);

    scene.add(plane);
    const ambientLight = new AmbientLight("white", 0.5);
    scene.add(ambientLight);
    const pointLight = new PointLight("white", 0.3);
    pointLight.position.set(0, 1, 3);
    scene.add(pointLight);
    camera.position.z = 1;
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const renderer = new WebGLRenderer({ canvas });
        const controls = new OrbitControls(camera, canvas);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        const clock = new Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    });
</script>

<canvas />
