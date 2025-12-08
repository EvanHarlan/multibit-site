/**
 * Theme management store using Svelte 5 runes
 * File must be named .svelte.ts to use runes outside .svelte files
 */

type Theme = 'light' | 'dark';

class ThemeStore {
	theme = $state<Theme>('dark');

	constructor() {
		if (typeof window !== 'undefined') {
			this.init();
		}
	}

	private init() {
		const stored = localStorage.getItem('theme') as Theme | null;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		this.theme = stored || (prefersDark ? 'dark' : 'light');
		this.applyTheme();

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			if (!localStorage.getItem('theme')) {
				this.theme = e.matches ? 'dark' : 'light';
				this.applyTheme();
			}
		});
	}

	private applyTheme() {
		if (typeof document !== 'undefined') {
			if (this.theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	toggle() {
		this.theme = this.theme === 'dark' ? 'light' : 'dark';
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('theme', this.theme);
		}
		this.applyTheme();
	}

	set(newTheme: Theme) {
		this.theme = newTheme;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('theme', this.theme);
		}
		this.applyTheme();
	}
}

export const themeStore = new ThemeStore();
