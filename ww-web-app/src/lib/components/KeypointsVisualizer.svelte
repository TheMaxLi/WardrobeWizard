<script lang="ts">
	import type { Pose } from '@tensorflow-models/posenet';
	import { onMount } from 'svelte';
	// Keypoints data
	export let pose: Pose;

	let canvas: HTMLCanvasElement;
	const keypointRadius = 5;
	const pairs = [
		['nose', 'leftEye'],
		['leftEye', 'leftEar'],
		['nose', 'rightEye'],
		['rightEye', 'rightEar'],
		['leftShoulder', 'rightShoulder'],
		['leftShoulder', 'leftElbow'],
		['leftElbow', 'leftWrist'],
		['rightShoulder', 'rightElbow'],
		['rightElbow', 'rightWrist'],
		['leftShoulder', 'leftHip'],
		['rightShoulder', 'rightHip'],
		['leftHip', 'leftKnee'],
		['leftKnee', 'leftAnkle'],
		['rightHip', 'rightKnee'],
		['rightKnee', 'rightAnkle']
	];

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = 640;
		canvas.height = 640;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Draw keypoints
		for (const keypoint of pose.keypoints) {
			if (keypoint.score > 0.5) {
				drawKeypoint(ctx, keypoint.position.x, keypoint.position.y);
			}
		}

		// Connect keypoints
		drawSkeleton(ctx);
	});

	function drawKeypoint(ctx: CanvasRenderingContext2D, x: number, y: number) {
		ctx.beginPath();
		ctx.arc(x, y, keypointRadius, 0, 2 * Math.PI);
		ctx.fillStyle = 'red';
		ctx.fill();
	}

	function drawSkeleton(ctx: CanvasRenderingContext2D) {
		ctx.strokeStyle = 'blue';
		ctx.lineWidth = 2;

		pairs.forEach(([partA, partB]) => {
			const pointA = pose.keypoints.find((k) => k.part === partA);
			const pointB = pose.keypoints.find((k) => k.part === partB);

			if (pointA && pointB && pointA.score > 0.5 && pointB.score > 0.5) {
				ctx.beginPath();
				ctx.moveTo(pointA.position.x, pointA.position.y);
				ctx.lineTo(pointB.position.x, pointB.position.y);
				ctx.stroke();
			}
		});
	}
</script>

<canvas class="border" bind:this={canvas}></canvas>
