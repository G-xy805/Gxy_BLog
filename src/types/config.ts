import type {
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "../constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	site_url: string;
	description?: string; // 网站描述，用于生成 <meta name="description">
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

	lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ru";

	themeColor: {
		hue: number;
		fixed: boolean;
		defaultMode?: LIGHT_DARK_MODE; // 默认模式：浅色、深色或跟随系统
	};

	// 字体配置
	font: FontConfig;

	// 站点开始日期，用于计算运行天数
	siteStartDate?: string; // 格式: "YYYY-MM-DD"



	backgroundWallpaper: BackgroundWallpaperConfig;
	generateOgImages: boolean;
	favicon: Array<{
		src: string;
		theme?: "light" | "dark";
		sizes?: string;
	}>;
	/** 导航栏Logo图标，可选类型：icon库、图片链接、本地图片 */
	navbarLogo?: {
		type: "icon" | "image";
		value: string; // icon名或图片url
		alt?: string; // 图片alt文本
	};
	navbarTitle?: string; // 导航栏标题，如果不设置则使用 title
	showLastModified: boolean; // 控制"上次编辑"卡片显示的开关

	// 页面开关配置
	pages: {
		sponsor: boolean; // 赞助页面开关
	};

	// 文章列表布局配置
	postListLayout: {
		defaultMode: "list" | "grid"; // 默认布局模式：list=列表模式，grid=网格模式
		allowSwitch: boolean; // 是否允许用户切换布局
	};

	// 分页配置
	pagination: {
		postsPerPage: number; // 每页显示的文章数量
	};
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Archive = 0,
	About = 1,
	Friends = 2,
	Sponsor = 3,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标
	children?: (NavBarLink | LinkPreset)[]; // 支持子菜单，可以是NavBarLink或LinkPreset
};

export enum NavBarSearchMethod {
	PageFind = 0,
	MeiliSearch = 1,
}

/**
 * MeiliSearch配置
 *
 * @property INDEX_NAME MeiliSearch索引名称
 * @property CONTENT_DIR 需要被索引的内容目录
 * @property MEILI_HOST MeiliSearch服务器地址
 * @property PUBLIC_MEILI_HOST 公共MeiliSearch服务器地址（前端使用）
 * @property PUBLIC_MEILI_SEARCH_KEY 公共MeiliSearch搜索密钥（前端使用）
 */
export type MeiliSearchConfig = {
	INDEX_NAME: string;
	CONTENT_DIR: string;
	MEILI_HOST: string;
	PUBLIC_MEILI_HOST: string;
	PUBLIC_MEILI_SEARCH_KEY: string;
};

export type NavBarSearchConfig = {
	method: NavBarSearchMethod;
	meiliSearchConfig?: MeiliSearchConfig;
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
	searchMethod?: NavBarSearchMethod;
	meiliSearchConfig?: MeiliSearchConfig;
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};
// 评论配置

export type CommentConfig = {
	/**
	 * 当前启用的评论系统类型
	 * "none" | "twikoo" | "waline" | "giscus" | "disqus" | 'artalk'
	 */
	type: "none" | "twikoo" | "waline" | "giscus" | "disqus" | "artalk";
	twikoo?: {
		envId: string;
		region?: string;
		lang?: string;
		visitorCount?: boolean;
	};
	waline?: {
		serverURL: string;
		lang?: string;
		login?: "enable" | "force" | "disable";
		visitorCount?: boolean; // 是否统计访问量，true 启用访问量，false 关闭
	};
	artalk?: {
		// 后端程序 API 地址
		server: string;
		/**
		 * 语言，支持语言如下：
		 * - "en" (English)
		 * - "zh-CN" (简体中文)
		 * - "zh-TW" (繁体中文)
		 * - "ja" (日本語)
		 * - "ko" (한국어)
		 * - "fr" (Français)
		 * - "ru" (Русский)
		 * */
		locale: string | "auto";
		// 是否统计访问量，true 启用访问量，false 关闭
		visitorCount?: boolean;
	};
	giscus?: {
		repo: string;
		repoId: string;
		category: string;
		categoryId: string;
		mapping: string;
		strict: string;
		reactionsEnabled: string;
		emitMetadata: string;
		inputPosition: string;
		theme: string;
		lang: string;
		loading: string;
	};
	disqus?: {
		shortname: string;
	};
};

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_OVERLAY
	| typeof WALLPAPER_NONE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	/** @deprecated 使用 darkTheme 和 lightTheme 代替 */
	theme?: string;
	/** 暗色主题名称（用于暗色模式） */
	darkTheme: string;
	/** 亮色主题名称（用于亮色模式） */
	lightTheme: string;
	/** 复制按钮配置 */
	copy?: {
		/** 是否启用复制按钮 */
		enabled?: boolean;
		/** 复制按钮的提示文本 */
		tooltip?: string;
		/** 复制成功后的提示文本 */
		successText?: string;
	};
};

