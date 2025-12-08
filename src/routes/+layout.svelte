<script lang="ts">
	import Navbar from '$lib/components/navbar/+page.svelte';
	import HeroSection from '$lib/sections/hero-section/+page.svelte';
	import '../routes/layout.css';
</script>

<Navbar />
<HeroSection />

<main>
	<slot />
</main>
