<script>
	import { onMount } from 'svelte';
	import { Pose } from '@mediapipe/pose';
	import { Camera } from '@mediapipe/camera_utils';
  
	let videoElement;
	let canvasElement;
	let canvasCtx;
  
	onMount(() => {
	  // Initialize BlazePose
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
	  const camera = new Camera(videoElement, {
		onFrame: async () => {
		  await pose.send({ image: videoElement });
		},
		width: 640,
		height: 480
	  });
	  camera.start();
	});
  
	function onResults(results) {
	  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  
	  if (results.poseLandmarks) {
		// Draw landmarks here
		results.poseLandmarks.forEach((landmark) => {
		  canvasCtx.beginPath();
		  canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 5, 0, 2 * Math.PI);
		  canvasCtx.fillStyle = "red";
		  canvasCtx.fill();
		});
	  }
	}
  </script>
  
  <video bind:this={videoElement} class="input_video"></video>
  <canvas bind:this={canvasElement} width="640" height="480"></canvas>
  
  <style>
	.input_video {
	  display: none;
	}
	canvas {
	  border: 1px solid black;
	}
  </style>