// 单个字体配置
export type FontItem = {
	id: string; // 字体唯一标识符
	name: string; // 字体显示名称
	src: string; // 字体文件路径或URL链接
	family: string; // CSS font-family 名称
	weight?: string | number; // 字体粗细，如 "normal", "bold", 400, 700 等
	style?: "normal" | "italic" | "oblique"; // 字体样式
	display?: "auto" | "block" | "swap" | "fallback" | "optional"; // font-display 属性
	unicodeRange?: string; // Unicode 范围，用于字体子集化
	format?:
		| "woff"
		| "woff2"
		| "truetype"
		| "opentype"
		| "embedded-opentype"
		| "svg"; // 字体格式，仅当 src 为本地文件时需要
};

// 字体配置
export type FontConfig = {
	enable: boolean; // 是否启用自定义字体功能
	selected: string | string[]; // 当前选择的字体ID，支持单个或多个字体组合
	fonts: Record<string, FontItem>; // 字体库，以ID为键的对象
	fallback?: string[]; // 全局字体回退列表
	preload?: boolean; // 是否预加载字体文件以提高性能
};

export type FooterConfig = {
	enable: boolean; // 是否启用Footer HTML注入功能
	customHtml?: string; // 自定义HTML内容，用于添加备案号等信息
};



// 组件配置类型定义
export type WidgetComponentType =
	| "profile"
	| "categories"
	| "tags"
	| "sidebarToc"
	| "advertisement"
	| "stats"
	| "calendar"
	| "custom";

export type WidgetComponentConfig = {
	type: WidgetComponentType; // 组件类型
	enable: boolean; // 是否启用该组件
	order: number; // 显示顺序，数字越小越靠前
	position: "top" | "sticky"; // 组件位置：top=固定在顶部，sticky=粘性定位（可滚动）
	class?: string; // 自定义CSS类名
	style?: string; // 自定义内联样式
	animationDelay?: number; // 动画延迟时间（毫秒）
	configId?: string; // 配置ID，用于广告组件指定使用哪个配置
	showOnPostPage?: boolean; // 是否在文章详情页显示
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // 在指定设备上隐藏
		collapseThreshold?: number; // 折叠阈值
	};
	customProps?: Record<string, unknown>; // 自定义属性，用于扩展组件功能
};

export type SidebarLayoutConfig = {
	enable: boolean; // 是否启用侧边栏
	position: "left"; // 侧边栏位置：左侧
	leftComponents: WidgetComponentConfig[]; // 左侧边栏组件配置列表
	defaultAnimation: {
		enable: boolean; // 是否启用默认动画
		baseDelay: number; // 基础延迟时间（毫秒）
		increment: number; // 每个组件递增的延迟时间（毫秒）
	};
	responsive: {
		layout: {
			mobile: "hidden" | "bottom" | "drawer" | "sidebar"; // 移动端布局模式
			tablet: "hidden" | "sidebar" | "bottom" | "drawer"; // 平板端布局模式
			desktop: "sidebar"; // 桌面端布局模式
		};
	};
};

