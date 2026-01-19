// 字体配置
export const fontConfig = {
	enable: false, // 禁用自定义字体功能，只使用系统字体
	preload: false, // 禁用字体预加载
	selected: ["system"], // 仅使用系统字体
	fonts: {
		// 仅保留系统字体
		system: {
			id: "system",
			name: "系统字体",
			src: "", // 系统字体无需 src
			family:
				"system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		},
	},
	fallback: [
		"system-ui",
		"-apple-system",
		"BlinkMacSystemFont",
		"Segoe UI",
		"Roboto",
		"sans-serif",
	], // 全局字体回退
};
