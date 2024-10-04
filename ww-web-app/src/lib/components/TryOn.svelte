<script lang="ts">
	import { loadGANModel } from '$lib/models/gan';
	let userPose, segmentedClothing;
	let finalImage;

	async function tryOnClothing() {
		const ganModel = await loadGANModel();
		finalImage = ganModel.predict([segmentedClothing, userPose]);
	}
</script>

<button on:click={tryOnClothing}>Try On</button>
