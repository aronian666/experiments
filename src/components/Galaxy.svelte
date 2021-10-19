<script>
    import {
        AdditiveBlending,
        BufferAttribute,
        BufferGeometry,
        Clock,
        Color,
        DirectionalLight,
        PerspectiveCamera,
        Points,
        Scene,
        ShaderMaterial,
        WebGLRenderer,
    } from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import * as dat from "dat.gui";
    import { onMount } from "svelte";
    const gui = new dat.GUI();
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        100
    );
    const parameters = {};
    parameters.count = 250000;
    parameters.size = 0.005;
    parameters.radius = 5;
    parameters.branches = 4;
    parameters.spin = 1;
    parameters.randomness = 0.25;
    parameters.randomnessPower = 3;
    parameters.insideColor = "#ff6030";
    parameters.outsideColor = "#a7a7ff";
    parameters.starSize = 12;
    let geometry = null;
    let material = null;
    let points = null;

    const scene = new Scene();

    const generateGalaxy = () => {
        if (points !== null) {
            geometry.dispose();
            material.dispose();
            scene.remove(points);
        }
        geometry = new BufferGeometry();
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const insideColor = new Color(parameters.insideColor);
        const outsideColor = new Color(parameters.outsideColor);
        const aRandom = new Float32Array(parameters.count);
        const aPosition = new Float32Array(parameters.count * 3);
        for (let i = 0; i < parameters.count; i++) {
            aRandom[i] = Math.random();
            const i3 = i * 3;
            const radius = Math.random() * parameters.radius;
            const branchAngle =
                ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
            aPosition[i3] =
                Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                parameters.randomness *
                radius;
            aPosition[i3 + 1] =
                Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                parameters.randomness *
                radius;
            aPosition[i3 + 2] =
                Math.pow(Math.random(), parameters.randomnessPower) *
                (Math.random() < 0.5 ? 1 : -1) *
                parameters.randomness *
                radius;
            positions[i3] = Math.cos(branchAngle) * radius;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = Math.sin(branchAngle) * radius;
            const mixedColor = insideColor.clone();
            mixedColor.lerp(outsideColor, radius / parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }
        geometry.setAttribute("position", new BufferAttribute(positions, 3));
        geometry.setAttribute("color", new BufferAttribute(colors, 3));
        geometry.setAttribute("aRandom", new BufferAttribute(aRandom, 1));
        geometry.setAttribute("aPosition", new BufferAttribute(aPosition, 3));
        material = new ShaderMaterial({
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true,
            uniforms: {
                uSize: {
                    value: parameters.starSize * renderer.getPixelRatio(),
                },
                uTime: { value: 0 },
            },
            vertexShader: `
				attribute float aRandom;
				attribute vec3 aPosition;
				uniform float uSize;
				uniform float uTime;

				varying vec3 vColor;

				void main() {
					vec4 modelPosition = modelMatrix * vec4(position, 1.0);
					float distanceOfCenter = length(modelPosition.xz);
					float angle = atan(modelPosition.x, modelPosition.z);
					float angleOffset = (1.0 / distanceOfCenter) * 0.3 * uTime;
					angle += angleOffset;
					modelPosition.x = sin(angle) * distanceOfCenter;
					modelPosition.z = cos(angle) * distanceOfCenter;
					modelPosition.xyz += aPosition;

					vec4 viewPosition = viewMatrix * modelPosition;
					vec4 projectedPosition = projectionMatrix * viewPosition;
					gl_Position = projectedPosition;
					gl_PointSize = uSize * aRandom;
					gl_PointSize *= (1.0 / - viewPosition.z);
					vColor = color;
				}
			`,
            fragmentShader: `
				precision mediump float;

				varying vec3 vColor;
				void main() {
					float strength = distance(gl_PointCoord, vec2(0.5));
					strength = 1.0 - strength;
					strength = pow(strength, 5.0);
					vec3 color = mix(vec3(0.0), vColor, strength);
					gl_FragColor = vec4(vec3(color), 1.0);
				}
			`,
        });
        points = new Points(geometry, material);
        scene.add(points);
    };
    gui.add(parameters, "starSize")
        .min(10)
        .max(30)
        .step(1)
        .onFinishChange(generateGalaxy);
    gui.add(parameters, "count")
        .min(100000)
        .max(1000000)
        .step(100)
        .onFinishChange(generateGalaxy);
    gui.add(parameters, "radius")
        .min(0.01)
        .max(20)
        .step(0.01)
        .onFinishChange(generateGalaxy);
    gui.add(parameters, "branches")
        .min(2)
        .max(20)
        .step(1)
        .onFinishChange(generateGalaxy);
    gui.add(parameters, "randomness")
        .min(0)
        .max(2)
        .step(0.001)
        .onFinishChange(generateGalaxy);
    gui.add(parameters, "randomnessPower")
        .min(1)
        .max(10)
        .step(0.001)
        .onFinishChange(generateGalaxy);
    gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
    gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

    const directionalLight = new DirectionalLight("#ffffff", 3);

    //directionalLight.position.set(2, 2, 2);
    //scene.add(directionalLight);
    let renderer;
    camera.position.set(3, 3, 2);
    onMount(() => {
        const canvas = document.querySelector("canvas");
        const controls = new OrbitControls(camera, canvas);
        renderer = new WebGLRenderer({
            canvas,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        const clock = new Clock();
        generateGalaxy();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            //points.rotation.y = (Math.PI * elapsedTime) / 100;
            points.material.uniforms.uTime.value = elapsedTime;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
            controls.update();
        };
        animate();
    });
</script>

<canvas />
