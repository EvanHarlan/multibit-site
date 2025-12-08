<script lang="ts">
	import { onMount } from 'svelte';
	import Aurora from '$lib/components/aurora/+page.svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	function tryAgain() {
		window.history.back();
	}

	function goHome() {
		window.location.href = '/';
	}
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-primary relative overflow-hidden">
	<!-- Subtle Aurora Background -->
	<!-- <div class="absolute inset-0 pointer-events-none opacity-[0.08]">
		<Aurora
			colorStops={['#ef4444', '#dc2626', '#ef4444']}
			blend={0.3}
			amplitude={0.8}
			speed={0.4}
		/>
	</div> -->

	<!-- Content -->
	<div class="max-w-xl w-full relative z-10 {mounted ? 'fade-in' : 'opacity-0'}">
		<!-- Error Icon -->
		<div class="text-center mb-8">
			<div
				class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4 scale-in"
			>
				<svg class="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</div>
			<h1 class="text-2xl font-semibold text-primary mb-2">Payment Failed</h1>
			<p class="text-secondary">No charges were made to your account</p>
		</div>

		<!-- Main Card -->
		<div class="bg-secondary border border-default rounded-xl p-6 space-y-6">
			<!-- Message -->
			<div class="text-center space-y-2">
				<p class="text-primary font-medium">Something went wrong with your payment</p>
				<p class="text-sm text-secondary">
					This can happen for several reasons. Please try again or contact your bank.
				</p>
			</div>

			<!-- Common Reasons -->
			<div class="space-y-3 text-sm text-secondary">
				<p class="font-medium text-primary text-center mb-3">Common reasons</p>
				<div class="flex gap-3">
					<span class="text-secondary opacity-50">•</span>
					<p>Insufficient funds or card limit reached</p>
				</div>
				<div class="flex gap-3">
					<span class="text-secondary opacity-50">•</span>
					<p>Card declined by your bank</p>
				</div>
				<div class="flex gap-3">
					<span class="text-secondary opacity-50">•</span>
					<p>Expired card or incorrect details</p>
				</div>
				<div class="flex gap-3">
					<span class="text-secondary opacity-50">•</span>
					<p>Network or connection issues</p>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-3 pt-2">
				<button
					onclick={tryAgain}
					class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-error text-error-text rounded-lg font-medium transition-all hover:opacity-90"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
					Try Again
				</button>
				<button
					onclick={goHome}
					class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary border border-default rounded-lg font-medium text-primary transition-all hover:bg-secondary"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
					Go Home
				</button>
			</div>
		</div>

		<!-- Support Link -->
		<div class="text-center mt-6">
			<p class="text-sm text-secondary">
				Need help? <a
					href="/support"
					class="font-medium text-primary hover:text-blue-accent transition-colors"
					>Contact Support</a
				>
			</p>
		</div>
	</div>
</div>

<style>
	.fade-in {
		animation: fadeIn 0.4s ease-out;
	}

	.scale-in {
		animation: scaleIn 0.4s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* Error color styling */
	.text-error {
		color: #ef4444;
	}

	.bg-error {
		background-color: #ef4444;
	}

	.text-error-text {
		color: #ffffff;
	}
</style>
