# Gxy' Blog

<p align="center">
  <img src="https://s1.vika.cn/space/2025/12/02/4967f95d7f9b4c9bae2368e9092796e8" width="280" alt="Gxy Blog Logo">
</p>

<p align="center">
  一个简洁、优雅、快速的静态博客！🚀 使用 Astro 5.0+ 开发。
</p>

<p align="center">
  <a href="https://gxy-blog.pages.dev/" target="_blank">🖥️ 在线预览</a>
</p>

---

## ✨ 核心特点

- 🚀 **极速性能** - 基于 Astro 5.0+ 构建，零 JS 运行时开销，首屏加载毫秒级
- 🎨 **精美设计** - 卡片式布局，Tailwind CSS 驱动，支持明暗主题无缝切换
- 📱 **响应式布局** - 移动端优先，完美适配手机、平板、桌面端
- 🔍 **全文搜索** - 集成 Pagefind，毫秒级文章搜索体验
- ⚡ **流畅动效** - ClientRouter 页面过渡，丝滑浏览体验
- 💬 **多元评论** - 支持 Twikoo、Waline、Giscus 等多种评论系统
- 🖼️ **图片优化** - 自动懒加载、响应式处理，极致视觉体验
- 📊 **数据可视化** - 站点统计、文章日历、字数统计等丰富数据展示
- 🌍 **多语言支持** - i18n 国际化，支持简中、繁中、英文、日文、俄语
- 🔖 **内容增强** - 代码高亮、数学公式、图片灯箱、浮动目录等

---

## 🚀 快速开始

### 环境要求

- Node.js ≤ 22
- pnpm ≤ 9

### 本地开发部署

1. **克隆仓库：**
   ```bash
   git clone https://github.com/G-xy805/Gxy_BLog.git
   cd Gxy_BLog
   ```

2. **安装依赖：**
   ```bash
   # 如果没有安装 pnpm，先安装
   npm install -g pnpm
   
   # 安装项目依赖
   pnpm install
   ```

3. **配置博客：**
   - 编辑 `src/config/` 目录下的配置文件自定义博客设置

4. **启动开发服务器：**
   ```bash
   pnpm dev
   ```
   博客将在 `http://localhost:4321` 可用

---

## 📁 项目结构

```
Gxy_BLog/
├── public/                 # 静态资源
│   ├── assets/
│   │   ├── images/        # 图片资源
│   │   ├── css/           # 样式文件
│   │   └── js/            # JavaScript 文件
│   └── favicon/           # 网站图标
├── src/
│   ├── components/        # Astro/Svelte 组件
│   │   ├── comment/       # 评论系统组件
│   │   ├── common/        # 通用组件
│   │   ├── content/       # 内容展示组件
│   │   ├── effects/       # 视觉效果组件
│   │   ├── interactive/   # 交互组件
│   │   ├── layout/        # 布局组件
│   │   ├── misc/          # 其他组件
│   │   └── widget/        # 侧边栏组件
│   ├── config/            # 配置文件
│   │   ├── siteConfig.ts       # 站点基础配置
│   │   ├── profileConfig.ts    # 用户资料配置
│   │   ├── commentConfig.ts    # 评论系统配置
│   │   ├── navBarConfig.ts     # 导航栏配置
│   │   ├── sidebarConfig.ts    # 侧边栏配置
│   │   └── ...
│   ├── content/           # 博客内容
│   │   └── posts/         # 文章目录
│   │       ├── C++/           # C++ 系列教程
│   │       ├── Astro魔改/      # Astro 博客魔改教程
│   │       └── 技术杂谈/       # 技术杂谈
│   ├── layouts/           # 页面布局
│   ├── pages/             # 页面路由
│   ├── plugins/           # 自定义插件
│   ├── scripts/           # 脚本工具
│   ├── styles/            # 全局样式
│   └── utils/             # 工具函数
├── scripts/               # 项目脚本
├── astro.config.mjs       # Astro 配置
├── tailwind.config.cjs    # Tailwind CSS 配置
└── package.json           # 项目依赖
```

---

## ⚙️ 配置说明

### 站点基础配置

编辑 `src/config/siteConfig.ts`：

```typescript
export const siteConfig: SiteConfig = {
  title: "Gxy' Blog",
  subtitle: "系统 · 高效 · 实用的技术分享",
  site_url: "https://gxy-blog.pages.dev/",
  description: "专注于C++、Astro和技术分享的博客...",
  lang: "zh_CN",
  // ... 更多配置
};
```

### 主题配置

```typescript
themeColor: {
  hue: 200,              // 主题色相 (0-360)
  fixed: false,          // 是否隐藏主题色选择器
  defaultMode: "light",  // 默认模式: light | dark | system
}
```

### 背景壁纸配置

```typescript
backgroundWallpaper: {
  mode: "banner",        // banner | overlay | none
  switchable: true,      // 是否允许切换
  src: {
    desktop: ["/assets/images/banner-light.webp", "/assets/images/banner-dark.webp"],
    mobile: ["/assets/images/banner-light.webp", "/assets/images/banner-dark.webp"]
  }
}
```

---

## 📝 内容创作

### 创建新文章

使用提供的脚本快速创建文章：

```bash
pnpm new-post
```

或手动在 `src/content/posts/` 目录下创建 Markdown 文件。

### 文章 Frontmatter

```yaml
---
title: 文章标题
description: 文章描述
published: 2026-01-30
category: 技术分类
tags:
  - 标签1
  - 标签2
cover: /assets/images/posts/cover.webp  # 封面图（可选）
---
```

### 支持的功能

- ✅ Markdown 基础语法
- ✅ 数学公式 (KaTeX)
- ✅ 代码高亮 (Expressive Code)
- ✅ Mermaid 图表
- ✅ 图片灯箱 (Fancybox)
- ✅ 视频嵌入
- ✅ 自定义指令

---

## 🚀 部署

### 平台托管部署

支持部署至 Vercel, Netlify, GitHub Pages, Cloudflare Pages, EdgeOne Pages 等平台。

**配置参数：**
- 框架预设：`Astro`
- 根目录：`./`
- 输出目录：`dist`
- 构建命令：`pnpm run build`
- 安装命令：`pnpm install`

### 本地构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

---

## 🛠️ 技术栈

- **框架**：[Astro](https://astro.build/) 5.16.3
- **样式**：[Tailwind CSS](https://tailwindcss.com/) 3.4.17
- **组件**：[Svelte](https://svelte.dev/) 5.45.2
- **图标**：[Astro Icon](https://www.astroicon.dev/) + Iconify
- **动画**：[Swup](https://swup.js.org/) 页面过渡
- **搜索**：[Pagefind](https://pagefind.app/) 静态搜索
- **代码高亮**：[Expressive Code](https://expressive-code.com/)
- **数学公式**：[KaTeX](https://katex.org/)
- **类型检查**：[TypeScript](https://www.typescriptlang.org/) 5.9.2

---

## 📄 许可证

[MIT](LICENSE) License © 2025-Present [Gxy](https://github.com/G-xy805)

---

<p align="center">
  用 ❤️ 和 Astro 构建
</p>
