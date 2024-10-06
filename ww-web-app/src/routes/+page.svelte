<script lang="ts">
	import PoseEstimationTensor from '$lib/components/PoseEstimationTensor.svelte';
	import ClothingSegmentation from '$lib/components/ClothingSegmentation.svelte';
	import TryOn from '$lib/components/TryOn.svelte';
</script>

<div class="flex flex-col">
	<PoseEstimationTensor />
	<ClothingSegmentation />
	<TryOn />
</div>
