<script lang="ts">
	import CheckoutButton from '$lib/components/checkout-button/+page.svelte';

	const LIFETIME_PRICE_ID = 'price_1SbWy0RtXHUOYVOaVuxALYO8';
	const MONTHLY_PRICE_ID = 'price_1SbWzBRtXHUOYVOaFXpWIwdw';
</script>

<div class="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 mt-10 px-4">
	<CheckoutButton priceId={LIFETIME_PRICE_ID} mode="payment" variant="primary" size="lg">
		Buy Lifetime Access
	</CheckoutButton>

	<CheckoutButton priceId={MONTHLY_PRICE_ID} mode="subscription" variant="secondary" size="lg">
		Buy Monthly Access
	</CheckoutButton>
</div>
