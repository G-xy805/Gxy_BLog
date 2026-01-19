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
	];

	// 支持自定义导航栏链接,并且支持多级菜单
	links.push({
		name: "少阳手记",
		url: "/links/",
		icon: "feather:book",
		children: [
			{
				name: "玩易",
				url: "/categories/玩易/",
				icon: "feather:book-open",
			},
			{
				name: "玄黄",
				url: "/categories/玄黄/",
				icon: "feather:book-open",
			},
			{
				name: "燃灯",
				url: "/categories/燃灯/",
				icon: "feather:book-open",
			},
			{
				name: "草堂",
				url: "/categories/草堂/",
				icon: "feather:book-open",
			},
			{
				name: "青囊",
				url: "/categories/青囊/",
				icon: "feather:book-open",
			},
			{
				name: "廿四",
				url: "/html/廿四/",
				external: true,
				icon: "feather:book-open",
			},
			{
				name: "妖言",
				url: "/categories/妖言/",
				icon: "feather:book-open",
			},
			{
				name: "坐忘",
				url: "/categories/坐忘/",
				icon: "feather:book-open",
			},
		],
	});

	links.push({
		name: "少阳研究所",
		url: "/links/",
		icon: "feather:layers",
		children: [
			{
				name: "效率软件",
				url: "/categories/效率软件/",
				icon: "feather:book-open",
			},
			{
				name: "神级网站",
				url: "/categories/神级网站/",
				icon: "feather:book-open",
			},
			{
				name: "浏览器插件",
				url: "/categories/浏览器插件/",
				icon: "feather:book-open",
			},
			{
				name: "Hexo 魔改",
				url: "/categories/Hexo魔改/",
				icon: "feather:book-open",
			},
			{
				name: "Hugo 魔改",
				url: "/categories/Hugo魔改/",
				icon: "feather:book-open",
			},
			{
				name: "Astro 魔改",
				url: "/categories/Astro魔改/",
				icon: "feather:book-open",
			},
			{
				name: "网站实战",
				url: "/categories/网站实战/",
				icon: "feather:book-open",
			},			
			{
				name: "Obsidian教程",
				url: "/categories/Obsidian教程/",
				icon: "feather:book-open",
			},
		],
	});


	links.push({
		name: "导航",
		url: "/links/",
		icon: "feather:compass",
		children: [
			{
				name: "个人主页",
				url: "https://zayck-top.pages.dev",
				external: true,
				icon: "feather:monitor",
			},
			{
				name: "音乐网站",
				url: "/html/music/",
				external: true,
				icon: "feather:music",
			},
			{
				name: "音乐网站（NEW）",
				url: "/html/kael-music/",
				external: true,
				icon: "feather:music",
			},			
			{
				name: "工具箱",
				url: "/navigation/",
				icon: "feather:tool",
			},
		],
	});

	links.push({
		name: "关于",
		url: "/content/",
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
	});
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
