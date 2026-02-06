import {
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import { get as getStore } from "svelte/store";
import { BREAKPOINTS } from "@/constants/layoutConstants";
import { theme, wallpaperMode } from "@/stores/settingsStore";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";
import { expressiveCodeConfig, siteConfig } from "../config";
import { domCache } from "./domCache";

export function getDefaultTheme(): LIGHT_DARK_MODE {
	// 如果配置文件中设置了 defaultMode，使用配置的值
	// 否则使用 DEFAULT_THEME（向后兼容）
	return siteConfig.themeColor.defaultMode ?? DEFAULT_THEME;
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined") {
		return;
	}

	// 获取当前主题状态的完整信息
	const currentIsDark = document.documentElement.classList.contains("dark");
	const currentTheme = document.documentElement.getAttribute("data-theme");

	// 计算目标主题状态
	let targetIsDark = false; // 初始化默认值
	switch (theme) {
		case LIGHT_MODE:
			targetIsDark = false;
			break;
		case DARK_MODE:
			targetIsDark = true;
			break;
		default:
			// 处理默认情况，使用当前主题状态
			targetIsDark = currentIsDark;
			break;
	}

	// 检测是否真的需要主题切换：
	// 1. dark类状态是否改变
	// 2. expressiveCode主题是否需要更新
	const needsThemeChange = currentIsDark !== targetIsDark;
	const expectedTheme = targetIsDark
		? expressiveCodeConfig.darkTheme
		: expressiveCodeConfig.lightTheme;
	const needsCodeThemeUpdate = currentTheme !== expectedTheme;

	// 如果既不需要主题切换也不需要代码主题更新，直接返回
	if (!needsThemeChange && !needsCodeThemeUpdate) {
		return;
	}

	// 批量 DOM 操作，减少重绘
	if (needsThemeChange) {
		// 直接切换主题，利用 CSS 变量的特性让浏览器优化过渡
		if (targetIsDark) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}

	// Set the theme for Expressive Code based on current mode
	if (needsCodeThemeUpdate) {
		document.documentElement.setAttribute("data-theme", expectedTheme);
	}

	// 如果主题发生了变化，触发 theme:changed 事件
	if (needsThemeChange) {
		// 使用 requestAnimationFrame 确保在下一帧触发事件
		requestAnimationFrame(() => {
			const themeChangedEvent = new CustomEvent("theme:changed", {
				detail: { theme: targetIsDark ? "dark" : "light" },
			});
			document.dispatchEvent(themeChangedEvent);
		});
	}
}

export function setTheme(newTheme: LIGHT_DARK_MODE): void {
	theme.set(newTheme);
	applyThemeToDocument(newTheme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return getStore(theme);
}

// Wallpaper mode functions
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE) {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined" || typeof window === "undefined") {
		return;
	}

	// 检查是否允许切换壁纸模式
	const isSwitchable = siteConfig.backgroundWallpaper.switchable ?? true;
	if (!isSwitchable) {
		// 如果不允许切换，直接返回，不执行任何操作
		return;
	}

	// 获取当前的壁纸模式
	const currentMode =
		(document.documentElement.getAttribute(
			"data-wallpaper-mode",
		) as WALLPAPER_MODE) || siteConfig.backgroundWallpaper.mode;

	// 如果模式没有变化，直接返回
	if (currentMode === mode) {
		// 即使是相同模式，也要确保UI状态正确
		ensureWallpaperState(mode);
		return;
	}

	// 添加过渡保护类
	document.documentElement.classList.add("is-wallpaper-transitioning");

	// 更新数据属性
	document.documentElement.setAttribute("data-wallpaper-mode", mode);

	// 使用 requestAnimationFrame 确保在下一帧执行，避免闪屏
	requestAnimationFrame(() => {
		const body = document.body;

		// 移除所有壁纸相关的CSS类
		body.classList.remove("enable-banner", "wallpaper-transparent");

		// 根据模式添加相应的CSS类
		switch (mode) {
			case WALLPAPER_BANNER:
				body.classList.add("enable-banner");
				showBannerMode();
				break;
			case WALLPAPER_OVERLAY:
				body.classList.add("wallpaper-transparent");
				showOverlayMode();
				break;
			case WALLPAPER_NONE:
				hideAllWallpapers();
				break;
			default:
				hideAllWallpapers();
				break;
		}

		// 在下一帧移除过渡保护类
		requestAnimationFrame(() => {
			document.documentElement.classList.remove("is-wallpaper-transitioning");
		});
	});
}

// 确保壁纸状态正确
function ensureWallpaperState(mode: WALLPAPER_MODE) {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined" || typeof window === "undefined") {
		return;
	}

	const body = document.body;

	// 移除所有壁纸相关的CSS类
	body.classList.remove("enable-banner", "wallpaper-transparent");

	// 根据模式添加相应的CSS类
	switch (mode) {
		case WALLPAPER_BANNER:
			body.classList.add("enable-banner");
			showBannerMode();
			break;
		case WALLPAPER_OVERLAY:
			body.classList.add("wallpaper-transparent");
			showOverlayMode();
			break;
		case WALLPAPER_NONE:
			hideAllWallpapers();
			break;
	}
}

