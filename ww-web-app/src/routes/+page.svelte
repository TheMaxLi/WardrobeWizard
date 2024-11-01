<script lang="ts">
	import Footer from '../components/Footer/Footer.svelte';
	import Header from '../components/Header/Header.svelte';
	import TryMeOutSection from '../components/TryMyOut/TryMeOutSection.svelte';
	import TutorialSection from '../components/Tutorial/TutorialSection.svelte';
	import Test from '../components/test.svelte';
</script>

<div class="flex flex-col">
	<Header />
	<Test clothingImageUrl={'https://media.istockphoto.com/id/483960103/photo/blank-black-t-shirt-front-with-clipping-path.jpg?s=612x612&w=0&k=20&c=d8qlXILMYhugXGw6zX7Jer2SLPrLPORfsDsfRDWc-50='}/>
	<TutorialSection />
	<TryMeOutSection />
	<Footer />
</div>
