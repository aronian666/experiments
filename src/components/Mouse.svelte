<script>
    import { onMount } from "svelte";
    import {
        BoxGeometry,
        Mesh,
        MeshBasicMaterial,
        PerspectiveCamera,
        Scene,
        Vector3,
        WebGLRenderer,
    } from "three";
    const camera = new PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        173
    );
    const scene = new Scene();
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    scene.add(cube);

    onMount(() => {
        const position = {
            x: 0,
            y: 0,
        };
        const renderer = new WebGLRenderer({
            canvas: document.querySelector("canvas.mouse"),
        });
        window.addEventListener("mousemove", (event) => {
            position.x = 2 * (event.clientX / window.innerWidth - 0.5);
            position.y = -2 * (event.clientY / window.innerHeight - 0.5);
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        const animate = () => {
            camera.position.y = Math.sin((position.y * Math.PI) / 2) * 3;
            camera.position.z =
                Math.cos((position.y * Math.PI) / 2) *
                3 *
                Math.cos(position.x * Math.PI);
            camera.position.x = Math.sin(position.x * Math.PI) * 3;
            //camera.position.y = position.y * 3;
            camera.lookAt(cube.position);
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    });
</script>

<canvas class="mouse" />
