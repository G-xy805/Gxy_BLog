import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	avatar: "/assets/images/avatar.webp",
	name: "Zayck",
	bio: "系统 · 高效 · 实用",
	links: [
		{
			name: "GitHub",
			icon: "ri:github-line",
			url: "https://github.com/zayck",
		},
		{
			name: "Bilibli",
			icon: "ri:bilibili-line",
			url: "https://space.bilibili.com/341981702",
		},
		{
			name: "WeChat",
			icon: "ri:wechat-2-line",
			url: "https://mp.weixin.qq.com/mp/homepage?__biz=MzU2MTI5MzE4OA==&hid=1&sn=356f3016aeac48fc034804fca1307349&scene=18#wechat_redirect",
		},		
		{
			name: "Rss",
			icon: "feather:rss",
			url: "/rss/",
		},
	],
};
