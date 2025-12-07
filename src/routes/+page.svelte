<script lang="ts">
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { loadStripe } from '@stripe/stripe-js';

	const LIFETIME_PRICE_ID = 'price_1SbWy0RtXHUOYVOaVuxALYO8';
	const MONTHLY_PRICE_ID = 'price_1SbWzBRtXHUOYVOaFXpWIwdw';

	async function onclick(isSubscription: boolean) {
		try {
			// Make request to the backend to create checkout session
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					priceId: isSubscription ? MONTHLY_PRICE_ID : LIFETIME_PRICE_ID,
					mode: isSubscription ? 'subscription' : 'payment'
				})
			});

			if (!response.ok) {
				throw new Error('Failed to create checkout session');
			}

			const data = await response.json();

			// Use standard redirect instead of redirectToCheckout
			if (data.url) {
				window.location.href = data.url;
			} else {
				throw new Error('No checkout URL returned');
			}
		} catch (error) {
			console.error('Checkout error:', error);
			// Handle error appropriately (show error message to user, etc.)
		}
	}
</script>

<div class="flex justify-center items-center gap-10 mt-10">
	<button
		onclick={() => onclick(false)}
		class="cursor-pointer w-30 h-auto border rounded-lg text-amber-50 bg-gray-800 px-4 py-2"
	>
		Buy Lifetime access
	</button>
	<button
		onclick={() => onclick(true)}
		class="cursor-pointer w-30 h-auto border rounded-lg text-amber-50 bg-gray-800 px-4 py-2"
	>
		Buy monthly access
	</button>
</div>
