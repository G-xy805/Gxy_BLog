import { sidebarLayoutConfig } from "../config";
import { widgetManager } from "./widget-manager";

// 响应式侧边栏配置
export const getResponsiveSidebarConfig = () => {
	const globalSidebarEnabled = sidebarLayoutConfig.enable;

	return {
		globalSidebarEnabled,
		mobileShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("mobile"),
		tabletShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("tablet"),
		desktopShowSidebar:
			globalSidebarEnabled && widgetManager.shouldShowSidebar("desktop"),
	};
};

// 生成网格布局类名
export const generateGridClasses = (
	config: ReturnType<typeof getResponsiveSidebarConfig>,
) => {
	const { tabletShowSidebar, desktopShowSidebar } = config;

	// 单侧边栏布局（仅左侧）
	const gridCols = `
		grid-cols-1
		${tabletShowSidebar ? "md:grid-cols-[var(--sidebar-width)_1fr]" : "md:grid-cols-1"}
		${desktopShowSidebar ? "lg:grid-cols-[var(--sidebar-width)_1fr]" : "lg:grid-cols-1"}
	`
		.trim()
		.replace(/\s+/g, " ");

	return { gridCols };
};

// 生成侧边栏类名（仅左侧）
export const generateSidebarClasses = (
	config: ReturnType<typeof getResponsiveSidebarConfig>,
) => {
	const { tabletShowSidebar, desktopShowSidebar } = config;

	// 左侧边栏布局
	return `
		mb-4 row-start-2 row-end-3 col-span-2 onload-animation
		hidden
		${tabletShowSidebar ? "md:block md:row-start-1 md:row-end-2 md:max-w-[var(--sidebar-width)] md:col-start-1 md:col-end-2" : "md:hidden"}
		${desktopShowSidebar ? "lg:block lg:row-start-1 lg:row-end-2 lg:max-w-[var(--sidebar-width)] lg:col-start-1 lg:col-end-2" : "lg:hidden"}
	`
		.trim()
		.replace(/\s+/g, " ");
};

// 生成主内容类名
export const generateMainContentClasses = (
	config: ReturnType<typeof getResponsiveSidebarConfig>,
) => {
	const { mobileShowSidebar, tabletShowSidebar, desktopShowSidebar } = config;

	// 单侧边栏（左侧）：主内容在右边
	return `
		transition-swup-fade overflow-hidden w-full
		${mobileShowSidebar ? "col-span-2" : "col-span-1"}
		${tabletShowSidebar ? "md:col-start-2 md:col-end-3" : "md:col-span-1"}
		${desktopShowSidebar ? "lg:col-start-2 lg:col-end-3" : "lg:col-span-1"}
	`
		.trim()
		.replace(/\s+/g, " ");
};
