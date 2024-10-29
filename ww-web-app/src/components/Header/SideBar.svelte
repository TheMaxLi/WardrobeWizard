<script lang="ts">
	import Icon from '@iconify/svelte';
	let isOpen = false;
</script>

<div class="absolute left-2">
	<button on:click={() => (isOpen = !isOpen)}>
		<Icon icon="ph-list-bold" class="text-white text-4xl" />
	</button>
	{#if isOpen}
		<div class="bg-slate-600 h-full absolute">helpp lol</div>
	{/if}
</div>
