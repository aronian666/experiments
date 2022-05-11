<script>
    // Load a external model on three js
    import { onMount } from "svelte";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
    import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
    import {
        ACESFilmicToneMapping,
        AmbientLight,
        BoxGeometry,
        Clock,
        CubeTextureLoader,
        DirectionalLight,
        Mesh,
        MeshStandardMaterial,
        PerspectiveCamera,
        PlaneBufferGeometry,
        PointLight,
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
    let cube;
    gltfLoader.load("/models/TrueCake.glb", (gltf) => {
        cube = gltf.scene;
        cube.children.forEach((mesh) => {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        });
        scene.add(cube);
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
    const ambientLigth = new AmbientLight("#fff", 0.6);
    const directionalLight = new PointLight("#ffffff", 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.camera.top = 2;
    directionalLight.shadow.camera.right = 2;
    directionalLight.shadow.camera.bottom = -2;
    directionalLight.shadow.camera.left = -2;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(5, 5, 0);
    const plane = new Mesh(
        new PlaneBufferGeometry(10, 10),
        new MeshStandardMaterial({ roughness: 0, metalness: 0 })
    );
    plane.receiveShadow = true;
    plane.rotateX(-Math.PI / 2);
    scene.add(directionalLight, ambientLigth, plane);
    camera.position.set(2, 2, 2);
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const renderer = new WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, canvas);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.physicallyCorrectLights = true;
        renderer.outputEncoding = sRGBEncoding;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.shadowMap.enabled = true;
        const animate = () => {
            if (cube) {
                cube.rotation.y += 0.005;
            }
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    });
</script>

<canvas />
