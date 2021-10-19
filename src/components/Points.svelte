<script>
    import { onMount } from "svelte";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import {
        AmbientLight,
        BoxGeometry,
        BufferAttribute,
        BufferGeometry,
        Clock,
        ConeGeometry,
        Group,
        Mesh,
        MeshBasicMaterial,
        MeshStandardMaterial,
        PerspectiveCamera,
        PlaneGeometry,
        Points,
        PointsMaterial,
        Scene,
        SphereGeometry,
        WebGLRenderer,
    } from "three";
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    const scene = new Scene();
    const count = 1000;
    const vertexs = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < vertexs.length; i++) {
        vertexs[i] = (Math.random() - 0.5) * 10;
        colors[i] = Math.random();
    }
    const cube = new Mesh(
        new SphereGeometry(1, 32, 32),
        new MeshBasicMaterial({ color: "gray" })
    );
    scene.add(cube);
    const geometry = new BufferGeometry();
    geometry.addAttribute("position", new BufferAttribute(vertexs, 3));
    geometry.addAttribute("color", new BufferAttribute(colors, 3));
    const material = new PointsMaterial();
    material.size = 0.02;
    material.vertexColors = true;
    const particles = new Points(geometry, material);
    scene.add(particles);
    camera.position.set(0, 0, 4);

    onMount(() => {
        const canvas = document.querySelector("canvas");
        const renderer = new WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, canvas);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

<div>
    las ratas no lloran
    {window.devicePixelRatio}
</div>

<style>
    div {
        position: fixed;
        top: 0;
        background-color: #fff;
    }
</style>
