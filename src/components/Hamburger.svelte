<script>
    // Load a external model on three js
    import { onMount } from "svelte";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
    import {
        ACESFilmicToneMapping,
        BoxGeometry,
        Clock,
        CubeTextureLoader,
        DirectionalLight,
        Mesh,
        MeshStandardMaterial,
        PerspectiveCamera,
        Scene,
        SphereGeometry,
        sRGBEncoding,
        WebGLRenderer,
    } from "three";

    import * as dat from "dat.gui";
    // Loaders
    const gui = new dat.GUI();
    const dracoLoader = new DRACOLoader();
    const cubeTextureLoader = new CubeTextureLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    // camera
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    const scene = new Scene();

    // Loader

    gltfLoader.load("/models/hamburger.glb", (gltf) => {
        const hamburger = gltf.scene;
        hamburger.scale.set(0.25, 0.25, 0.25);
        scene.add(hamburger);
    });
    const environmentMap = cubeTextureLoader.load([
        "textures/environmentMaps/0/px.jpg",
        "textures/environmentMaps/0/nx.jpg",
        "textures/environmentMaps/0/py.jpg",
        "textures/environmentMaps/0/ny.jpg",
        "textures/environmentMaps/0/pz.jpg",
        "textures/environmentMaps/0/nz.jpg",
    ]);
    environmentMap.encoding = sRGBEncoding;
    scene.background = environmentMap;
    scene.environment = environmentMap;
    // const directionalLigth = new DirectionalLight(0xce9300, 3);
    // directionalLigth.position.set(0.25, 3, -2.25);
    // gui.add(directionalLigth, "intensity").min(0).max(10).step(0.001);
    // scene.add(directionalLigth);
    const directionalLight = new DirectionalLight("#ffffff", 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 3, -2.25);
    scene.add(directionalLight);
    camera.position.set(4, 1, -4);
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const renderer = new WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, canvas);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = sRGBEncoding;
        renderer.toneMapping = ACESFilmicToneMapping;
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
