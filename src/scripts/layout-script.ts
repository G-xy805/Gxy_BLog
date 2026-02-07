import { expressiveCodeConfig, siteConfig } from "@/config";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_HOME,
} from "@/constants/constants";
import { initIconLoader } from "@/utils/icon-loader";
import { logger } from "@/utils/logger";
import { initWallpaperMode } from "@/utils/setting-utils";
import { pathsEqual, url } from "@/utils/url-utils";

// 确保所有代码只在客户端执行
if (typeof window !== "undefined" && typeof document !== "undefined") {
	const bannerEnabled = !!document.getElementById("banner-wrapper");
	let _netErrToastShown = false;
	function _showNetErrToast(text: string) {
		if (_netErrToastShown) return;
		_netErrToastShown = true;
		const el = document.createElement("div");
		el.id = "net-error-toast";
		el.textContent = text;
		el.style.position = "fixed";
		el.style.top = "32px";
		el.style.left = "50%";
		el.style.transform = "translateX(-50%) translateY(-20px)";
		el.style.zIndex = "9999";
		el.style.padding = "12px 20px";
		el.style.borderRadius = "12px";
		el.style.backdropFilter = "blur(8px)";
		el.style.background = "rgba(239, 68, 68, 0.9)"; // 使用红色 (Tailwind red-500)
		el.style.color = "#fff";
		el.style.fontSize = "15px";
		el.style.fontWeight = "600";
		el.style.boxShadow = "0 10px 25px rgba(239, 68, 68, 0.3)";
		el.style.transition = "all .4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
		el.style.opacity = "0";
		document.body.appendChild(el);
		requestAnimationFrame(() => {
			el.style.opacity = "1";
			el.style.transform = "translateX(-50%) translateY(0)";
		});
		setTimeout(() => {
			el.style.opacity = "0";
			el.style.transform = "translateX(-50%) translateY(-20px)";
			setTimeout(() => {
				el.remove();
			}, 400);
		}, 4000);
	}
	window.addEventListener("unhandledrejection", (e) => {
		const m =
			typeof e.reason === "string"
				? e.reason
				: String((e.reason && (e.reason.message || e.reason.toString())) || "");
		if (m.includes("Failed to fetch") || m.includes("ERR_FAILED")) {
			_showNetErrToast("网络异常：评论服务暂不可用");
		}
	});
	window.addEventListener("error", (e) => {
		const m = String(e.message || "");
		if (m.includes("Failed to fetch") || m.includes("ERR_FAILED")) {
			_showNetErrToast("网络异常：评论服务暂不可用");
		}
	});

	function setClickOutsideToClose(panel: string, ignores: string[]) {
		document.addEventListener("click", (event) => {
			const panelDom = document.getElementById(panel);
			const tDom = event.target;
			if (!(tDom instanceof Node)) return; // Ensure the event target is an HTML Node
			for (const ig of ignores) {
				const ie = document.getElementById(ig);
				if (ie === tDom || ie?.contains(tDom)) {
					return;
				}
			}
			if (panelDom) {
				panelDom.classList.add("float-panel-closed");
			}
		});
	}
	setClickOutsideToClose("display-setting", [
		"display-setting",
		"display-settings-switch",
	]);
	setClickOutsideToClose("nav-menu-panel", [
		"nav-menu-panel",
		"nav-menu-switch",
	]);
	setClickOutsideToClose("search-panel", [
		"search-panel",
		"search-bar",
		"search-switch",
	]);
	setClickOutsideToClose("wallpaper-mode-panel", [
		"wallpaper-mode-panel",
		"wallpaper-mode-switch",
	]);
	setClickOutsideToClose("theme-mode-panel", [
		"theme-mode-panel",
		"scheme-switch",
	]);

	function initCustomScrollbar() {
		// 只处理katex元素的滚动条，使用浏览器原生滚动条
		const katexElements = document.querySelectorAll(
			".katex-display:not([data-scrollbar-initialized])",
		) as NodeListOf<HTMLElement>;
		katexElements.forEach((element) => {
			if (!element.parentNode) return;

			const container = document.createElement("div");
			container.className = "katex-display-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);

			// 使用浏览器原生滚动条，无自定义样式
			container.style.cssText = `
      overflow-x: auto;
    `;

			element.setAttribute("data-scrollbar-initialized", "true");
		});
	}

	function showBanner() {
		const isBannerMode = siteConfig.backgroundWallpaper.mode === "banner";
		if (!isBannerMode) return;

		// 使用requestAnimationFrame优化DOM操作
		requestAnimationFrame(() => {
			// Handle single image banner (desktop)
			const banner = document.getElementById("banner");
			if (banner) {
				banner.classList.remove("opacity-0", "scale-105");
			}

			// Handle mobile single image banner - 使用与电脑端相同的逻辑
			const mobileBanner = document.querySelector(
				'.block.lg\\:hidden[alt="Mobile banner image of the blog"]',
			);
			if (mobileBanner) {
				// 移动端使用与电脑端相同的初始化逻辑
				mobileBanner.classList.remove("opacity-0", "scale-105");
				mobileBanner.classList.add("opacity-100");
			}
		});
	}

	const setup = () => {
		// @ts-expect-error
		window.swup.hooks.on("link:click", () => {
			// Remove the delay for the first time page load
			document.documentElement.style.setProperty("--content-delay", "0ms");

			// 添加页面切换保护，防止导航栏闪烁
			document.documentElement.classList.add("is-page-transitioning");

			// 简化navbar处理逻辑 - 移除隐藏/显示逻辑，保持统一风格
			if (bannerEnabled) {
				const navbar = document.getElementById("navbar-wrapper");
				if (navbar && document.body.classList.contains("lg:is-home")) {
					// const threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 88;
					// if (document.documentElement.scrollTop >= threshold) {
					// 	navbar.classList.add("navbar-hidden");
					// }
				}
			}
		});
		// @ts-expect-error
		window.swup.hooks.on("content:replace", () => {
			// 强制重新初始化图标加载器
			setTimeout(() => {
				document
					.querySelectorAll("[data-icon-container]")
					.forEach((container) => {
						container.removeAttribute("data-icon-initialized");
					});
				import("@/utils/icon-loader").then(({ initIconLoader }) => {
					initIconLoader();
				});
			}, 50);

			// 重新初始化导航栏JavaScript功能
			// @ts-expect-error
			if (typeof loadButtonScript === "function") {
				// @ts-expect-error
				setTimeout(loadButtonScript, 100); // 延迟执行确保DOM已更新
			}

			// 重新初始化移动端下拉菜单
			if (typeof window !== "undefined" && window.initMobileDropdowns) {
				setTimeout(window.initMobileDropdowns, 150); // 稍晚一点执行
			}

			// 只在文章页面处理数学公式滚动条和TOC组件
			// 客户端重新计算是否为文章页面
			const isArticlePage = document.querySelector(".post-container") !== null;
			if (isArticlePage) {
				// 处理katex元素的容器，使用浏览器原生滚动条
				initCustomScrollbar();

				// 检查当前页面是否为文章页面（有TOC元素）
				const tocWrapper = document.getElementById("toc-wrapper");
				if (tocWrapper) {
					const tocElement = document.querySelector("table-of-contents") as
						| (HTMLElement & { init?: () => void })
						| null;
					if (tocElement && typeof tocElement.init === "function") {
						setTimeout(() => {
							tocElement.init?.();
						}, 100);
					}
				}
			}

			// 在页面切换后恢复布局状态（支持文章详情页的布局切换）
			setTimeout(() => {
				const savedLayout = localStorage.getItem("postListLayout");
				if (savedLayout) {
					const mainGrid = document.getElementById("main-grid");

					// 根据保存的布局状态调整布局
					if (savedLayout === "grid") {
						if (mainGrid) {
							mainGrid.classList.add("grid-layout-active");
						}
					} else {
						if (mainGrid) {
							mainGrid.classList.remove("grid-layout-active");
						}
					}
				}
			}, 50);
		});
		// @ts-expect-error
		window.swup.hooks.on("visit:start", (visit: { to: { url: string } }) => {
			// change banner height immediately when a link is clicked
			const bodyElement = document.querySelector("body");
			const isHomePage = pathsEqual(visit.to.url, url("/"));

			if (isHomePage) {
				bodyElement?.classList.add("lg:is-home");
			} else {
				bodyElement?.classList.remove("lg:is-home");
			}

			// Control banner text visibility based on page
			const bannerTextOverlay = document.querySelector(".banner-text-overlay");
			if (bannerTextOverlay) {
				if (isHomePage) {
					bannerTextOverlay.classList.remove("hidden");
				} else {
					bannerTextOverlay.classList.add("hidden");
				}
			}

			// Control navbar transparency based on page
			const navbar = document.getElementById("navbar");
			if (navbar) {
				navbar.setAttribute("data-is-home", isHomePage.toString());
			}

			// Control mobile banner visibility based on page with improved staging animation
			// 只在移动端（1024px以下）处理banner隐藏
			const isMobile = window.innerWidth < 1024;

			// 在移动端禁用文章列表容器的过渡动画，防止与主内容区位置变化冲突
			if (isMobile) {
				const postListContainer = document.getElementById(
					"post-list-container",
				);
				if (postListContainer) {
					postListContainer.style.transition = "none";
				}
			}

			const bannerWrapper = document.getElementById("banner-wrapper");
			const mainContentWrapper = document.querySelector(
				".absolute.w-full.z-30",
			) as HTMLElement | null;

			if (isMobile && bannerWrapper && mainContentWrapper) {
				if (isHomePage) {
					// 首页：禁用主内容区域的过渡动画，防止文章列表下移
					mainContentWrapper.style.transition = "none";

					// 先显示banner，然后移除隐藏类让其优雅出现
					bannerWrapper.style.display = "";
					setTimeout(() => {
						bannerWrapper.classList.remove("mobile-hide-banner");
					}, 100);
					setTimeout(() => {
						mainContentWrapper.classList.remove("mobile-main-no-banner");
						// 在移除类之后立即恢复过渡动画（下次导航时使用）
						setTimeout(() => {
							mainContentWrapper.style.transition = "";
						}, 50);
					}, 150);
				} else {
					// 非首页：分阶段隐藏，先隐藏banner，再移动内容
					bannerWrapper.classList.add("mobile-hide-banner");
					// 延迟移动内容，让banner先完全消失
					setTimeout(() => {
						mainContentWrapper.classList.add("mobile-main-no-banner");
					}, 100);
				}
			} else if (!isMobile && bannerWrapper) {
				// 桌面端：确保banner正常显示
				bannerWrapper.style.display = "";
				bannerWrapper.classList.remove("mobile-hide-banner");
				if (mainContentWrapper) {
					mainContentWrapper.classList.remove("mobile-main-no-banner");
				}
			}

			// increase the page height during page transition to prevent the scrolling animation from jumping
			const heightExtend = document.getElementById("page-height-extend");
			if (heightExtend) {
				heightExtend.classList.remove("hidden");
			}

			// Hide the TOC while scrolling back to top
			const toc = document.getElementById("toc-wrapper");
			if (toc) {
				toc.classList.add("toc-not-ready");
			}
		});
		// @ts-expect-error
		window.swup.hooks.on("page:view", () => {
			// hide the temp high element when the transition is done
			const heightExtend = document.getElementById("page-height-extend");
			if (heightExtend) {
				heightExtend.classList.remove("hidden");
			}

			// 确保页面滚动到顶部，使用平滑滚动避免侧边栏闪烁
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});

			// 在移动端恢复文章列表容器的过渡动画（在主内容区位置动画完成后）
			const isMobile = window.innerWidth < 1024;
			if (isMobile) {
				setTimeout(() => {
					const postListContainer = document.getElementById(
						"post-list-container",
					);
					if (postListContainer) {
						postListContainer.style.transition = "";
					}
				}, 600); // 等待主内容区动画完成（0.4s + 0.1s delay + 100ms buffer）
			}

			// 只在文章页面同步主题状态 - 解决从首页进入文章页面时代码块渲染问题
			// 客户端重新计算是否为文章页面
			const isArticlePage = document.querySelector(".post-container") !== null;
			if (isArticlePage) {
				const storedTheme = localStorage.getItem("theme") || "light";
				let isDark = false;

				// 处理 system 模式
				if (storedTheme === "system") {
					isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				} else {
					isDark = storedTheme === "dark";
				}

				const expectedTheme = isDark
					? expressiveCodeConfig.darkTheme
					: expressiveCodeConfig.lightTheme;
				const currentTheme =
					document.documentElement.getAttribute("data-theme");

				// 如果主题不匹配，静默更新（不触发事件，避免重新加载效果）
				if (currentTheme !== expectedTheme) {
					document.documentElement.setAttribute("data-theme", expectedTheme);
				}
			}

			// 只在文章页面和友链页面触发评论系统初始化
			const needCommentSystem =
				window.location.pathname.startsWith("/posts/") ||
				window.location.pathname.startsWith("/links/");
			if (needCommentSystem) {
				setTimeout(() => {
					if (document.getElementById("tcomment")) {
						// 触发自定义事件，通知评论系统页面已完全加载
						const pageLoadedEvent = new CustomEvent("firefly:page:loaded", {
							detail: {
								path: window.location.pathname,
								timestamp: Date.now(),
							},
						});
						document.dispatchEvent(pageLoadedEvent);
						logger.info(
							"Layout: 触发 firefly:page:loaded 事件，路径:",
							window.location.pathname,
						);
					}
				}, 300);
			}
		});
		// @ts-expect-error
		window.swup.hooks.on("visit:end", (_visit: { to: { url: string } }) => {
			setTimeout(() => {
				const heightExtend = document.getElementById("page-height-extend");
				if (heightExtend) {
					heightExtend.classList.add("hidden");
				}

				// Just make the transition looks better
				const toc = document.getElementById("toc-wrapper");
				if (toc) {
					toc.classList.remove("toc-not-ready");
				}

				// 移除页面切换保护，恢复过渡动画
				document.documentElement.classList.remove("is-page-transitioning");
			}, 200);
		});
	};

	// 全局布局切换监听器 - 支持在任何页面（包括文章详情页）切换布局
	window.addEventListener("layoutChange", (event: CustomEvent) => {
		const newLayout = event.detail.layout;
		const mainGrid = document.getElementById("main-grid");
		const postContainer = document.getElementById("post-container");
		const swupContainer = document.getElementById("swup-container");

		// 只在文章详情页为文章容器添加切换动画
		// 客户端重新计算是否为文章页面
		const isArticlePage = document.querySelector(".post-container") !== null;
		if (isArticlePage && postContainer) {
			postContainer.classList.add("layout-switching");
			setTimeout(() => {
				postContainer.classList.remove("layout-switching");
			}, 400);
		}

		// 为主内容区添加切换动画
		if (swupContainer) {
			swupContainer.classList.add("layout-transitioning");
			setTimeout(() => {
				swupContainer.classList.remove("layout-transitioning");
			}, 500);
		}

		// 根据新布局状态调整布局
		if (newLayout === "grid") {
			if (mainGrid) {
				mainGrid.classList.add("grid-layout-active");
			}
		} else {
			if (mainGrid) {
				mainGrid.classList.remove("grid-layout-active");
			}
		}
	});

	// @ts-expect-error
	if (window?.swup?.hooks) {
		setup();
	} else {
		document.addEventListener("swup:enable", setup);
	}

	const backToTopBtn = document.getElementById("back-to-top-btn");
	const toc = document.getElementById("toc-wrapper");
	const navbar = document.getElementById("navbar-wrapper");

	// 优化的滚动处理函数
	function scrollFunction() {
		const scrollTop = document.documentElement.scrollTop;
		const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);

		// 使用批量DOM操作优化性能
		const operations: (() => void)[] = [];

		if (backToTopBtn) {
			operations.push(() => {
				if (scrollTop > bannerHeight) {
					backToTopBtn.classList.remove("hide");
				} else {
					backToTopBtn.classList.add("hide");
				}
			});
		}

		if (bannerEnabled && toc) {
			operations.push(() => {
				if (scrollTop > bannerHeight) {
					toc.classList.remove("toc-hide");
				} else {
					toc.classList.add("toc-hide");
				}
			});
		}

		if (bannerEnabled && navbar) {
			operations.push(() => {
				const isHome =
					document.body.classList.contains("lg:is-home") &&
					window.innerWidth >= 1024;
				const currentBannerHeight = isHome ? BANNER_HEIGHT_HOME : BANNER_HEIGHT;
				const threshold = window.innerHeight * (currentBannerHeight / 100) - 88;

				// 移除隐藏/显示逻辑，保持统一风格
				// if (scrollTop >= threshold) {
				// 	navbar.classList.add("navbar-hidden");
				// } else {
				// 	navbar.classList.remove("navbar-hidden");
				// }
			});
		}

		// 批量执行DOM操作
		if (operations.length > 0) {
			requestAnimationFrame(() => {
				operations.forEach((op) => {
					op();
				});
			});
		}
	}

	// 使用优化的滚动性能处理
	let scrollTimeout: number;
	window.addEventListener(
		"scroll",
		() => {
			if (scrollTimeout) {
				cancelAnimationFrame(scrollTimeout);
			}
			scrollTimeout = requestAnimationFrame(scrollFunction);
		},
		{ passive: true },
	);

	window.onresize = () => {
		// calculate the --banner-height-extend, which needs to be a multiple of 4 to avoid blurry text
		let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
		offset = offset - (offset % 4);
		document.documentElement.style.setProperty(
			"--banner-height-extend",
			`${offset}px`,
		);
	};

	// 页面加载完成后初始化banner和katex容器
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			// 预加载背景图片
			preloadBackgroundImages();
			showBanner();
			// 只在文章页面初始化数学公式容器
			// 客户端重新计算是否为文章页面
			const isArticlePage = document.querySelector(".post-container") !== null;
			if (isArticlePage) {
				initCustomScrollbar();
			}
			// Initialize wallpaper mode
			initWallpaperMode();
			initIconLoader();
			// 添加主题切换监听器
			addThemeChangeListener();
			// 初始化背景图片，确保与当前主题一致
			updateBackgroundImages();
		});
	} else {
		// 预加载背景图片
		preloadBackgroundImages();
		showBanner();
		// 只在文章页面初始化数学公式容器
		// 客户端重新计算是否为文章页面
		const isArticlePage = document.querySelector(".post-container") !== null;
		if (isArticlePage) {
			initCustomScrollbar();
		}
		// Initialize wallpaper mode
		initWallpaperMode();
		initIconLoader();
		// 添加主题切换监听器
		addThemeChangeListener();
		// 初始化背景图片，确保与当前主题一致
		updateBackgroundImages();
	}

	// 预加载背景图片
	function preloadBackgroundImages() {
		// 定义背景图片路径 - 与siteConfig中的配置一致
		const lightImages = {
			desktop: "/assets/images/banner-light.webp",
			mobile: "/assets/images/banner-light.webp",
		};

		const darkImages = {
			desktop: "/assets/images/banner-dark.webp",
			mobile: "/assets/images/banner-dark.webp",
		};

		// 预加载亮色主题图片
		const lightDesktopImg = new Image();
		lightDesktopImg.src = lightImages.desktop;

		const lightMobileImg = new Image();
		lightMobileImg.src = lightImages.mobile;

		// 预加载暗色主题图片
		const darkDesktopImg = new Image();
		darkDesktopImg.src = darkImages.desktop;

		const darkMobileImg = new Image();
		darkMobileImg.src = darkImages.mobile;

		console.log("背景图片预加载完成");
	}

	// 添加主题切换监听器，动态更新背景图片
	function addThemeChangeListener() {
		// 创建主题切换覆盖层元素
		const createOverlay = () => {
			let overlay = document.getElementById("theme-transition-overlay");
			if (!overlay) {
				overlay = document.createElement("div");
				overlay.id = "theme-transition-overlay";
				overlay.className = "theme-transition-overlay";
				document.body.appendChild(overlay);
			}
			return overlay;
		};

		// 显示主题切换动画
		const showThemeTransition = () => {
			const overlay = createOverlay();

			// 重置覆盖层状态
			overlay.classList.remove("active", "fade-out");

			// 触发重排
			overlay.offsetHeight;

			// 显示覆盖层
			overlay.classList.add("active");

			// 动画完成后淡出
			setTimeout(() => {
				overlay.classList.add("fade-out");

				// 动画结束后移除覆盖层
				setTimeout(() => {
					overlay.remove();
				}, 400);
			}, 200);
		};

		// 监听主题切换事件
		document.addEventListener("theme:changed", () => {
			// 显示主题切换动画
			showThemeTransition();
			// 直接执行背景图片更新
			updateBackgroundImages();
		});

		// 监听系统主题变化
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", () => {
				// 显示主题切换动画
				showThemeTransition();
				// 直接执行背景图片更新
				updateBackgroundImages();
			});
	}

	// 更新背景图片
	function updateBackgroundImages() {
		// 查找桌面端图片元素（在id="banner"的div内部）
		const bannerDiv = document.getElementById("banner");
		let desktopImg = bannerDiv ? bannerDiv.querySelector("img") : null;

		// 查找移动端图片元素（在id="banner-mobile"的div内部）
		const mobileDiv = document.getElementById("banner-mobile");
		let mobileImg = mobileDiv ? mobileDiv.querySelector("img") : null;

		// 如果找不到图片元素，创建一个新的图片元素并添加到容器中
		if (bannerDiv && !desktopImg) {
			desktopImg = document.createElement("img");
			desktopImg.className = "w-full h-full object-cover";
			desktopImg.style.objectPosition = "center";
			desktopImg.loading = "lazy";
			desktopImg.decoding = "async";
			desktopImg.alt = "Desktop background image of the blog";
			bannerDiv.appendChild(desktopImg);
		}

		if (mobileDiv && !mobileImg) {
			mobileImg = document.createElement("img");
			mobileImg.className = "w-full h-full object-cover";
			mobileImg.style.objectPosition = "center";
			mobileImg.loading = "lazy";
			mobileImg.decoding = "async";
			mobileImg.alt = "Mobile background image of the blog";
			mobileDiv.appendChild(mobileImg);
		}

		if (desktopImg || mobileImg) {
			// 获取当前主题
			const isDark = document.documentElement.classList.contains("dark");

			// 定义背景图片路径 - 与siteConfig中的配置一致
			const lightImages = {
				desktop: "/assets/images/banner-light.webp",
				mobile: "/assets/images/banner-light.webp",
			};

			const darkImages = {
				desktop: "/assets/images/banner-dark.webp",
				mobile: "/assets/images/banner-dark.webp",
			};

			// 根据主题选择图片
			const selectedImages = isDark ? darkImages : lightImages;

			// 添加主题切换硬件加速类
			document.documentElement.classList.add("theme-transitioning");

			// 添加淡入淡出效果的函数
			const updateWithFade = (imgElement: HTMLImageElement, newSrc: string) => {
				if (!imgElement) return;

				// 开始淡出
				imgElement.style.opacity = "0";

				// 等待淡出完成后更新图片
				setTimeout(() => {
					imgElement.setAttribute("src", newSrc);

					// 图片加载完成后淡入
					imgElement.onload = () => {
						imgElement.style.opacity = "1";
						// 动画完成后移除硬件加速类
						setTimeout(() => {
							document.documentElement.classList.remove("theme-transitioning");
						}, 300);
					};
				}, 200);
			};

			// 更新桌面端图片
			if (desktopImg) {
				updateWithFade(desktopImg as HTMLImageElement, selectedImages.desktop);
			}

			// 更新移动端图片
			if (mobileImg) {
				updateWithFade(mobileImg as HTMLImageElement, selectedImages.mobile);
			}

			console.log(`背景图片已更新为${isDark ? "暗色" : "亮色"}主题`);
		}
	}
}
