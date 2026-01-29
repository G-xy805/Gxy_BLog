import type { IconDefinition } from "@/types/config";

/**
 * 图标配置
 * 统一管理网站中使用的所有图标
 */
export const iconConfig: Record<string, IconDefinition> = {
  // 导航图标
  nav: {
    home: "material-symbols:home-rounded",
    categories: "material-symbols:category-rounded",
    archive: "material-symbols:archive-rounded",
    about: "material-symbols:person-rounded",
    search: "material-symbols:search-rounded",
    menu: "material-symbols:menu-rounded",
    close: "material-symbols:close-rounded",
  },
  
  // 社交图标
  social: {
    github: "devicon:github",
    twitter: "devicon:twitter",
    linkedin: "devicon:linkedin",
    email: "material-symbols:email-rounded",
    rss: "material-symbols:rss-feed-rounded",
  },
  
  // 功能图标
  feature: {
    code: "material-symbols:code-rounded",
    book: "material-symbols:book-rounded",
    lightbulb: "material-symbols:lightbulb-rounded",
    star: "material-symbols:star-rounded",
    heart: "material-symbols:favorite-rounded",
    share: "material-symbols:share-rounded",
    copy: "material-symbols:content-copy-rounded",
    check: "material-symbols:check-rounded",
    alert: "material-symbols:alert-rounded",
    info: "material-symbols:info-rounded",
    warning: "material-symbols:warning-rounded",
    error: "material-symbols:error-rounded",
    success: "material-symbols:check-circle-rounded",
  },
  
  // 文章相关图标
  post: {
    tag: "material-symbols:tag-rounded",
    calendar: "material-symbols:calendar-rounded",
    clock: "material-symbols:access-time-rounded",
    eye: "material-symbols:visibility-rounded",
    comment: "material-symbols:comment-rounded",
    thumbsUp: "material-symbols:thumb-up-rounded",
    readMore: "material-symbols:arrow-forward-rounded",
  },
  
  // 技术相关图标
  tech: {
    cpp: "devicon:cplusplus",
    astro: "devicon:astro",
    javascript: "devicon:javascript",
    typescript: "devicon:typescript",
    html: "devicon:html5",
    css: "devicon:css3",
    tailwind: "devicon:tailwindcss",
    node: "devicon:nodejs",
    git: "devicon:git",
    vscode: "devicon:vscode",
  },
  
  // 主题相关图标
  theme: {
    light: "material-symbols:light-mode-rounded",
    dark: "material-symbols:dark-mode-rounded",
    system: "material-symbols:brightness-auto-rounded",
    wallpaper: "material-symbols:wallpaper-rounded",
    font: "material-symbols:font-download-rounded",
  },
};

/**
 * 获取图标
 * @param category 图标分类
 * @param name 图标名称
 * @returns 图标标识符
 */
export const getIcon = (category: string, name: string): string => {
  return iconConfig[category]?.[name] || "material-symbols:help-rounded";
};

/**
 * 图标尺寸映射
 */
export const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
  "2xl-md": "w-14 h-14 md:w-16 md:h-16",
  "3xl": "w-12 h-12",
  "4xl": "w-16 h-16",
  "5xl": "w-20 h-20",
};

/**
 * 图标颜色类
 */
export const iconColors = {
  primary: "text-[var(--primary)]",
  secondary: "text-[var(--secondary)]",
  accent: "text-[var(--accent)]",
  text: "text-[var(--text-color)]",
  textSecondary: "text-[var(--text-secondary)]",
  textMuted: "text-[var(--text-muted)]",
  success: "text-[var(--success)]",
  warning: "text-[var(--warning)]",
  error: "text-[var(--error)]",
  info: "text-[var(--info)]",
};
