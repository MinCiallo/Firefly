// 字体配置
export const fontConfig = {
	// 是否启用自定义字体功能
	enable: true,
	// 是否预加载字体文件
	preload: true,
	// 当前选择的字体，支持多个字体组合
	selected: ["m-plus-rounded-1c"],

	// 字体列表
	// 推荐使用可靠的 CDN 服务商提供的字体链接，它天然做了按需分片加载，且性能较好
	//
	// 也可以使用本地字体文件，需自行进行字体子集化处理，否则会因为字体文件庞大增加带宽负担导致页面加载缓慢甚至无法加载
	// 如果进行字体子集化处理，会导致动态内容（如评论，Bangumi等）无法正确显示字体，因此不推荐使用本地字体文件
	fonts: {
		// 系统字体
		system: {
			id: "system",
			name: "系统字体",
			src: "", // 系统字体无需 src
			family:
				"system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		},

		// Google Fonts - Zen Maru Gothic
		"zen-maru-gothic": {
			id: "zen-maru-gothic",
			name: "Zen Maru Gothic",
			src: "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@300;400;500;700;900&display=swap",
			family: "Zen Maru Gothic",
			display: "swap" as const,
		},

		// Google Fonts - Inter
		inter: {
			id: "inter",
			name: "Inter",
			src: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
			family: "Inter",
			display: "swap" as const,
		},

		// 小米字体 - MiSans Normal
		"misans-normal": {
			id: "misans-normal",
			name: "MiSans Normal",
			src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Normal.min.css",
			family: "MiSans",
			weight: 400,
			display: "swap" as const,
		},

		// 小米字体 - MiSans Regular
		"misans-regular": {
			id: "misans-regular",
			name: "MiSans Regular",
			src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Regular.min.css",
			family: "MiSans",
			weight: 500,
			display: "swap" as const,
		},

		// 小米字体 - MiSans Semibold
		"misans-semibold": {
			id: "misans-semibold",
			name: "MiSans Semibold",
			src: "https://unpkg.com/misans@4.1.0/lib/Normal/MiSans-Semibold.min.css",
			family: "MiSans",
			weight: 600,
			display: "swap" as const,
		},

		// 苹方 - PingFang SC（仅 macOS/iOS 可用，其他系统回退）
		"pingfang": {
			id: "pingfang",
			name: "苹方",
			src: "", // 系统字体无需 src
			family: "PingFang SC",
			display: "swap" as const,
		},

		// Google Fonts - Noto Sans JP（日系无衬线）
		"noto-sans-jp": {
			id: "noto-sans-jp",
			name: "Noto Sans JP",
			src: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap",
			family: "Noto Sans JP",
			display: "swap" as const,
		},

		// Google Fonts - Noto Serif JP（日系衬线）
		"noto-serif-jp": {
			id: "noto-serif-jp",
			name: "Noto Serif JP",
			src: "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;700&display=swap",
			family: "Noto Serif JP",
			display: "swap" as const,
		},

		// Google Fonts - Kosugi Maru（日系可爱圆体）
		"kosugi-maru": {
			id: "kosugi-maru",
			name: "Kosugi Maru",
			src: "https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap",
			family: "Kosugi Maru",
			display: "swap" as const,
		},

		// Google Fonts - Yusei Magic（日系手写风）
		"yusei-magic": {
			id: "yusei-magic",
			name: "Yusei Magic",
			src: "https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap",
			family: "Yusei Magic",
			display: "swap" as const,
		},

		// Google Fonts - Mochiy Pop One（日系泡泡萌体）
		"mochiy-pop-one": {
			id: "mochiy-pop-one",
			name: "Mochiy Pop One",
			src: "https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap",
			family: "Mochiy Pop One",
			display: "swap" as const,
		},

		// Google Fonts - M PLUS Rounded 1c（日系圆润萌体）
		"m-plus-rounded-1c": {
			id: "m-plus-rounded-1c",
			name: "M PLUS Rounded 1c",
			src: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap",
			family: "M PLUS Rounded 1c",
			display: "swap" as const,
		},

		// Google Fonts - Hachi Maru Pop（日系手写萌体）
		"hachi-maru-pop": {
			id: "hachi-maru-pop",
			name: "Hachi Maru Pop",
			src: "https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap",
			family: "Hachi Maru Pop",
			display: "swap" as const,
		},

		// Google Fonts - Potta One（日系软萌体）
		"potta-one": {
			id: "potta-one",
			name: "Potta One",
			src: "https://fonts.googleapis.com/css2?family=Potta+One&display=swap",
			family: "Potta One",
			display: "swap" as const,
		},
	},

	// 全局字体回退
	fallback: [
		"system-ui",
		"-apple-system",
		"BlinkMacSystemFont",
		"Segoe UI",
		"Roboto",
		"sans-serif",
	],
};
