<script>
	import { onMount } from "svelte";
	import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
	import {
		BoxGeometry,
		BufferAttribute,
		BufferGeometry,
		Mesh,
		MeshBasicMaterial,
		PerspectiveCamera,
		Scene,
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
	const numOfTriangles = 10;
	const positionsArray = new Float32Array(numOfTriangles * 3 * 3);
	for (let i = 0; i < positionsArray.length; i++) {
		positionsArray[i] = (Math.random() - 0.5) * 4;
	}

	const positionsAttribute = new BufferAttribute(positionsArray, 3);
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", positionsAttribute);
	const material = new MeshBasicMaterial({
		color: 0x00ff00,
	});
	const triangle = new Mesh(geometry, material);
	scene.add(triangle);

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
