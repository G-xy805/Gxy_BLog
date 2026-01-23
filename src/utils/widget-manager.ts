import { sidebarLayoutConfig } from "../config";
import type {
	SidebarLayoutConfig,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";

/**
 * 组件映射表 - 将组件类型映射到实际的组件路径
 */
export const WIDGET_COMPONENT_MAP = {
	profile: "../components/content/Profile.astro",

	categories: "../components/widget/Categories.astro",
	tags: "../components/widget/Tags.astro",
	sidebarToc: "../components/widget/SidebarTOC.astro",
	stats: "../components/widget/SiteStats.astro",
	popularPosts: "../components/content/PopularPosts.astro",
	custom: null, // 自定义组件需要在配置中指定路径
} as const;

/**
 * 组件管理器类
 * 负责管理侧边栏组件的动态加载、排序和渲染
 */
export class WidgetManager {
	private config: SidebarLayoutConfig;

	constructor(config: SidebarLayoutConfig = sidebarLayoutConfig) {
		this.config = config;
	}

	/**
	 * 获取配置
	 */
	getConfig(): SidebarLayoutConfig {
		return this.config;
	}

	/**
	 * 获取启用的组件列表
	 * @param sidebar 侧边栏位置（可选）
	 */
	private getEnabledComponents(sidebar?: "left"): WidgetComponentConfig[] {
		let components: WidgetComponentConfig[];

		if (sidebar) {
			// 如果指定了侧边栏，只获取该侧的组件
			components = this.config.leftComponents.filter(
				(component) => component.enable,
			);
		} else {
			// 如果没有指定，获取所有组件
			components = this.config.leftComponents.filter(
				(component) => component.enable,
			);
		}

		return components.sort((a, b) => a.order - b.order);
	}

	/**
	 * 根据位置获取组件列表
	 * @param position 组件位置：'top' | 'sticky'
	 * @param sidebar 侧边栏位置（可选）：'left'
	 */
	getComponentsByPosition(
		position: "top" | "sticky",
		sidebar?: "left",
	): WidgetComponentConfig[] {
		let components: WidgetComponentConfig[];

		if (!sidebar) {
			// 如果没有指定侧边栏，返回所有符合位置的组件
			components = this.getEnabledComponents();
		} else {
			// 获取指定侧边栏的启用组件
			components = this.getEnabledComponents(sidebar);
		}

		// 按位置过滤组件
		components = components.filter(
			(component) => component.position === position,
		);

		// 获取当前设备类型
		const deviceType = this.getCurrentDeviceType();

		// 过滤掉应该在当前设备隐藏的组件
		return components.filter((component) => {
			// 如果没有隐藏配置，显示组件
			if (!component.responsive?.hidden) {
				return true;
			}

			// 如果当前设备不在隐藏列表中，显示组件
			return !component.responsive.hidden.includes(deviceType);
		});
	}

	/**
	 * 获取当前设备类型
	 * 这个方法应该根据实际的窗口宽度来判断设备类型
	 * 但在服务端渲染时，我们无法获取窗口宽度
	 * 所以这里返回默认的设备类型，实际的响应式隐藏将在客户端通过CSS实现
	 */
	private getCurrentDeviceType(): "mobile" | "tablet" | "desktop" {
		// 在服务端渲染时，我们无法获取窗口宽度
		// 所以返回默认值，实际的响应式隐藏将在客户端通过CSS实现
		return "desktop";
	}

	/**
	 * 获取组件的动画延迟时间
	 * @param component 组件配置
	 * @param index 组件在列表中的索引
	 */
	getAnimationDelay(component: WidgetComponentConfig, index: number): number {
		if (component.animationDelay !== undefined) {
			return component.animationDelay;
		}

		if (this.config.defaultAnimation.enable) {
			return (
				this.config.defaultAnimation.baseDelay +
				index * this.config.defaultAnimation.increment
			);
		}

		return 0;
	}

	/**
	 * 获取组件的CSS类名
	 * @param component 组件配置
	 * @param sidebar 组件所在的侧边栏
	 * @param index 组件在列表中的索引
	 */
	getComponentClass(
		component: WidgetComponentConfig,
		_sidebar: "left",
		_index: number,
	): string {
		const classes: string[] = [];

		// 添加基础类名
		if (component.class) {
			classes.push(component.class);
		}

		// 处理响应式隐藏配置
		if (component.responsive?.hidden) {
			// 移动端隐藏
			if (component.responsive.hidden.includes("mobile")) {
				classes.push("hidden md:block");
			}

			// 平板端隐藏
			if (component.responsive.hidden.includes("tablet")) {
				classes.push("md:hidden lg:block");
			}

			// 桌面端隐藏
			if (component.responsive.hidden.includes("desktop")) {
				classes.push("lg:hidden");
			}
		}

		return classes.join(" ");
	}

	/**
	 * 获取组件的内联样式
	 * @param component 组件配置
	 * @param index 组件在列表中的索引
	 */
	getComponentStyle(component: WidgetComponentConfig, index: number): string {
		const styles: string[] = [];

		// 添加自定义样式
		if (component.style) {
			styles.push(component.style);
		}

		// 添加动画延迟样式
		const animationDelay = this.getAnimationDelay(component, index);
		if (animationDelay > 0) {
			styles.push(`animation-delay: ${animationDelay}ms`);
		}

		return styles.join("; ");
	}

	/**
	 * 检查组件是否应该折叠
	 * @param component 组件配置
	 * @param itemCount 组件内容项数量
	 */
	isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
		if (!component.responsive?.collapseThreshold) {
			return false;
		}
		return itemCount >= component.responsive.collapseThreshold;
	}

	/**
	 * 获取组件的路径
	 * @param componentType 组件类型
	 */
	getComponentPath(componentType: WidgetComponentType): string | null {
		return WIDGET_COMPONENT_MAP[componentType];
	}

	/**
	 * 检查当前设备是否应该显示侧边栏
	 * @param deviceType 设备类型
	 */
	shouldShowSidebar(deviceType: "mobile" | "tablet" | "desktop"): boolean {
		if (!this.config.enable) {
			return false;
		}

		const layoutMode = this.config.responsive.layout[deviceType];
		return layoutMode === "sidebar";
	}

	/**
	 * 更新组件配置
	 * @param newConfig 新的配置
	 */
	updateConfig(newConfig: Partial<SidebarLayoutConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * 添加新组件
	 * @param component 组件配置
	 */
	addComponent(component: WidgetComponentConfig): void {
		this.config.leftComponents.push(component);
	}

	/**
	 * 移除组件
	 * @param componentType 组件类型
	 */
	removeComponent(componentType: WidgetComponentType): void {
		this.config.leftComponents = this.config.leftComponents.filter(
			(component) => component.type !== componentType,
		);
	}

	/**
	 * 启用/禁用组件
	 * @param componentType 组件类型
	 * @param enable 是否启用
	 */
	toggleComponent(componentType: WidgetComponentType, enable: boolean): void {
		const component = this.config.leftComponents.find(
			(c) => c.type === componentType,
		);
		if (component) {
			component.enable = enable;
		}
	}

	/**
	 * 重新排序组件
	 * @param componentType 组件类型
	 * @param newOrder 新的排序值
	 */
	reorderComponent(componentType: WidgetComponentType, newOrder: number): void {
		const component = this.config.leftComponents.find(
			(c) => c.type === componentType,
		);
		if (component) {
			component.order = newOrder;
		}
	}

	/**
	 * 检查组件是否应该在侧边栏中渲染
	 * @param componentType 组件类型
	 */
	isSidebarComponent(_componentType: WidgetComponentType): boolean {
		// 过滤组件
		return true;
	}
}

/**
 * 默认组件管理器实例
 */
export const widgetManager = new WidgetManager();

/**
 * 工具函数：根据组件类型获取组件配置
 * @param componentType 组件类型
 */
export function getComponentConfig(
	componentType: WidgetComponentType,
): WidgetComponentConfig | undefined {
	const config = widgetManager.getConfig();
	return config.leftComponents.find((c) => c.type === componentType);
}

/**
 * 工具函数：检查组件是否启用
 * @param componentType 组件类型
 */
export function isComponentEnabled(
	componentType: WidgetComponentType,
): boolean {
	const config = getComponentConfig(componentType);
	return config?.enable ?? false;
}

/**
 * 工具函数：获取所有启用的组件类型
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
	const enabledComponents = widgetManager
		.getComponentsByPosition("top")
		.concat(widgetManager.getComponentsByPosition("sticky"));
	return enabledComponents.map((c) => c.type);
}
