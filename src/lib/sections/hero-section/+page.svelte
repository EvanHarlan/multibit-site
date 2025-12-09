<script lang="ts">
	import { onMount } from 'svelte';
	import Aurora from '$lib/components/aurora/+page.svelte';
	import CheckoutButton from '$lib/components/checkout-button/+page.svelte';
	const LIFETIME_PRICE_ID = 'price_1SbWy0RtXHUOYVOaVuxALYO8';
	const MONTHLY_PRICE_ID = 'price_1SbWzBRtXHUOYVOaFXpWIwdw';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<section
	id="hero"
	class="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary"
>
	<!-- Subtle Aurora Background -->
	<div class="absolute inset-0 pointer-events-none opacity-[0.08]">
		<Aurora
			colorStops={['#4a91ce', '#6ba3d8', '#4a91ce']}
			blend={0.3}
			amplitude={0.8}
			speed={0.4}
		/>
	</div>

	<!-- Content -->
	<div class="relative z-10 w-full max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
		<div class={mounted ? 'fade-in' : 'opacity-0'}>
			<!-- Main Heading -->
			<h1
				class="text-4xl sm:text-5xl md:text-7xl font-bold text-primary mb-8 leading-tight tracking-tight"
			>
				Build Something
				<span class="block mt-3">Remarkable</span>
			</h1>

			<!-- Subheading -->
			<p class="text-lg sm:text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-12 sm:mb-16">
				Modern, minimal, and powerful. The tools you need to create exceptional digital experiences.
			</p>

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 sm:mb-32">
				<CheckoutButton priceId={LIFETIME_PRICE_ID} mode="payment" variant="primary" size="lg">
					Buy Lifetime Access
				</CheckoutButton>

				<CheckoutButton
					priceId={MONTHLY_PRICE_ID}
					mode="subscription"
					variant="secondary"
					size="lg"
				>
					Buy Monthly Access
				</CheckoutButton>
			</div>

			<!-- Feature Highlights - Hidden on Mobile -->
			<div class="hidden sm:grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
				<div class="bg-secondary border border-default rounded-xl p-8 hover-lift">
					<div
						class="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-5"
					>
						<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-primary mb-3">Lightning Fast</h3>
					<p class="text-sm text-secondary leading-relaxed">
						Optimized for speed and performance at every level
					</p>
				</div>

				<div class="bg-secondary border border-default rounded-xl p-8 hover-lift">
					<div
						class="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-5"
					>
						<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-primary mb-3">Secure</h3>
					<p class="text-sm text-secondary leading-relaxed">
						Enterprise-grade security built into the foundation
					</p>
				</div>

				<div class="bg-secondary border border-default rounded-xl p-8 hover-lift">
					<div
						class="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-5"
					>
						<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
							/>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-primary mb-3">Scalable</h3>
					<p class="text-sm text-secondary leading-relaxed">
						Grows seamlessly with your business needs
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.fade-in {
		animation: fadeIn 0.6s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.hover-lift {
		transition: transform 0.2s ease;
	}

	.hover-lift:hover {
		transform: translateY(-4px);
	}
</style>
