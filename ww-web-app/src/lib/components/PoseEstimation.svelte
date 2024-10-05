<script lang="ts">
	import type { Pose } from '$lib/utils/types';
	import * as posenet from '@tensorflow-models/posenet';
	import type { PosenetInput } from '@tensorflow-models/posenet/dist/types';
	import KeypointsVisualizer from './KeypointsVisualizer.svelte';
	let file: Blob;
	let pose: Pose;
	let photoUrl: any = '';

	async function estimatePose() {
		const userImage: PosenetInput = document.querySelector('#photo-preview') as HTMLImageElement;
		if (userImage) {
			console.log(userImage);
			const net = await posenet.load();
			pose = await net.estimateSinglePose(userImage);
			console.log(pose);
		} else {
			console.log('image not found');
		}
	}

	$: if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			// @ts-ignore
			photoUrl = e.target.result;
		};
		reader.readAsDataURL(file);
	}
	// @ts-ignore
	async function handlePhotoUpload(event) {
		file = event.target.files[0];
		setTimeout(async () => {
			await estimatePose();
		}, 1000);
	}
</script>

<div>
	<label for="photo-upload">Upload a photo:</label>
	<input id="photo-upload" type="file" accept="image/*" on:change={handlePhotoUpload} />
	<div>
		{#if photoUrl}
			<!-- svelte-ignore a11y-img-redundant-alt -->
			<img src={photoUrl} alt="Uploaded photo" id="photo-preview" />
		{/if}

		{#if pose}
			<KeypointsVisualizer {pose} />
		{/if}
	</div>
</div>

<style>
	img {
		height: 500px;
		width: 500px;
	}
</style>
