<script lang="ts">
	import type { Pose } from '@tensorflow-models/posenet';
	import { onMount } from 'svelte';
	// Keypoints data
	export let pose: Pose;

	let canvas: HTMLCanvasElement;
	const keypointRadius = 5;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		canvas.width = 640;
		canvas.height = 640;

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw keypoints
		for (const keypoint of pose.keypoints) {
			if (keypoint.score > 0.5) {
				drawKeypoint(ctx, keypoint.position.x, keypoint.position.y);
			}
		}
	});

	function drawKeypoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.beginPath();
		ctx.arc(x, y, keypointRadius, 0, 2 * Math.PI);
		ctx.fillStyle = 'red'; // Color for keypoints
		ctx.fill();
	}
</script>

<canvas class="border" bind:this={canvas}></canvas>
