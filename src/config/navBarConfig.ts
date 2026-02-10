import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

export const DYNAMIC_CATEGORIES_MARKER = "__DYNAMIC_CATEGORIES__";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: (NavBarLink | LinkPreset)[] = [
		// 首页
		{
			name: "首页",
			url: "/",
			icon: "ri:home-2-line",
		},
		{
			name: "分类",
			url: "/categories/",
			icon: "ri:grid-line",
			children: [],
		},
		// 归档
		{
			name: "归档",
			url: "/archive/",
			icon: "ri:calendar-line",
		},
		// 关于
		{
			name: "关于",
			url: "/about/",
			icon: "ri:information-line",
			children: [
				LinkPreset.About,
				// 暂时取消以下菜单项
				// {
				// 	name: "项目",
				// 	url: "/project/",
				// 	icon: "ri:code-box-line",
				// },
				// LinkPreset.Friends,
				// ...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []), // 根据配置决定是否添加赞助页面
			],
		},
	];
	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	// 可选：PageFind， MeiliSearch
	// 选择PageFind时：NavBarSearchMethod.PageFind,
	// 选择MeiliSearch时：NavBarSearchMethod.MeiliSearch,
	method: NavBarSearchMethod.PageFind,
	// 当选择 MeiliSearch 时的配置
	meiliSearchConfig: {
		INDEX_NAME: "posts",
		CONTENT_DIR: "src/content/posts",
		MEILI_HOST: "http://localhost:7700",
		PUBLIC_MEILI_HOST: "http://localhost:7700",
		PUBLIC_MEILI_SEARCH_KEY:
			"41134b15079da66ca545375edbea848a9b7173dff13be2028318fefa41ae8f2b",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
