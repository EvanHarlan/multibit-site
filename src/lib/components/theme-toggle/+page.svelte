<script lang="ts">
	/**
	 * Theme toggle button with smooth icon transition
	 * Switches between light and dark mode
	 */

	import { themeStore } from '$lib/stores/theme.svelte';

	function toggle() {
		themeStore.toggle();
	}
</script>

<button
	onclick={toggle}
	class="p-2 rounded-lg transition-colors bg-secondary hover:bg-gray-medium"
	aria-label="Toggle theme"
	title={themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if themeStore.theme === 'dark'}
		<!-- Sun icon (switch to light mode) -->
		<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
	{:else}
		<!-- Moon icon (switch to dark mode) -->
		<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	{/if}
</button>

<style>
	button {
		animation: fadeIn 0.3s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
