<script>
	import shirtClick from './../../../public/static/shirt-click.jpg';
	import shirtShorts from './../../../public/static/shirt-shorts.jpg';
	import heart from './../../../public/static/heart.jpg';
	import camera from './../../../public/static/camera.jpg';

	const steps = [
		{
			id: 1,
			text: 'Meow meow meowmeowmeowm meowmeowmmoem wm',
			img: shirtClick
		},
		{
			id: 2,
			text: 'Meow meow meowmeowmeowm meowmeowmmoem wm',
			img: shirtShorts
		},
		{
			id: 3,
			text: 'Meow meow meowmeowmeowm meowmeowmmoem wm',
			img: heart
		},
		{
			id: 4,
			text: 'Meow meow meowmeowmeowm meowmeowmmoem wm',
			img: camera
		}
	];
</script>

<div class="w-full max-w-6xl mx-auto p-3">
	<h1 class="text-2xl font-serif text-center mb-8">How the magic starts...</h1>
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
		{#each steps as step (step.id)}
			<div class="rounded-lg p-2">
				<img src={step.img} alt="" class="aspect-square w-full bg-gray-200 mb-4 rounded-l" />
				<!-- <div class="aspect-square w-full bg-gray-200 mb-4 rounded-lg"></div> -->
				<div class="space-x-2 flex items-start justify-start">
					<div class="text-lg font-medium">{step.id}.</div>
					<p class="text-gray-600 text-xs break-words">{step.text}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
