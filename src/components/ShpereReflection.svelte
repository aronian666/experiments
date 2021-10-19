<script>
    import { onMount } from "svelte";

    import {
        BoxBufferGeometry,
        CubeTextureLoader,
        DirectionalLight,
        LightProbe,
        Mesh,
        MeshBasicMaterial,
        MeshStandardMaterial,
        NoToneMapping,
        PerspectiveCamera,
        PlaneBufferGeometry,
        Raycaster,
        Scene,
        SphereBufferGeometry,
        sRGBEncoding,
        Vector2,
        Vector3,
        WebGLRenderer,
    } from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { LightProbeGenerator } from "three/examples/jsm/lights/LightProbeGenerator";
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
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
    const lightProbe = new LightProbe();
    scene.add(lightProbe);
    const cubeLoader = new CubeTextureLoader();
    const environmentMap = cubeLoader.load(
        genCubeUrls("textures/environmentMaps/2/", ".jpg"),
        (envMap) => {
            console.log("entro");
            lightProbe.copy(LightProbeGenerator.fromCubeTexture(envMap));
            console.log("salgo");
        }
    );
    environmentMap.encoding = sRGBEncoding;
    scene.background = environmentMap;

    const directionalLigth = new DirectionalLight(0xffffff, 0);
    directionalLigth.position.set(0, 4, 0);
    scene.add(directionalLigth);

    const sphere = new Mesh(
        new SphereBufferGeometry(1, 64, 32),
        new MeshStandardMaterial({
            envMap: environmentMap,
            color: "#fff",
            envMapIntensity: 1,
            metalness: 0,
            roughness: 0,
        })
    );
    scene.add(sphere);
    camera.position.set(0, 0, 5);
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const renderer = new WebGLRenderer({ canvas, antialias: true });
        renderer.toneMapping = NoToneMapping;

        renderer.outputEncoding = sRGBEncoding;
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, canvas);
        const animate = (time) => {
            controls.update();
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate(0);
    });
</script>

<canvas />
