<script lang="ts">
	import Navbar from '$lib/components/navbar/+page.svelte';
	import '../routes/layout.css';

	let { children } = $props();
</script>

<Navbar />

<main>
	{@render children()}
</main>
