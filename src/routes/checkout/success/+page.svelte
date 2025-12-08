<script lang="ts">
	import { onMount } from 'svelte';
	import Aurora from '$lib/components/aurora/+page.svelte';
	import Accordion from '$lib/components/accordion/+page.svelte';

	interface Props {
		data: {
			productType: string;
			customerEmail?: string;
			downloadToken: string;
		};
	}

	let { data }: Props = $props();

	let mounted = $state(false);
	let downloading = $state(false);
	let errorMessage = $state('');

	onMount(() => {
		mounted = true;
	});

	async function handleDownload() {
		downloading = true;
		errorMessage = '';

		try {
			const response = await fetch(`/api/download?token=${data.downloadToken}`);

			if (!response.ok) {
				const errorText = await response.text();
				if (response.status === 429) {
					throw new Error('Too many downloads. Please wait an hour and try again.');
				} else if (response.status === 403) {
					throw new Error('Download link has expired. Please contact support.');
				}
				throw new Error(errorText || 'Download failed');
			}

			const contentDisposition = response.headers.get('Content-Disposition');
			const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
			const filename = filenameMatch ? filenameMatch[1] : 'download.pdf';

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Download error:', error);
			errorMessage =
				error instanceof Error ? error.message : 'Failed to download file. Please contact support.';
		} finally {
			downloading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-primary relative overflow-hidden">
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
	<div class="max-w-xl w-full relative z-10 {mounted ? 'fade-in' : 'opacity-0'}">
		<!-- Success Icon -->
		<div class="text-center mb-8">
			<div
				class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4 scale-in"
			>
				<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<h1 class="text-2xl font-semibold text-primary mb-2">Payment Complete</h1>
			<p class="text-secondary">
				{data.productType === 'lifetime' ? 'Lifetime access' : 'Monthly subscription'} activated
			</p>
		</div>

		<!-- Main Card -->
		<div class="bg-secondary border border-default rounded-xl p-6 space-y-6">
			<!-- Download Button -->
			<button
				onclick={handleDownload}
				disabled={downloading}
				class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-invert text-primary-invert rounded-lg font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{#if downloading}
					<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Downloading...
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
					Download Product
				{/if}
			</button>

			<!-- Error Message -->
			{#if errorMessage}
				<div
					class="flex items-start gap-3 p-3 bg-error-bg border border-error-border rounded-lg text-sm text-error"
				>
					<svg
						class="w-5 h-5 flex-shrink-0 mt-0.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p>{errorMessage}</p>
				</div>
			{/if}

			<!-- Email Confirmation -->
			{#if data.customerEmail}
				<div class="text-sm text-secondary text-center">
					Confirmation sent to <span class="font-medium text-primary">{data.customerEmail}</span>
				</div>
			{/if}

			<!-- Important Info -->
			<Accordion title="Important Information" defaultOpen={false}>
				<div class="space-y-4 text-sm text-secondary">
					<div class="flex gap-3">
						<span class="text-secondary opacity-50">•</span>
						<div>
							<p class="font-medium text-primary mb-1">7-Day Access</p>
							<p>Your download link is valid for 7 days from purchase</p>
						</div>
					</div>
					<div class="flex gap-3">
						<span class="text-secondary opacity-50">•</span>
						<div>
							<p class="font-medium text-primary mb-1">3 Downloads</p>
							<p>You can download your product up to 3 times</p>
						</div>
					</div>
					<div class="flex gap-3">
						<span class="text-secondary opacity-50">•</span>
						<div>
							<p class="font-medium text-primary mb-1">Bookmark This Page</p>
							<p>Save this page to access your download anytime within the valid period</p>
						</div>
					</div>
				</div>
			</Accordion>
		</div>

		<!-- Actions -->
		<div class="flex gap-3 justify-center mt-6">
			<a
				href="/"
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				Home
			</a>
			<a
				href="/support"
				class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
				Support
			</a>
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

	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Theme-aware utilities using CSS variables */
	.bg-primary-invert {
		background-color: var(--text-primary);
	}

	.text-primary-invert {
		color: var(--bg-primary);
	}

	.bg-error-bg {
		background-color: rgba(239, 68, 68, 0.1);
	}

	.border-error-border {
		border-color: rgba(239, 68, 68, 0.3);
	}

	.text-error {
		color: rgb(239, 68, 68);
	}

	.dark .bg-error-bg {
		background-color: rgba(239, 68, 68, 0.15);
	}

	.dark .border-error-border {
		border-color: rgba(239, 68, 68, 0.4);
	}

	.dark .text-error {
		color: rgb(248, 113, 113);
	}
</style>
