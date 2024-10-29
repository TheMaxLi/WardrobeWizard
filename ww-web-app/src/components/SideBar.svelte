<script lang="ts">
	import Icon from '@iconify/svelte';
	let isOpen = false;
	$: console.log(isOpen);
</script>

<div class="relative">
	<button on:click={() => (isOpen = !isOpen)}>
		<Icon icon="ph-list" class="absolute left-10 top-10" />
	</button>

	{#if isOpen}
		<div class="bg-slate-600 absolute h-full">helpp lol</div>
	{/if}
</div>