export type BackgroundWallpaperConfig = {
	mode: "banner" | "overlay" | "none"; // 壁纸模式：banner横幅模式、overlay全屏透明覆盖模式或none纯色背景
	switchable?: boolean; // 是否允许用户通过导航栏切换壁纸模式，默认true
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  }; // 支持单个图片、图片数组或分别设置桌面端和移动端图片

	// Banner模式特有配置
	banner?: {
		position?:
			| "top"
			| "center"
			| "bottom"
			| "top left"
			| "top center"
			| "top right"
			| "center left"
			| "center center"
			| "center right"
			| "bottom left"
			| "bottom center"
			| "bottom right"
			| "left top"
			| "left center"
			| "left bottom"
			| "right top"
			| "right center"
			| "right bottom"
			| string; // 壁纸位置，支持CSS object-position的所有值，包括百分比和像素值
		homeText?: {
			enable: boolean; // 是否在首页显示自定义文字（全局开关）
			title?: string; // 主标题
			subtitle?: string | string[]; // 副标题，支持单个字符串或字符串数组
			typewriter?: {
				enable: boolean; // 是否启用打字机效果
				speed: number; // 打字速度（毫秒）
				deleteSpeed: number; // 删除速度（毫秒）
				pauseTime: number; // 完整显示后的暂停时间（毫秒）
			};
		};
		credit?: {
			enable:
				| boolean
				| {
						desktop: boolean; // 桌面端是否显示横幅图片来源文本
						mobile: boolean; // 移动端是否显示横幅图片来源文本
				  }; // 是否显示横幅图片来源文本，支持布尔值或分别设置桌面端和移动端
			text:
				| string
				| {
						desktop: string; // 桌面端显示的来源文本
						mobile: string; // 移动端显示的来源文本
				  }; // 横幅图片来源文本，支持字符串或分别设置桌面端和移动端
			url?:
				| string
				| {
						desktop: string; // 桌面端原始艺术品或艺术家页面的 URL 链接
						mobile: string; // 移动端原始艺术品或艺术家页面的 URL 链接
				  }; // 原始艺术品或艺术家页面的 URL 链接，支持字符串或分别设置桌面端和移动端
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // 导航栏透明模式
		};
		waves?: {
			enable:
				| boolean
				| {
						desktop: boolean; // 桌面端是否启用波浪动画效果
						mobile: boolean; // 移动端是否启用波浪动画效果
				  }; // 是否启用波浪动画效果，支持布尔值或分别设置桌面端和移动端
			performance?: {
				quality: "high" | "medium" | "low"; // 渲染质量：high=高质量，medium=中等质量，low=低质量
				hardwareAcceleration: boolean; // 是否启用硬件加速
			}; // 波浪效果性能优化配置
		};
	};
	// 全屏透明覆盖模式特有配置
	overlay?: {
		zIndex?: number; // 层级，确保壁纸在合适的层级显示
		opacity?: number; // 壁纸透明度，0-1之间
		blur?: number; // 背景模糊程度，单位px
	};
};



// 友链配置
export type FriendLink = {
	title: string; // 友链标题
	imgurl: string; // 头像图片URL
	desc: string; // 友链描述
	siteurl: string; // 友链地址
	tags?: string[]; // 标签数组
	weight: number; // 权重，数字越大排序越靠前
	enabled: boolean; // 是否启用
};



// 赞助方式类型
export type SponsorMethod = {
	name: string; // 赞助方式名称，如 "支付宝"、"微信"、"PayPal"
	icon?: string; // 图标名称（Iconify 格式），如 "fa6-brands:alipay"
	qrCode?: string; // 收款码图片路径（相对于 public 目录），可选
	link?: string; // 赞助链接 URL，可选。如果提供，会显示跳转按钮
	description?: string; // 描述文本
	enabled: boolean; // 是否启用
};

// 赞助者列表项
export type SponsorItem = {
	name: string; // 赞助者名称，如果想显示匿名，可以直接设置为"匿名"或使用 i18n
	amount?: string; // 赞助金额（可选）
	date?: string; // 赞助日期（可选，ISO 格式）
	message?: string; // 留言（可选）
};

// 赞助配置
export type SponsorConfig = {
	title?: string; // 页面标题，默认使用 i18n
	description?: string; // 页面描述文本
	usage?: string; // 赞助用途说明
	methods: SponsorMethod[]; // 赞助方式列表
	sponsors?: SponsorItem[]; // 赞助者列表（可选）
	showSponsorsList?: boolean; // 是否显示赞助者列表，默认 true
	showButtonInPost?: boolean; // 是否在文章详情页底部显示赞助按钮，默认 true
};
