/**
 * Waline 主题管理器
 * Waline Theme Manager
 *
 * 管理 Waline 评论区的主题切换，支持自动跟随系统和手动切换
 * Manages Waline comment system theme switching, supports auto system follow and manual toggle
 */

import { get as getStore } from "svelte/store";
import { DARK_MODE, LIGHT_MODE, SYSTEM_MODE } from "@/constants/constants";
import { theme as themeStore } from "@/stores/settingsStore";
import type { LIGHT_DARK_MODE } from "@/types/config";

/**
 * Waline 主题配置接口
 */
interface WalineThemeConfig {
	dark: string | boolean;
	light: string | boolean;
	serverURL: string;
	path: string;
	lang: string;
	login: string;
	visitorCount: boolean;
}

/**
 * Waline 实例类型
 */
interface WalineInstance {
	update: (config: Partial<WalineThemeConfig>) => void;
	destroy: () => void;
}

/**
 * Waline 主题管理器类
 */
class WalineThemeManager {
	private walineInstance: WalineInstance | null = null;
	private currentTheme: LIGHT_DARK_MODE = LIGHT_MODE;
	private isInitialized = false;
	private themeChangeListeners: Array<(theme: string) => void> = [];

	/**
	 * 初始化 Waline 主题管理器
	 */
	public async init(): Promise<void> {
		if (this.isInitialized) {
			return;
		}

		this.currentTheme = getStore(themeStore);
		this.setupThemeListener();
		this.isInitialized = true;

		console.log(
			"[Waline Theme Manager] Initialized with theme:",
			this.currentTheme,
		);
	}

	/**
	 * 设置 Waline 实例
	 */
	public setWalineInstance(instance: WalineInstance | null): void {
		this.walineInstance = instance;
		console.log("[Waline Theme Manager] Waline instance set");
	}

	/**
	 * 获取当前主题模式
	 */
	public getCurrentTheme(): string {
		return this.resolveTheme(this.currentTheme);
	}

	/**
	 * 解析主题模式（处理 SYSTEM_MODE）
	 */
	private resolveTheme(themeMode: LIGHT_DARK_MODE): string {
		if (themeMode === SYSTEM_MODE) {
			return this.getSystemPreference();
		}
		return themeMode;
	}

