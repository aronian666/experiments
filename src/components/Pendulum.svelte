<script>
  import { onMount } from "svelte";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import Pendulum from "./js/Pendulum";
  import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  const scene = new Scene();
  let pendulum = new Pendulum(4, Math.PI / 2, Math.PI);
  scene.add(pendulum);
  camera.position.z = 10;
  onMount(() => {
    const canvas = document.querySelector("canvas");
    const renderer = new WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    const controls = new OrbitControls(camera, canvas);
    const animate = (time) => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      pendulum.move();
      pendulum = pendulum;
      controls.update();
    };
    animate(0);
    return () => {
      cube.geometry.dispose();
      cube.material.dispose();
      scene.remove(cube);
    };
  });
</script>

<canvas />
<section>
  <h2>Propiedades</h2>
  <div>
    <b>Velocidad angular (radianes)</b>
    {pendulum.theta_dot}
    <b>Angulo (radianes)</b>
    {pendulum.theta}
    <b>Aceleracion(radianes)</b>
    {pendulum.double_theta()}
  </div>
</section>

<style>
  section {
    position: absolute;
    top: 0;
    left: 0;
    background-color: white;
  }
  div {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>
