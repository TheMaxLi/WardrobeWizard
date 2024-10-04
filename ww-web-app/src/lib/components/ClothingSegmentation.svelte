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

<input type="file" on:change={(e) => (clothingImage = e.target.files[0])} />
<button on:click={segmentClothing}>Segment Clothing</button>
