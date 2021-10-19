<script>
    import {
        BoxBufferGeometry,
        Mesh,
        MeshBasicMaterial,
        PerspectiveCamera,
        Scene,
        SphereBufferGeometry,
        Vector3,
        WebGLRenderer,
    } from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { onMount } from "svelte";
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
    );
    const getDirection = (origin, destiny) => {
        origin = origin.clone();
        return origin.multiplyScalar(-1).add(destiny);
    };
    const scene = new Scene();
    const spheres = [];
    const createSphere = (
        position = new Vector3(),
        mass = 1,
        velocity = new Vector3()
    ) => {
        const radius = Math.pow((mass * 3) / (4 * Math.PI), 1 / 3);
        const sphere = new Mesh(
            new SphereBufferGeometry(radius * 2, 32, 16),
            new MeshBasicMaterial()
        );
        sphere.position.add(position);
        sphere.mass = mass;
        sphere.velocity = velocity;
        sphere.attraction = (object) => {
            const acceleration =
                object.mass /
                Math.pow(sphere.position.distanceTo(object.position), 2);
            const direction = getDirection(
                sphere.position,
                object.position
            ).setLength(acceleration);
            sphere.velocity.add(direction);
            sphere.position.add(sphere.velocity);
        };
        sphere.starAtraction = () => {
            spheres.forEach((s) => {
                if (sphere.uuid !== s.uuid) {
                    sphere.attraction(s);
                }
            });
        };
        spheres.push(sphere);
        return sphere;
    };
    const reset = () => {
        sphere1.position.set(0, 0, 0);
        sphere1.velocity.set(0, 0, 0);
        sphere2.position.set(270, 0, 0);
        sphere2.velocity.set(0, 0, -1);
        sphere3.position.set(300, 0, 0);
        sphere3.velocity.set(0, 0, -1.6);
        sphere4.position.set(-125, 10, 0);
        sphere4.velocity.set(0, 0, 1.5);
        sphere5.position.set(50, 50, 0);
        sphere5.velocity.set(0, 0, 2.5);
    };
    const sphere1 = createSphere(new Vector3(0, 0, 0), 1000);
    const sphere2 = createSphere(
        new Vector3(270, 0, 0),
        33,
        new Vector3(0, 0, -1)
    );
    const sphere3 = createSphere(
        new Vector3(300, 0, 0),
        3,
        new Vector3(0, 0, -1.6)
    );
    const sphere4 = createSphere(
        new Vector3(-125, 10, 0),
        30,
        new Vector3(0, 0, 1.5)
    );
    const sphere5 = createSphere(
        new Vector3(50, 50, 0),
        10,
        new Vector3(0, 0, 2.5)
    );
    //const sphere6 = createSphere(new Vector3(50, 0, 0), 1);
    scene.add(sphere1, sphere2, sphere3, sphere4, sphere5);
    camera.position.set(10, 50, 500);
    let animate;
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const renderer = new WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        const controls = new OrbitControls(camera, canvas);
        animate = (time) => {
            renderer.render(scene, camera);
            controls.update();
            spheres.forEach((sphere) => {
                sphere.starAtraction();
            });
            requestAnimationFrame(animate);
        };
        animate(0);
    });
</script>

<canvas />
<button on:click={reset}>Reiniciar</button>

<style>
    button {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 0.5rem;
    }
</style>
