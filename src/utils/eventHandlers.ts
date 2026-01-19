import { SITE_THEME } from "@config";

// 集中管理页面加载和切换事件
class EventHandlerManager {
  private initialized = false;
  private swapHandlers: (() => void)[] = [];
  private loadHandlers: (() => void)[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;

    // 初始化主题管理
    this.initializeTheme();

    // 初始化复制功能
    this.initializeCopyButton();

    // 注册全局事件监听器
    document.addEventListener("astro:after-swap", this.handleAfterSwap.bind(this));
    document.addEventListener("astro:page-load", this.handlePageLoad.bind(this));

    this.initialized = true;
  }

  // 初始化主题管理
  private initializeTheme() {
    const storedTheme = localStorage.getItem("theme");
    const storedBannerMode = localStorage.getItem("banner-mode") || "normal";
    
    let theme;
    if (storedTheme) {
      theme = storedTheme;
    } else {
      theme = SITE_THEME.light;
      localStorage.setItem("theme", theme);
    }
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-banner-mode", storedBannerMode);
    
    const isDark = theme === SITE_THEME.dark || ['dark', 'synthwave', 'halloween', 'forest', 'black', 'luxury', 'dracula', 'business', 'night', 'coffee'].includes(theme);
    const themeType = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme-type", themeType);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          const newTheme = e.matches ? SITE_THEME.dark : SITE_THEME.light;
          document.documentElement.setAttribute("data-theme", newTheme);
          const newThemeType = e.matches ? "dark" : "light";
          document.documentElement.setAttribute(
            "data-theme-type",
            newThemeType,
          );
          localStorage.setItem("theme", newTheme);
        }
      });
  }

  // 初始化复制按钮功能
  private initializeCopyButton() {
    document.querySelectorAll(".btn-copy").forEach((button) => {
      button.addEventListener("click", async () => {
        const codeBlock = button.closest(".ryuchan-code");
        const code = codeBlock?.querySelector("code")?.textContent;
        if (!code) return;
        
        const copyIcon = button.querySelector(
          ".ryuchan-code-toolbar-copy-icon",
        );
        const successIcon = button.querySelector(
          ".ryuchan-code-toolbar-copy-success",
        );
        try {
          await navigator.clipboard.writeText(code);
          copyIcon?.classList.add("hidden");
          successIcon?.classList.remove("hidden");
          button.classList.add("copy-success");
          setTimeout(() => {
            copyIcon?.classList.remove("hidden");
            successIcon?.classList.add("hidden");
            button.classList.remove("copy-success");
          }, 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      });
    });
  }

  // 处理页面切换后的事件
  private handleAfterSwap() {
    this.swapHandlers.forEach(handler => handler());
    this.initializeCopyButton();
  }

  // 处理页面加载后的事件
  private handlePageLoad() {
    this.loadHandlers.forEach(handler => handler());
    this.initializeCopyButton();
  }

  // 添加页面切换后的事件处理器
  public addAfterSwapHandler(handler: () => void) {
    this.swapHandlers.push(handler);
  }

  // 添加页面加载后的事件处理器
  public addPageLoadHandler(handler: () => void) {
    this.loadHandlers.push(handler);
  }
}

// 导出单例实例
export const eventManager = new EventHandlerManager();
