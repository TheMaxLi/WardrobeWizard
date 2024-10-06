<script lang="ts">
	import { onMount } from 'svelte';
	import posePkg from '@mediapipe/pose'; // Import the entire module
  	const { Pose } = posePkg;
	import cameraPkg from '@mediapipe/camera_utils';
	const { Camera } = cameraPkg;
	import type { Results } from '@mediapipe/pose'; // Type-only import
  
	let videoElement: HTMLVideoElement;  // Video element for webcam feed
	let canvasElement: HTMLCanvasElement; // Canvas element for drawing landmarks
	let canvasCtx: CanvasRenderingContext2D | null = null; // Context of the canvas
  
	onMount(() => {
	  // Get the 2D context from the canvas element
	  if (canvasElement) {
		canvasCtx = canvasElement.getContext('2d');
	  }
  
	  // Initialize BlazePose
	  const pose = new Pose({
		locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
	  });
  
	  // Set options for BlazePose
	  pose.setOptions({
		modelComplexity: 1,
		smoothLandmarks: true,
		enableSegmentation: false,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5,
	  });
  
	  pose.onResults(onResults); // Callback function for processing results
  
	  // Start video capture
	  if (videoElement) {
		const camera = new Camera(videoElement, {
		  onFrame: async () => {
			await pose.send({ image: videoElement });
		  },
		  width: 640,
		  height: 480,
		});
		camera.start(); // Start the camera feed
	  }
	});
  
	// Process the results from BlazePose
	function onResults(results: Results) {
		console.log(results);
	  if (canvasCtx && canvasElement) {
		// Clear the canvas before drawing new landmarks
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		// Draw the captured image from the video
		canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  
		// Draw pose landmarks if they are available
		if (results.poseLandmarks && canvasElement) {
		  results.poseLandmarks.forEach((landmark) => {
			canvasCtx!.beginPath();
			canvasCtx!.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 5, 0, 2 * Math.PI);
			canvasCtx!.fillStyle = 'red'; // Color for the landmarks
			canvasCtx!.fill(); // Fill the landmark circle
		  });
		}
	  }
	}
  </script>
  
  <!-- Video element for the webcam feed -->
  <video bind:this={videoElement} class="input_video" autoplay></video>
  <!-- Canvas element for drawing landmarks -->
  <canvas bind:this={canvasElement} width="640" height="480"></canvas>
  
  <style>
	.input_video {
	  display: none; /* Hide the video element */
	}
	canvas {
	  border: 1px solid black; /* Optional: add a border for visibility */
	}
  </style>
  