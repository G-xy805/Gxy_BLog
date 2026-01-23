import type { ExpressiveCodeConfig } from "../types/config";

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 暗色主题（用于暗色模式）
	darkTheme: "github-dark",
	// 亮色主题（用于亮色模式）
	lightTheme: "github-dark",

	// 复制按钮配置
	copy: {
		enabled: true,
		tooltip: "复制代码",
		successText: "复制成功!",
	},

	// 更多样式请看expressive-code的官方文档
	// https://expressive-code.com/guides/themes/
};
