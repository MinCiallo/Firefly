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
	// 基础导航栏链接
	const links: (NavBarLink | LinkPreset)[] = [
		// 主页
		LinkPreset.Home,

		// 归档
		LinkPreset.Archive,
	];

	// 根据配置决定是否添加友链，在siteConfig关闭pages.friends时导航栏不显示友链
	if (siteConfig.pages.friends) {
		links.push(LinkPreset.Friends);
	}

	// 根据配置决定是否添加留言板，在siteConfig关闭pages.guestbook时导航栏不显示留言板
	if (siteConfig.pages.guestbook) {
		links.push(LinkPreset.Guestbook);
	}

	// 我的及其子菜单
	

	// VNDB
	if (siteConfig.pages.vndb) {
		links.push(LinkPreset.Vndb);
	}

	// 动态
	links.push(LinkPreset.Dynamic);

	// 相册
	links.push(LinkPreset.Gallery);

	// 其他及其子菜单
	links.push({
		name: "其他",
		url: "/content/",
		icon: "material-symbols:info",
		children: [
			// 订阅
			{
				name: "订阅",
				url: "/subscribe/",
				icon: "material-symbols:mail",
			},

			// 最近在听
			{
				name: "最近在听",
				url: "/music/",
				icon: "material-symbols:music-note",
			},

			// 根据配置决定是否添加赞助，在siteConfig关闭pages.sponsor时导航栏不显示赞助
			...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []),

			// 番组计划
			...(siteConfig.pages.bangumi ? [LinkPreset.Bangumi] : []),

			// 追番
			...(siteConfig.pages.anime ? [LinkPreset.Anime] : []),

			// 关于页面
			LinkPreset.About,
		],
	});

	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