	/**
	 * 获取系统主题偏好
	 */
	private getSystemPreference(): string {
		if (typeof window === "undefined") {
			return LIGHT_MODE;
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? DARK_MODE
			: LIGHT_MODE;
	}

	/**
	 * 设置主题监听器
	 */
	private setupThemeListener(): void {
		if (typeof window === "undefined") {
			return;
		}

		// 监听应用主题变化
		const unsubscribe = themeStore.subscribe((newTheme: LIGHT_DARK_MODE) => {
			this.handleThemeChange(newTheme);
		});

		// 监听系统主题变化（仅在 SYSTEM_MODE 下）
		if (this.currentTheme === SYSTEM_MODE) {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			mediaQuery.addEventListener("change", (e) => {
				if (this.currentTheme === SYSTEM_MODE) {
					this.handleSystemThemeChange(e.matches ? DARK_MODE : LIGHT_MODE);
				}
			});
		}

		// 监听自定义主题变化事件
		document.addEventListener("theme:changed", (event: Event) => {
			const customEvent = event as CustomEvent<{ theme: string }>;
			this.handleThemeChangedEvent(customEvent.detail.theme);
		});
	}

	/**
	 * 处理主题变化
	 */
	private handleThemeChange(newTheme: LIGHT_DARK_MODE): void {
		const oldTheme = this.currentTheme;
		this.currentTheme = newTheme;

		console.log("[Waline Theme Manager] Theme changed:", {
			old: oldTheme,
			new: newTheme,
			resolved: this.resolveTheme(newTheme),
		});

		this.updateWalineTheme();
		this.notifyThemeListeners(this.resolveTheme(newTheme));
	}

	/**
	 * 处理系统主题变化
	 */
	private handleSystemThemeChange(systemTheme: string): void {
		console.log("[Waline Theme Manager] System theme changed:", systemTheme);
		this.updateWalineTheme();
		this.notifyThemeListeners(systemTheme);
	}

	/**
	 * 处理主题变化事件
	 */
	private handleThemeChangedEvent(theme: string): void {
		console.log("[Waline Theme Manager] Theme changed event:", theme);
		this.updateWalineTheme();
		this.notifyThemeListeners(theme);
	}

	/**
	 * 更新 Waline 主题
	 */
	private updateWalineTheme(): void {
		if (!this.walineInstance) {
			console.log("[Waline Theme Manager] No Waline instance to update");
			return;
		}

		const resolvedTheme = this.resolveTheme(this.currentTheme);
		const isDark = resolvedTheme === DARK_MODE;

		console.log("[Waline Theme Manager] Updating Waline theme:", {
			mode: this.currentTheme,
			resolved: resolvedTheme,
			isDark,
		});

		try {
			this.walineInstance.update({
				dark: isDark,
			});

			console.log("[Waline Theme Manager] Waline theme updated successfully");
		} catch (error) {
			console.error(
				"[Waline Theme Manager] Failed to update Waline theme:",
				error,
			);
		}
	}

	/**
	 * 通知主题变化监听器
	 */
	private notifyThemeListeners(theme: string): void {
		this.themeChangeListeners.forEach((listener) => {
			try {
				listener(theme);
			} catch (error) {
				console.error("[Waline Theme Manager] Error in theme listener:", error);
			}
		});
	}

	/**
	 * 添加主题变化监听器
	 */
	public onThemeChange(listener: (theme: string) => void): () => void {
		this.themeChangeListeners.push(listener);

		return () => {
			const index = this.themeChangeListeners.indexOf(listener);
			if (index > -1) {
				this.themeChangeListeners.splice(index, 1);
			}
		};
	}

	/**
	 * 手动设置主题
	 */
	public setTheme(theme: LIGHT_DARK_MODE): void {
		console.log("[Waline Theme Manager] Setting theme:", theme);
		this.currentTheme = theme;
		this.updateWalineTheme();
		this.notifyThemeListeners(this.resolveTheme(theme));
	}

	/**
	 * 切换主题
	 */
	public toggleTheme(): void {
		const newTheme = this.currentTheme === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
		this.setTheme(newTheme);
	}

	/**
	 * 获取 Waline 配置
	 */
	public getWalineConfig(
		baseConfig: Partial<WalineThemeConfig>,
	): WalineThemeConfig {
		const resolvedTheme = this.resolveTheme(this.currentTheme);
		const isDark = resolvedTheme === DARK_MODE;

		return {
			...baseConfig,
			dark: isDark,
			light: !isDark,
		} as WalineThemeConfig;
	}

	/**
	 * 销毁主题管理器
	 */
	public destroy(): void {
		this.walineInstance = null;
		this.themeChangeListeners = [];
		this.isInitialized = false;
		console.log("[Waline Theme Manager] Destroyed");
	}

	/**
	 * 检查是否为暗色模式
	 */
	public isDarkMode(): boolean {
		return this.resolveTheme(this.currentTheme) === DARK_MODE;
	}

	/**
	 * 获取主题状态信息
	 */
	public getThemeStatus(): {
		currentTheme: LIGHT_DARK_MODE;
		resolvedTheme: string;
		isDark: boolean;
		isSystem: boolean;
	} {
		const resolvedTheme = this.resolveTheme(this.currentTheme);
		return {
			currentTheme: this.currentTheme,
			resolvedTheme,
			isDark: resolvedTheme === DARK_MODE,
			isSystem: this.currentTheme === SYSTEM_MODE,
		};
	}
}

/**
 * 创建单例实例
 */
const walineThemeManager = new WalineThemeManager();

/**
 * 导出便捷函数
 */
export function initWalineThemeManager(): Promise<void> {
	return walineThemeManager.init();
}

export function setWalineInstance(instance: WalineInstance | null): void {
	walineThemeManager.setWalineInstance(instance);
}

export function getWalineThemeManager(): WalineThemeManager {
	return walineThemeManager;
}

export function updateWalineTheme(): void {
	walineThemeManager.updateWalineTheme();
}

export function setWalineTheme(theme: LIGHT_DARK_MODE): void {
	walineThemeManager.setTheme(theme);
}

export function toggleWalineTheme(): void {
	walineThemeManager.toggleTheme();
}

export function isWalineDarkMode(): boolean {
	return walineThemeManager.isDarkMode();
}

export function getWalineThemeStatus() {
	return walineThemeManager.getThemeStatus();
}

export function onWalineThemeChange(
	listener: (theme: string) => void,
): () => void {
	return walineThemeManager.onThemeChange(listener);
}

export function getWalineConfig(
	baseConfig: Partial<WalineThemeConfig>,
): WalineThemeConfig {
	return walineThemeManager.getWalineConfig(baseConfig);
}

// 将主题管理器导出到全局 window 对象
if (typeof window !== "undefined") {
	(window as any).walineThemeManager = {
		setWalineInstance: (instance: WalineInstance | null) =>
			walineThemeManager.setWalineInstance(instance),
		setTheme: (theme: LIGHT_DARK_MODE) => walineThemeManager.setTheme(theme),
		toggleTheme: () => walineThemeManager.toggleTheme(),
		isDarkMode: () => walineThemeManager.isDarkMode(),
		getThemeStatus: () => walineThemeManager.getThemeStatus(),
		onThemeChange: (listener: (theme: string) => void) =>
			walineThemeManager.onThemeChange(listener),
		updateWalineTheme: () => walineThemeManager.updateWalineTheme(),
	};
}

export default walineThemeManager;
