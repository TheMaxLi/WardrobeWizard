<script lang="ts">
	import { onMount } from 'svelte';
	import posePkg from '@mediapipe/pose';
	import cameraPkg from '@mediapipe/camera_utils';
	import type { Results } from '@mediapipe/pose';
	import * as deeplab from '@tensorflow-models/deeplab';
	import * as tf from '@tensorflow/tfjs';
	const { Camera } = cameraPkg;
	const { Pose } = posePkg;

	// Add state for clothing image URL
	export let clothingImageUrl: string = '';

	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;
	let canvasCtx: CanvasRenderingContext2D | null = null;
	let clothingImage: HTMLImageElement;
	let isClothingLoaded = false;
	let isCentered = false;

	interface Landmark {
		x: number;
		y: number;
		z: number;
		visibility?: number;
	}
	type PoseLandmarks = Landmark[];


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
		if (!isClothingLoaded) {
			console.log('Clothing is not WORKING');
			return;
		}

		const clothingAspectRatio = clothingImage.width / clothingImage.height;
		const scaledClothingWidth = position.shoulderWidth * 1.8; // Add padding
		const scaledClothingHeight = scaledClothingWidth / clothingAspectRatio;

		const clothingX = position.shoulderCenter.x - scaledClothingWidth / 2;
		const clothingY = position.shoulderCenter.y - scaledClothingHeight * 0.2;

		// Draw clothing with alpha compositing
		ctx.globalAlpha = 0.9;
		ctx.drawImage(clothingImage, clothingX, clothingY, scaledClothingWidth, scaledClothingHeight);
		ctx.globalAlpha = 1.0;
	}

	function isFacingForward(landmarks: PoseLandmarks) {
		// Define indices for left and right shoulders and hips
		const leftShoulder = landmarks[11];
		const rightShoulder = landmarks[12];
		
		// Thresholds for determining alignment
		const xThreshold = 0.35; // Adjust based on sensitivity needed
		
		// Check x alignment for shoulders and hips
		const shouldersAligned = Math.abs(leftShoulder.x - rightShoulder.x) > xThreshold;
				
		// console.log("Shoulders X Difference:", Math.abs(leftShoulder.x - rightShoulder.x));
		// Return true if both shoulders and hips are aligned and consistent in depth
		return shouldersAligned;
	}

	// Process MediaPipe results
	 async function onResults(results: Results) {
		// Example usage in your code
		isCentered = isFacingForward(results.poseLandmarks)

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

	function cropImageToNonTransparentPixels(imageData: ImageData) {
		const data = imageData.data;
		let left = imageData.width,
			right = 0,
			top = imageData.height,
			bottom = 0;

		// Find the bounding box of non-transparent pixels
		for (let y = 0; y < imageData.height; y++) {
			for (let x = 0; x < imageData.width; x++) {
				const index = (y * imageData.width + x) * 4;
				if (data[index + 3] > 0) {
					// Check alpha value
					if (x < left) left = x;
					if (x > right) right = x;
					if (y < top) top = y;
					if (y > bottom) bottom = y;
				}
			}
		}

		// Crop dimensions
		const width = right - left + 1;
		const height = bottom - top + 1;

		// Create a new canvas to draw the cropped image
		const croppedCanvas = document.createElement('canvas');
		croppedCanvas.width = width;
		croppedCanvas.height = height;
		const croppedCtx = croppedCanvas.getContext('2d');
		if (croppedCtx) {
			// Draw the cropped image
			croppedCtx.drawImage(canvasElement, left, top, width, height, 0, 0, width, height);
		}

		return croppedCanvas.toDataURL(); // Return the cropped image as a data URL
	}

	onMount(async () => {
		// Initialize clothing image
		if (clothingImageUrl) {
			initClothing();
			const net = await deeplab.load({
				base: 'ade20k',
				modelUrl:
					'https://tfhub.dev/tensorflow/tfjs-model/deeplab/pascal/1/default/1/model.json?tfjs-format=file',
				quantizationBytes: 2
			});

			const segmentation = await net.segment(clothingImage);

			// Get the mask and dimensions
			const mask = segmentation.segmentationMap;
			const width = segmentation.width;
			const height = segmentation.height;
			const legend = segmentation.legend;

			canvasElement.width = width;
			canvasElement.height = height;
			const ctx = canvasElement.getContext('2d');

			if (!ctx) {
				return;
			}
			ctx.drawImage(clothingImage, 0, 0, width, height);

			const imageData = ctx.getImageData(0, 0, width, height);
			const data = imageData.data;
			initClothing();

			// Modify the pixels based on the segmentation mask
			for (let i = 0; i < data.length; i += 4) {
				// Extract pixel color values
				const red = data[i];
				const green = data[i + 1];
				const blue = data[i + 2];

				// Get corresponding mask value (from 0 to max class index)
				const maskValue = mask[i];

				// Check if it's background or a desired object (assume 0 is background)
				if (maskValue === 0) {
					// Background
					// Make sure it's truly white to avoid affecting the shirt
					if (red > 200 && green > 200 && blue > 200) {
						data[i + 3] = 0; // Set alpha to 0 (transparent) only for white pixels in the background
					}
				} else {
					// Preserve the pixel's alpha value fully if it's part of the object (like the black shirt)
					data[i + 3] = 255; // Fully opaque
				}
			}

			// Put the modified data back onto the canvas
			ctx.putImageData(imageData, 0, 0);

			// Get the output image URL from the canvas
			clothingImageUrl = canvasElement.toDataURL();
			initClothing();

			const croppedImageUrl = cropImageToNonTransparentPixels(imageData);
			clothingImageUrl = croppedImageUrl;
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

<div class="rounded-md">
	<video bind:this={videoElement} class="hidden" autoplay></video>
	<canvas bind:this={canvasElement} class="border border-black w-full"></canvas>
</div>
