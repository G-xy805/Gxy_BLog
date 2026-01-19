import {
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@constants/constants";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";
import { expressiveCodeConfig, siteConfig } from "../config";



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
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	// 检查是否在浏览器环境中
	if (typeof localStorage === "undefined") {
		return;
	}

	// 先应用主题
	applyThemeToDocument(theme);

	// 保存到localStorage
	localStorage.setItem("theme", theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	// 检查是否在浏览器环境中
	if (typeof localStorage === "undefined") {
		return getDefaultTheme();
	}
	return (
		(localStorage.getItem("theme") as LIGHT_DARK_MODE) || getDefaultTheme()
	);
}

// 初始化主题监听器（用于页面加载后）
export function initThemeListener() {
	// 移除了系统主题相关的逻辑
	return;
}

// Wallpaper mode functions
export function applyWallpaperModeToDocument(mode: WALLPAPER_MODE) {
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
	// 隐藏全屏壁纸（通过CSS类和display控制）
	const fullscreenContainer = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;
	if (fullscreenContainer) {
		fullscreenContainer.style.display = "none";
		fullscreenContainer.classList.add("hidden");
		fullscreenContainer.classList.add("opacity-0");
		fullscreenContainer.classList.remove("opacity-100");
	}

	// 显示banner壁纸（通过CSS类和display控制）
	const bannerWrapper = document.getElementById("banner-wrapper");
	if (bannerWrapper) {
		// 检查当前是否为首页
		const isHomePage =
			window.location.pathname === "/" || window.location.pathname === "";
		const isMobile = window.innerWidth < 1024;

		// 移动端非首页时，不显示banner；桌面端始终显示
		if (isMobile && !isHomePage) {
			bannerWrapper.style.display = "none";
			bannerWrapper.classList.add("mobile-hide-banner");
		} else {
			// 首页或桌面端：先设置display，然后使用requestAnimationFrame确保渲染
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

	// 显示横幅图片来源文本
	const creditDesktop = document.getElementById("banner-credit-desktop");
	const creditMobile = document.getElementById("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "";
	if (creditMobile) creditMobile.style.display = "";

	// 显示横幅首页文本（如果启用且是首页）
	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		// 检查是否启用 homeText
		const homeTextEnabled =
			siteConfig.backgroundWallpaper.banner?.homeText?.enable;

		// 检查当前是否为首页
		const isHomePage =
			window.location.pathname === "/" || window.location.pathname === "";

		// 只有在启用且在首页时才显示
		if (homeTextEnabled && isHomePage) {
			bannerTextOverlay.classList.remove("hidden");
		} else {
			bannerTextOverlay.classList.add("hidden");
		}
	}

	// 调整主内容位置
	adjustMainContentPosition("banner");

	// 处理移动端非首页主内容区域位置
	const mainContentWrapper = document.querySelector(".absolute.w-full.z-30");
	if (mainContentWrapper) {
		const isHomePage =
			window.location.pathname === "/" || window.location.pathname === "";
		const isMobile = window.innerWidth < 1024;
		// 只在移动端非首页时调整主内容位置
		if (isMobile && !isHomePage) {
			mainContentWrapper.classList.add("mobile-main-no-banner");
		} else {
			mainContentWrapper.classList.remove("mobile-main-no-banner");
		}
	}

	// 移除透明效果（横幅模式不使用半透明）
	adjustMainContentTransparency(false);


}

function showOverlayMode() {
	// 显示全屏壁纸（通过CSS类和display控制）
	const fullscreenContainer = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;
	if (fullscreenContainer) {
		// 先设置display，然后使用requestAnimationFrame确保渲染
		fullscreenContainer.style.display = "block";
		fullscreenContainer.style.setProperty("display", "block", "important");
		requestAnimationFrame(() => {
			fullscreenContainer.classList.remove("hidden");
			fullscreenContainer.classList.remove("opacity-0");
			fullscreenContainer.classList.add("opacity-100");
		});
	}

	// 隐藏banner壁纸（通过CSS类和display控制）
	const bannerWrapper = document.getElementById("banner-wrapper");
	if (bannerWrapper) {
		bannerWrapper.style.display = "none";
		bannerWrapper.classList.add("hidden");
		bannerWrapper.classList.add("opacity-0");
		bannerWrapper.classList.remove("opacity-100");
	}

	// 隐藏横幅图片来源文本
	const creditDesktop = document.getElementById("banner-credit-desktop");
	const creditMobile = document.getElementById("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "none";
	if (creditMobile) creditMobile.style.display = "none";

	// 隐藏横幅首页文本
	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		bannerTextOverlay.classList.add("hidden");
	}

	// 调整主内容透明度
	adjustMainContentTransparency(true);

	// 调整布局为紧凑模式
	adjustMainContentPosition("overlay");
}

function hideAllWallpapers() {
	// 隐藏所有壁纸（通过CSS类和display控制）
	const bannerWrapper = document.getElementById("banner-wrapper");
	const fullscreenContainer = document.querySelector(
		"[data-fullscreen-wallpaper]",
	) as HTMLElement;

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

	// 隐藏横幅图片来源文本
	const creditDesktop = document.getElementById("banner-credit-desktop");
	const creditMobile = document.getElementById("banner-credit-mobile");
	if (creditDesktop) creditDesktop.style.display = "none";
	if (creditMobile) creditMobile.style.display = "none";

	// 隐藏横幅首页文本
	const bannerTextOverlay = document.querySelector(".banner-text-overlay");
	if (bannerTextOverlay) {
		bannerTextOverlay.classList.add("hidden");
	}

	// 调整主内容位置和透明度
	adjustMainContentPosition("none");
	adjustMainContentTransparency(false);
}



function adjustMainContentPosition(
	mode: WALLPAPER_MODE | "banner" | "none" | "overlay",
) {
	const mainContent = document.querySelector(
		".absolute.w-full.z-30",
	) as HTMLElement;
	if (!mainContent) return;

	// 移除现有的位置类
	mainContent.classList.remove("mobile-main-no-banner", "no-banner-layout");

	switch (mode) {
		case "banner":
			// Banner模式：主内容在banner下方
			mainContent.style.top = "calc(var(--banner-height) - 3rem)";
			break;
		case "overlay":
			// Overlay模式：使用紧凑布局，主内容从导航栏下方开始
			mainContent.classList.add("no-banner-layout");
			mainContent.style.top = "5.5rem";
			break;
		case "none":
			// 无壁纸模式：主内容从导航栏下方开始
			mainContent.classList.add("no-banner-layout");
			mainContent.style.top = "5.5rem";
			break;
		default:
			mainContent.style.top = "5.5rem";
			break;
	}
}

function adjustMainContentTransparency(enable: boolean) {
	const mainContent = document.querySelector(".absolute.w-full.z-30");
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
	// 检查是否在浏览器环境中
	if (typeof localStorage === "undefined") {
		return;
	}
	localStorage.setItem("wallpaperMode", mode);
	applyWallpaperModeToDocument(mode);
}

export function initWallpaperMode(): void {
	const storedMode = getStoredWallpaperMode();
	applyWallpaperModeToDocument(storedMode);
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	// 检查是否在浏览器环境中
	if (typeof localStorage === "undefined") {
		return siteConfig.backgroundWallpaper.mode;
	}
	return (
		(localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) ||
		siteConfig.backgroundWallpaper.mode
	);
}
