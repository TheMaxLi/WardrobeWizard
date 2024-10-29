<script lang="ts">
	import { onMount } from 'svelte';
	import posePkg from '@mediapipe/pose';
	import cameraPkg from '@mediapipe/camera_utils';
	import type { Results } from '@mediapipe/pose';
	const { Camera } = cameraPkg;
	const { Pose } = posePkg;

	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;
	let canvasCtx: CanvasRenderingContext2D | null = null;
	let clothingImage: HTMLImageElement;
	let isClothingLoaded = false;

	// Add state for clothing image URL
	export let clothingImageUrl: string = '';

	// Initialize clothing image
	function initClothing() {
		clothingImage = new Image();
		clothingImage.crossOrigin = 'anonymous';
		clothingImage.onload = () => {
			isClothingLoaded = true;
		};
		clothingImage.src = clothingImageUrl;
	}

	// Calculate clothing position based on pose landmarks
	function getClothingPosition(poseLandmarks: posePkg.NormalizedLandmarkList) {
		// MediaPipe pose landmarks for upper body
		const leftShoulder = poseLandmarks[11];
		const rightShoulder = poseLandmarks[12];
		const leftHip = poseLandmarks[23];
		const rightHip = poseLandmarks[24];

		// Calculate measurements
		const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x) * canvasElement.width;
		const shoulderCenter = {
			x: ((leftShoulder.x + rightShoulder.x) / 2) * canvasElement.width,
			y: ((leftShoulder.y + rightShoulder.y) / 2) * canvasElement.height
		};
		const torsoHeight =
			Math.abs((leftShoulder.y + rightShoulder.y) / 2 - (leftHip.y + rightHip.y) / 2) *
			canvasElement.height;

		return {
			shoulderWidth,
			shoulderCenter,
			torsoHeight
		};
	}

	// Draw clothing on the canvas
	function drawClothing(
		ctx: CanvasRenderingContext2D,
		position: ReturnType<typeof getClothingPosition>
	) {
		if (!isClothingLoaded) return;

		const clothingAspectRatio = clothingImage.width / clothingImage.height;
		const scaledClothingWidth = position.shoulderWidth * 1.2; // Add padding
		const scaledClothingHeight = scaledClothingWidth / clothingAspectRatio;

		const clothingX = position.shoulderCenter.x - scaledClothingWidth / 2;
		const clothingY = position.shoulderCenter.y - scaledClothingHeight * 0.2;

		// Draw clothing with alpha compositing
		ctx.globalAlpha = 0.9;
		ctx.drawImage(clothingImage, clothingX, clothingY, scaledClothingWidth, scaledClothingHeight);
		ctx.globalAlpha = 1.0;
	}

	// Process MediaPipe results
	function onResults(results: Results) {
		if (!canvasCtx || !canvasElement) return;

		// Clear canvas
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

		// Draw video frame
		canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

		// If pose landmarks are detected and clothing is loaded
		if (results.poseLandmarks && isClothingLoaded) {
			// Get clothing position based on pose
			const position = getClothingPosition(results.poseLandmarks);

			// Draw the clothing
			drawClothing(canvasCtx, position);

			// Optionally draw landmarks for debugging
			results.poseLandmarks.forEach((landmark) => {
				canvasCtx!.beginPath();
				canvasCtx!.arc(
					landmark.x * canvasElement.width,
					landmark.y * canvasElement.height,
					2, // Smaller radius for less intrusive debugging
					0,
					2 * Math.PI
				);
				canvasCtx!.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
				canvasCtx!.fill();
			});
		}
	}

	onMount(() => {
		// Initialize clothing image
		if (clothingImageUrl) {
			initClothing();
		}

		// Get canvas context
		if (canvasElement) {
			canvasCtx = canvasElement.getContext('2d');
		}

		// Initialize MediaPipe Pose
		const pose = new Pose({
			locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
		});

		pose.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			enableSegmentation: false,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5
		});

		pose.onResults(onResults);

		// Start video capture
		if (videoElement) {
			const camera = new Camera(videoElement, {
				onFrame: async () => {
					await pose.send({ image: videoElement });
				},
				width: 640,
				height: 480
			});
			camera.start();
		}
	});
</script>

<video bind:this={videoElement} class="input_video" autoplay></video>
<canvas bind:this={canvasElement} width="640" height="480"></canvas>

<style>
	.input_video {
		display: none;
	}
	canvas {
		border: 1px solid black;
	}
</style>
