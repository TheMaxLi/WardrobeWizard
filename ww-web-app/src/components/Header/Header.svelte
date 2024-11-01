<script lang="ts">
	import ArrowDownSvg from '../svg/ArrowDownSVG.svelte';
	import SideBar from './SideBar.svelte';
	import WWLogo from '../../../public/static/WWLogo.gif';
</script>

<div class="flex flex-col mb-20">
	<div class="border-x-0 border border-white-10 py-3 flex justify-center mt-10 items-center">
		<SideBar />
		<span class="text-white text-4xl font-Georgia">WW</span>
	</div>
	<div class="flex flex-col justify-center items-center my-8 pt-14">
		<img class="w-16 h-16 md:w-24 md:h-24" src={WWLogo} alt="wwLogo" />
		<p
			class="text-white font-Georgia text-2xl md:text-4xl lg:text-5xl w-56 md:w-96 text-center my-2"
		>
			Your very own wardrobe wizard
		</p>
		<p
			class="font-DMSans text-sm md:text-base lg:text-lg text-white w-96 md:w-[520px] text-center md:my-4"
		>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. meow
		</p>
		<div class="flex justify-center items-center mt-6">
			<button class="rounded-md bg-[#FFF8E8] flex px-5 py-1 items-center justify-between">
				<p class="text-[#4C5482] font-Georgia text-base md:text-lg">Let's get started</p>
				<ArrowDownSvg className="text-[#4C5482] w-5 h-5 md:w-6 md:h-6" />
			</button>
		</div>
	</div>
</div>
