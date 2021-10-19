<script>
	import { onMount } from "svelte";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
	import {
		AmbientLight,
		BoxGeometry,
		BufferAttribute,
		BufferGeometry,
		DoubleSide,
		Mesh,
		MeshBasicMaterial,
		MeshNormalMaterial,
		MeshStandardMaterial,
		PerspectiveCamera,
		PlaneGeometry,
		PointLight,
		Scene,
		SphereGeometry,
		WebGLRenderer,
	} from "three";
	const camera = new PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	const scene = new Scene();
	camera.position.z = 5;
	//const material = new MeshNormalMaterial({ flatShading: true });
	const material = new MeshStandardMaterial();
	const ambientLight = new AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
	const pointLight = new PointLight(0xffffff, 0.5);
	pointLight.position.x = 2;
	pointLight.position.y = 3;
	pointLight.position.z = 4;
	scene.add(pointLight);

	const sphere = new Mesh(new SphereGeometry(0.5, 16, 16), material);
	const plane = new Mesh(new PlaneGeometry(), material);
	scene.add(sphere);
	//scene.add(plane);

	onMount(() => {
		const canvas = document.querySelector("canvas");
		const renderer = new WebGLRenderer({
			canvas,
		});
		const controls = new OrbitControls(camera, canvas);
		controls.enableDamping = true;

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		const animate = () => {
			controls.update();
			renderer.render(scene, camera);

			requestAnimationFrame(animate);
		};
		animate();
	});
</script>

<canvas />
