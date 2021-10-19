<script>
    import {
        AmbientLight,
        BoxBufferGeometry,
        BufferAttribute,
        DirectionalLight,
        Mesh,
        MeshBasicMaterial,
        MeshStandardMaterial,
        NoToneMapping,
        PerspectiveCamera,
        PlaneBufferGeometry,
        PointLight,
        RepeatWrapping,
        Scene,
        SphereBufferGeometry,
        sRGBEncoding,
        TextureLoader,
        Vector3,
        WebGLRenderer,
    } from "three";
    import * as dat from "dat.gui";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { onMount } from "svelte";
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        10000
    );
    const gui = new dat.GUI();
    const textureLoader = new TextureLoader();
    const roof = {
        map: textureLoader.load(
            "/textures/roof/RoofTilesTerracotta004_COL_3K.jpg"
        ),
        normalMap: textureLoader.load(
            "/textures/roof/RoofTilesTerracotta004_NRM_3K.png"
        ),
        displacementMap: textureLoader.load(
            "/textures/roof/RoofTilesTerracotta004_DISP_3K.jpg"
        ),
        metalnessMap: textureLoader.load(
            "/textures/roof/RoofTilesTerracotta004_REFL_3K.jpg"
        ),
        aoMap: textureLoader.load(
            "/textures/roof/RoofTilesTerracotta004_AO_3K.jpg"
        ),
    };
    for (let texture in roof) {
        roof[texture].wrapS = RepeatWrapping;
        roof[texture].wrapT = RepeatWrapping;
        roof[texture].repeat.set(2, 1);
    }
    const material = new MeshStandardMaterial({ ...roof });
    material.displacementScale = 0.01;
    gui.add(material, "metalness").min(0).max(1).step(0.001);
    gui.add(material, "roughness").min(0).max(1).step(0.001);
    gui.add(material, "aoMapIntensity").min(0).max(1).step(0.001);
    const scene = new Scene();
    const geometry = new BoxBufferGeometry(1, 1, 1, 256, 256);
    geometry.attributes.uv2 = geometry.attributes.uv;

    const cube = new Mesh(geometry, material);
    console.log(cube);
    scene.add(cube);
    camera.position.z = 3;
    const pointLight = new PointLight("#fff", 1);
    pointLight.position.set(1, 0, 10);
    scene.add(pointLight);
    const ambientLight = new AmbientLight("#fff", 0.25);
    scene.add(ambientLight);
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const renderer = new WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        const controls = new OrbitControls(camera, canvas);
        renderer.toneMapping = NoToneMapping;
        //renderer.outputEncoding = sRGBEncoding;
        const animate = (time) => {
            renderer.render(scene, camera);
            pointLight.position.z = Math.cos(time / 1000) * 10;
            pointLight.position.x = Math.sin(time / 1000) * 10;
            controls.update();
            requestAnimationFrame(animate);
        };
        animate(0);
    });
</script>

<canvas />
