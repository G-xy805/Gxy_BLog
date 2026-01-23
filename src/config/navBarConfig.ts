import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: (NavBarLink | LinkPreset)[] = [
		// 首页
		{
			name: "首页",
			url: "/",
			icon: "feather:home",
		},
		// 分类
		{
			name: "分类",
			url: "/categories/",
			icon: "feather:grid",
			children: [
				{
					name: "C++",
					url: "/categories/C++/",
					icon: "feather:code",
				},
				{
					name: "Astro",
					url: "/categories/Astro魔改/",
					icon: "feather:code",
				},
				{
					name: "技术杂谈",
					url: "/categories/技术杂谈/",
					icon: "feather:code",
				},
			],
		},
		// 归档
		{
			name: "归档",
			url: "/archives/",
			icon: "feather:calendar",
		},
		// 关于
		{
			name: "关于",
			url: "/about/",
			icon: "feather:info",
			children: [
				LinkPreset.About,
				{
					name: "项目",
					url: "/project/",
					icon: "feather:code",
				},
				LinkPreset.Friends,
				...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []), // 根据配置决定是否添加赞助页面
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
