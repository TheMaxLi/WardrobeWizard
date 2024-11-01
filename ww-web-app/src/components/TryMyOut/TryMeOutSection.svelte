<script lang="ts">
	import Test from '../test.svelte';
</script>

<div class="py-7 w-full bg-[#4C5482] flex flex-col justify-between p-3">
	<h1 class="text-2xl font-serif text-center mb-8 text-white">Try me out!</h1>
	<div class="flex flex-col items-center space-y-3">
		<Test
			clothingImageUrl={'https://media.istockphoto.com/id/483960103/photo/blank-black-t-shirt-front-with-clipping-path.jpg?s=612x612&w=0&k=20&c=d8qlXILMYhugXGw6zX7Jer2SLPrLPORfsDsfRDWc-50='}
		/>
		<div class="bg-white rounded-md h-[60px] w-[400px]">Choose clothes</div>
	</div>
</div>
