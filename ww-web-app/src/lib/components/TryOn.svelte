<script lang="ts">
	import { loadGANModel } from '$lib/models/gan';
	import type { Rank, Tensor } from '@tensorflow/tfjs';
	let userPose: Tensor<Rank>;
	let segmentedClothing: Tensor<Rank>;
	let finalImage;

	async function tryOnClothing() {
		const ganModel = await loadGANModel();
		finalImage = ganModel.predict([segmentedClothing, userPose]);
	}
</script>

<button on:click={tryOnClothing}>Try On</button>
