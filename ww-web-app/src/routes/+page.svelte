<script lang="ts">
	import PoseEstimation from '$lib/components/PoseEstimation.svelte';
	import ClothingSegmentation from '$lib/components/ClothingSegmentation.svelte';
	import TryOn from '$lib/components/TryOn.svelte';
</script>

<div class="flex flex-col">
	<PoseEstimation />
	<ClothingSegmentation />
	<TryOn />
</div>
