<script lang="ts">
	import { loadUNetModel } from '$lib/models/uNet';
	import type { NamedTensorMap, Tensor } from '@tensorflow/tfjs';
	let clothingImage: Tensor | Tensor[] | NamedTensorMap;
	let segmentation;

	async function segmentClothing() {
		const model = await loadUNetModel();
		segmentation = model.predict(clothingImage);
	}
</script>

<div>
	<input type="file" bind:value={clothingImage} />
	<button on:click={segmentClothing}>Segment Clothing</button>
</div>
