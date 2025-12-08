<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Sleek, minimalistic accordion component with smooth animations
	 * Can be used standalone or nested for multi-level navigation
	 *
	 * @example
	 * ```svelte
	 * <Accordion title="Services">
	 *   <a href="/services/web">Web Development</a>
	 *   <a href="/services/mobile">Mobile Apps</a>
	 * </Accordion>
	 * ```
	 */

	interface Props {
		/** Title text displayed in accordion header */
		title: string;
		/** Whether accordion starts in open state */
		defaultOpen?: boolean;
		/** Optional icon to display (accepts emoji or SVG) */
		icon?: string;
		/** Custom class for styling */
		class?: string;
		/** Content to render inside accordion */
		children: Snippet;
	}

	let { title, defaultOpen = false, icon, class: className = '', children }: Props = $props();

	let isOpen = $state(defaultOpen);

	/**
	 * Toggle accordion open/closed state
	 */
	function toggle() {
		isOpen = !isOpen;
	}
</script>

<div class="accordion {className}">
	<button onclick={toggle} class="accordion-header" aria-expanded={isOpen}>
		<span class="accordion-title">
			{#if icon}
				<span class="accordion-icon">{icon}</span>
			{/if}
			{title}
		</span>
		<svg
			class="accordion-chevron"
			class:rotate={isOpen}
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 8l4 4 4-4" />
		</svg>
	</button>

	<div class="accordion-content" class:open={isOpen}>
		<div class="accordion-inner">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.accordion {
		width: 100%;
	}

	.accordion-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-primary);
		text-align: left;
		border-radius: 0.5rem;
		transition: background-color 0.2s;
	}

	.accordion-header:hover {
		background-color: var(--bg-secondary);
	}

	.accordion-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.accordion-icon {
		font-size: 1.125rem;
	}

	.accordion-chevron {
		transition: transform 0.2s ease;
		flex-shrink: 0;
	}

	.accordion-chevron.rotate {
		transform: rotate(180deg);
	}

	.accordion-content {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.3s ease;
	}

	.accordion-content.open {
		max-height: 500px;
	}

	.accordion-inner {
		padding: 0.5rem 1rem 1rem 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	/* Link styling for content */
	.accordion-inner :global(a) {
		padding: 0.5rem 0.75rem;
		color: var(--text-secondary);
		text-decoration: none;
		border-radius: 0.375rem;
		transition: all 0.2s;
		font-size: 0.875rem;
	}

	.accordion-inner :global(a:hover) {
		color: var(--blue-accent);
		background-color: var(--bg-secondary);
	}
</style>
