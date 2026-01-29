// 主题管理脚本
export function initThemeManager() {
	const _DEFAULT_THEME = "LIGHT_MODE";
	const LIGHT_MODE = "LIGHT_MODE";
	const DARK_MODE = "DARK_MODE";
	const SYSTEM_MODE = "SYSTEM_MODE";
	const BANNER_HEIGHT_EXTEND = 30;
	const _PAGE_WIDTH = 80;
	const configHue = 200; // 从配置中获取
	const defaultMode = "system"; // 从配置中获取

	// Load the theme from local storage, use defaultMode from config if not set
	const theme = localStorage.getItem("theme") || defaultMode;

	// Helper function to get system preference
	function getSystemPreference() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? DARK_MODE
			: LIGHT_MODE;
	}

	// Resolve theme (convert system to actual theme)
	function resolveTheme(themeValue) {
		if (themeValue === SYSTEM_MODE) {
			return getSystemPreference();
		}
		return themeValue;
	}

	// WCAG contrast ratio calculation
	function getContrastRatio(foreground, background) {
		const getLuminance = (color) => {
			const rgb = color.match(/\d+/g);
			if (!rgb) return 0;
			const [r, g, b] = rgb.map(Number);
			const [rs, gs, bs] = [r, g, b].map(v => {
				v /= 255;
				return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
			});
			return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
		};
		
		const l1 = getLuminance(foreground);
		const l2 = getLuminance(background);
		const lighter = Math.max(l1, l2);
		const darker = Math.min(l1, l2);
		return (lighter + 0.05) / (darker + 0.05);
	}

	// Dynamic color adjustment for WCAG compliance
	function adjustColorsForAccessibility(isDarkMode) {
		const root = document.documentElement;
		
		if (isDarkMode) {
			// Dark mode adjustments
			root.style.setProperty('--text-color', '#F8FAFC');
			root.style.setProperty('--text-secondary', '#CBD5E1');
			root.style.setProperty('--text-muted', '#94A3B8');
			root.style.setProperty('--page-bg', '#0F172A');
			root.style.setProperty('--card-bg', 'rgba(30, 41, 59, 0.9)');
			
			// Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
			const textColor = '#F8FAFC';
			const bgColor = '#0F172A';
			const contrast = getContrastRatio(textColor, bgColor);
			
			if (contrast < 4.5) {
				console.warn('Dark mode contrast ratio below WCAG AA standard:', contrast);
			}
		} else {
			// Light mode adjustments
			root.style.setProperty('--text-color', '#0F172A');
			root.style.setProperty('--text-secondary', '#475569');
			root.style.setProperty('--text-muted', '#64748B');
			root.style.setProperty('--page-bg', '#F8FAFC');
			root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.92)');
			
			// Ensure WCAG AA compliance
			const textColor = '#0F172A';
			const bgColor = '#F8FAFC';
			const contrast = getContrastRatio(textColor, bgColor);
			
			if (contrast < 4.5) {
				console.warn('Light mode contrast ratio below WCAG AA standard:', contrast);
			}
		}
	}

	// Apply semantic colors based on theme
	function applySemanticColors(isDarkMode) {
		const root = document.documentElement;
		
		if (isDarkMode) {
			// Dark mode semantic colors (brighter for better contrast)
			root.style.setProperty('--color-success', '#34D399');
			root.style.setProperty('--color-info', '#60A5FA');
			root.style.setProperty('--color-warning', '#FBBF24');
			root.style.setProperty('--color-danger', '#F87171');
			root.style.setProperty('--color-primary', '#A5B4FC');
			root.style.setProperty('--color-secondary', '#818CF8');
			root.style.setProperty('--color-accent', '#C084FC');
			root.style.setProperty('--color-tertiary', '#F472B6');
		} else {
			// Light mode semantic colors
			root.style.setProperty('--color-success', '#10B981');
			root.style.setProperty('--color-info', '#3B82F6');
			root.style.setProperty('--color-warning', '#F59E0B');
			root.style.setProperty('--color-danger', '#EF4444');
			root.style.setProperty('--color-primary', '#5B4FE4');
			root.style.setProperty('--color-secondary', '#7B8FF6');
			root.style.setProperty('--color-accent', '#A855F7');
			root.style.setProperty('--color-tertiary', '#EC4899');
		}
	}

	const resolvedTheme = resolveTheme(theme);
	let isDark = false;

	switch (resolvedTheme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			isDark = false;
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			isDark = true;
			break;
	}

	// Apply dynamic color adjustments
	adjustColorsForAccessibility(isDark);
	applySemanticColors(isDark);

	// Setup system theme change listener if using system mode
	if (theme === SYSTEM_MODE) {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemThemeChange = (e) => {
			const currentStoredTheme = localStorage.getItem("theme");
			if (currentStoredTheme === SYSTEM_MODE) {
				const newTheme = e.matches ? DARK_MODE : LIGHT_MODE;
				const newIsDark = newTheme === DARK_MODE;

				if (newIsDark) {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}

				const expressiveTheme = newIsDark ? "github-dark" : "github-light";
				document.documentElement.setAttribute("data-theme", expressiveTheme);
				
				// Apply dynamic color adjustments on theme change
				adjustColorsForAccessibility(newIsDark);
				applySemanticColors(newIsDark);
			}
		};

		// Add listener for system theme changes
		mediaQuery.addListener(handleSystemThemeChange);
	}

	// Set the theme for Expressive Code based on current mode
	const expressiveTheme = isDark ? "github-dark" : "github-light";
	document.documentElement.setAttribute("data-theme", expressiveTheme);

	// 确保主题正确应用 - 解决代码块渲染问题
	// 使用 requestAnimationFrame 确保在下一帧检查主题状态
	requestAnimationFrame(() => {
		const currentTheme = document.documentElement.getAttribute("data-theme");
		if (currentTheme !== expressiveTheme) {
			document.documentElement.setAttribute("data-theme", expressiveTheme);
		}
	});

	// Load the hue from local storage
	const hue = localStorage.getItem("hue") || configHue;
	document.documentElement.style.setProperty("--hue", hue);

	// calculate the --banner-height-extend, which needs to be a multiple of 4 to avoid blurry text
	let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
	offset = offset - (offset % 4);
	document.documentElement.style.setProperty(
		"--banner-height-extend",
		`${offset}px`,
	);
}
