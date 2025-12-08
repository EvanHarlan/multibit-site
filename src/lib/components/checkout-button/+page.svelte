<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Reusable checkout button component for Stripe payments
	 * Supports both one-time payments and subscriptions
	 *
	 * @example
	 * ```svelte
	 * <CheckoutButton
	 *   priceId="price_123"
	 *   mode="payment"
	 *   variant="primary"
	 * >
	 *   Buy Now
	 * </CheckoutButton>
	 * ```
	 */

	interface Props {
		/** Stripe price ID */
		priceId: string;
		/** Checkout mode: 'payment' for one-time, 'subscription' for recurring */
		mode: 'payment' | 'subscription';
		/** Visual style variant */
		variant?: 'primary' | 'secondary' | 'outline';
		/** Size of the button */
		size?: 'sm' | 'md' | 'lg';
		/** Full width on mobile */
		fullWidthMobile?: boolean;
		/** Disabled state */
		disabled?: boolean;
		/** Loading state */
		loading?: boolean;
		/** Custom CSS classes */
		class?: string;
		/** Button content */
		children: Snippet;
	}

	let {
		priceId,
		mode,
		variant = 'primary',
		size = 'md',
		fullWidthMobile = true,
		disabled = false,
		loading = $bindable(false),
		class: className = '',
		children
	}: Props = $props();

	/**
	 * Handle checkout process
	 */
	async function handleCheckout() {
		if (disabled || loading) return;

		loading = true;

		try {
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					priceId,
					mode
				})
			});

			if (!response.ok) {
				throw new Error('Failed to create checkout session');
			}

			const data = await response.json();

			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error('No checkout URL returned');
			}
		} catch (error) {
			console.error('Checkout error:', error);
			loading = false;
			// You can emit a custom event here for parent components to handle errors
			// dispatchEvent(new CustomEvent('checkout-error', { detail: error }));
		}
	}

	// Compute classes based on props
	const variantClasses = {
		primary:
			'bg-blue-accent hover:opacity-90 text-white border-transparent shadow-sm hover:shadow-md',
		secondary: 'bg-secondary hover:bg-gray-medium text-primary border-default',
		outline:
			'bg-transparent hover:bg-secondary text-primary border-default hover:border-blue-accent'
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	const baseClasses =
		'inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
	const responsiveClasses = fullWidthMobile ? 'w-full sm:w-auto' : '';
</script>

<button
	onclick={handleCheckout}
	disabled={disabled || loading}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[
		size
	]} {responsiveClasses} {className}"
	aria-busy={loading}
>
	{#if loading}
		<!-- Loading spinner -->
		<svg
			class="animate-spin h-5 w-5"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		<span>Processing...</span>
	{:else}
		{@render children()}
	{/if}
</button>

<style>
	button {
		position: relative;
		overflow: hidden;
	}

	/* Ripple effect on click */
	button:active:not(:disabled) {
		transform: scale(0.98);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
