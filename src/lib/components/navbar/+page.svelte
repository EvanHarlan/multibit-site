<script lang="ts">
	/**
	 * Modern, responsive navigation bar component
	 * Features: dropdown menus (desktop), accordions (mobile), active route highlighting
	 */

	import { page } from '$app/stores';
	import Accordion from '$lib/components/accordion/+page.svelte';
	import ThemeToggle from '$lib/components/theme-toggle/+page.svelte';

	let mobileMenuOpen = $state(false);
	let activeDropdown = $state<string | null>(null);

	interface NavLink {
		label: string;
		href?: string;
		items?: { label: string; href: string; description?: string }[];
	}

	/**
	 * Navigation structure with nested routes
	 */
	const navLinks: NavLink[] = [
		{ href: '/', label: 'Home' },
		{
			label: 'Frontend',
			items: [
				{ label: 'About', href: '/pages/about', description: 'Learn about us' },
				{ label: 'Services', href: '/pages/services', description: 'What we offer' },
				{ label: 'Pricing', href: '/pages/pricing', description: 'View our plans' },
				{ label: 'Contact', href: '/pages/contact', description: 'Get in touch' }
			]
		},
		{
			label: 'Resources',
			items: [
				{ label: 'Documentation', href: '/docs', description: 'Technical guides' },
				{ label: 'API Reference', href: '/api', description: 'API documentation' },
				{ label: 'Support', href: '/support', description: 'Get help' }
			]
		}
	];

	/**
	 * Check if a route or its children are active
	 */
	function isActive(link: NavLink): boolean {
		if (link.href) {
			return link.href === '/'
				? $page.url.pathname === '/'
				: $page.url.pathname.startsWith(link.href);
		}
		if (link.items) {
			return link.items.some((item) => $page.url.pathname.startsWith(item.href));
		}
		return false;
	}

	/**
	 * Toggle dropdown menu on desktop
	 */
	function toggleDropdown(label: string) {
		activeDropdown = activeDropdown === label ? null : label;
	}

	/**
	 * Close all dropdowns
	 */
	function closeDropdowns() {
		activeDropdown = null;
	}

	/**
	 * Toggle mobile menu
	 */
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	/**
	 * Close mobile menu
	 */
	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:window onclick={closeDropdowns} />

<nav class="bg-primary border-b border-default sticky top-0 z-50 shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<span class="text-xl font-bold text-primary hidden sm:block">MultiBit</span>
			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center space-x-1">
				{#each navLinks as link}
					{#if link.href}
						<!-- Simple link -->
						<a
							href={link.href}
							class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(
								link
							)
								? 'bg-blue-accent/10 text-blue-accent'
								: 'text-primary hover:bg-secondary'}"
						>
							{link.label}
						</a>
					{:else if link.items}
						<!-- Dropdown menu -->
						<div class="relative dropdown">
							<button
								onclick={(e) => {
									e.stopPropagation();
									toggleDropdown(link.label);
								}}
								class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 {isActive(
									link
								)
									? 'bg-blue-accent/10 text-blue-accent'
									: 'text-primary hover:bg-secondary'}"
							>
								{link.label}
								<svg
									class="w-4 h-4 transition-transform {activeDropdown === link.label
										? 'rotate-180'
										: ''}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>

							{#if activeDropdown === link.label}
								<div class="dropdown-menu">
									<div class="py-2">
										{#each link.items as item}
											<a href={item.href} class="dropdown-item" onclick={closeDropdowns}>
												<div class="font-medium text-primary">{item.label}</div>
												{#if item.description}
													<div class="text-xs text-secondary">{item.description}</div>
												{/if}
											</a>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<!-- CTA Button & Theme Toggle (Desktop) -->
			<div class="hidden md:flex items-center gap-2">
				<ThemeToggle />
				<a
					href="/checkout"
					class="px-4 py-2 bg-blue-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm hover:shadow-md"
				>
					Get Started
				</a>
			</div>

			<!-- Mobile Menu Button -->
			<div class="flex md:hidden items-center gap-2">
				<ThemeToggle />
				<button
					onclick={toggleMobileMenu}
					class="p-2 rounded-lg text-primary hover:bg-secondary transition-colors"
					aria-label="Toggle menu"
					aria-expanded={mobileMenuOpen}
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-default bg-primary animate-slideDown">
				<div class="px-4 py-3 space-y-1">
					{#each navLinks as link}
						{#if link.href}
							<!-- Simple link -->
							<a
								href={link.href}
								onclick={closeMobileMenu}
								class="block px-4 py-3 rounded-lg text-base font-medium transition-colors {isActive(
									link
								)
									? 'bg-blue-accent/10 text-blue-accent'
									: 'text-primary hover:bg-secondary'}"
							>
								{link.label}
							</a>
						{:else if link.items}
							<!-- Accordion for nested items -->
							<Accordion title={link.label}>
								{#each link.items as item}
									<a
										href={item.href}
										onclick={closeMobileMenu}
										class="text-primary hover:text-blue-accent transition-colors"
									>
										{item.label}
									</a>
								{/each}
							</Accordion>
						{/if}
					{/each}
					<a
						href="/checkout"
						onclick={closeMobileMenu}
						class="block px-4 py-3 mt-2 bg-blue-accent text-white rounded-lg text-base font-medium text-center hover:opacity-90 transition-opacity"
					>
						Get Started
					</a>
				</div>
			</div>
		{/if}
	</div>
</nav>

<style>
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slideDown {
		animation: slideDown 0.2s ease-out;
	}

	.dropdown {
		position: relative;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.5rem;
		min-width: 240px;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 0.75rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		animation: slideDown 0.2s ease-out;
		z-index: 50;
	}

	.dropdown-item {
		display: block;
		padding: 0.75rem 1rem;
		transition: background-color 0.2s;
		text-decoration: none;
	}

	.dropdown-item:hover {
		background-color: var(--bg-secondary);
	}

	.dropdown-item:first-child {
		border-radius: 0.75rem 0.75rem 0 0;
	}

	.dropdown-item:last-child {
		border-radius: 0 0 0.75rem 0.75rem;
	}
</style>