function showBannerMode() {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined" || typeof window === "undefined") {
		return;
	}

	const fullscreenContainer = domCache.get("[data-fullscreen-wallpaper]");
	if (fullscreenContainer) {
		fullscreenContainer.style.display = "none";
		fullscreenContainer.classList.add("hidden");
		fullscreenContainer.classList.add("opacity-0");
		fullscreenContainer.classList.remove("opacity-100");
	}

	const bannerWrapper = domCache.get("banner-wrapper");
	if (bannerWrapper) {
		const isHomePage =
			window.location.pathname === "/" || window.location.pathname === "";
		const isMobile = window.innerWidth < BREAKPOINTS.TABLET;

		if (isMobile && !isHomePage) {
			bannerWrapper.style.display = "none";
			bannerWrapper.classList.add("mobile-hide-banner");
		} else {
			bannerWrapper.style.display = "block";
			bannerWrapper.style.setProperty("display", "block", "important");
			requestAnimationFrame(() => {
				bannerWrapper.classList.remove("hidden");
				bannerWrapper.classList.remove("opacity-0");
				bannerWrapper.classList.add("opacity-100");
				bannerWrapper.classList.remove("mobile-hide-banner");
			});
		}
	}

	const creditDesktop = domCache.get("banner-credit-desktop");
	const creditMobile = domCache.get("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "";
	if (creditMobile) creditMobile.style.display = "";

	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		const homeTextEnabled =
			siteConfig.backgroundWallpaper.banner?.homeText?.enable;

		const isHomePage =
			window.location.pathname === "/" || window.location.pathname === "";

		if (homeTextEnabled && isHomePage) {
			bannerTextOverlay.classList.remove("hidden");
		} else {
			bannerTextOverlay.classList.add("hidden");
		}
	}

	adjustMainContentPosition("banner");
	adjustMainContentTransparency(false);
}

function showOverlayMode() {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined" || typeof window === "undefined") {
		return;
	}

	const fullscreenContainer = domCache.get("[data-fullscreen-wallpaper]");
	if (fullscreenContainer) {
		fullscreenContainer.style.display = "block";
		fullscreenContainer.style.setProperty("display", "block", "important");
		requestAnimationFrame(() => {
			fullscreenContainer.classList.remove("hidden");
			fullscreenContainer.classList.remove("opacity-0");
			fullscreenContainer.classList.add("opacity-100");
		});
	}

	const bannerWrapper = domCache.get("banner-wrapper");
	if (bannerWrapper) {
		bannerWrapper.style.display = "none";
		bannerWrapper.classList.add("hidden");
		bannerWrapper.classList.add("opacity-0");
		bannerWrapper.classList.remove("opacity-100");
	}

	const creditDesktop = domCache.get("banner-credit-desktop");
	const creditMobile = domCache.get("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "none";
	if (creditMobile) creditMobile.style.display = "none";

	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		bannerTextOverlay.classList.add("hidden");
	}

	adjustMainContentTransparency(true);
	adjustMainContentPosition("overlay");
}

function hideAllWallpapers() {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined" || typeof window === "undefined") {
		return;
	}

	const bannerWrapper = domCache.get("banner-wrapper");
	const fullscreenContainer = domCache.get("[data-fullscreen-wallpaper]");

	if (bannerWrapper) {
		bannerWrapper.style.display = "none";
		bannerWrapper.classList.add("hidden");
		bannerWrapper.classList.add("opacity-0");
	}

	if (fullscreenContainer) {
		fullscreenContainer.style.display = "none";
		fullscreenContainer.classList.add("hidden");
		fullscreenContainer.classList.add("opacity-0");
		fullscreenContainer.classList.remove("opacity-100");
	}

	const creditDesktop = domCache.get("banner-credit-desktop");
	const creditMobile = domCache.get("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "none";
	if (creditMobile) creditMobile.style.display = "none";

	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		bannerTextOverlay.classList.add("hidden");
	}

	adjustMainContentPosition("none");
	adjustMainContentTransparency(false);
}

function adjustMainContentPosition(
	mode: WALLPAPER_MODE | "banner" | "none" | "overlay",
) {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined") {
		return;
	}

	const mainContent = domCache.get(".absolute.w-full.z-30");
	if (!mainContent) return;

	mainContent.classList.remove("mobile-main-no-banner", "no-banner-layout");

	switch (mode) {
		case "banner":
			mainContent.style.top = "calc(var(--banner-height) - 3rem)";
			break;
		case "overlay":
			mainContent.classList.add("no-banner-layout");
			mainContent.style.top = "5.5rem";
			break;
		case "none":
			mainContent.classList.add("no-banner-layout");
			mainContent.style.top = "5.5rem";
			break;
		default:
			mainContent.style.top = "5.5rem";
			break;
	}
}

function adjustMainContentTransparency(enable: boolean) {
	// 检查是否在浏览器环境中
	if (typeof document === "undefined") {
		return;
	}

	const mainContent = domCache.get(".absolute.w-full.z-30");
	const body = document.body;

	if (!mainContent || !body) return;

	if (enable) {
		mainContent.classList.add("wallpaper-transparent");
		body.classList.add("wallpaper-transparent");
	} else {
		mainContent.classList.remove("wallpaper-transparent");
		body.classList.remove("wallpaper-transparent");
	}
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
	wallpaperMode.set(mode);
	applyWallpaperModeToDocument(mode);
}

export function initWallpaperMode(): void {
	const storedMode = getStoredWallpaperMode();
	applyWallpaperModeToDocument(storedMode);
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	return getStore(wallpaperMode);
}
