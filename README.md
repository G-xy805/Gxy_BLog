<pre align="center">
一个简洁、优雅、快速的静态博客模板！🚀 使用 Astro 开发。
</pre>

<div align="center">
<img alt="Kael Logo" src="https://s1.vika.cn/space/2025/12/02/4967f95d7f9b4c9bae2368e9092796e8" width="280px">
</div>


[**🖥️ Kael Demo**](https://zayck-demo.pages.dev)
[**🖥️ 我的博客**](https://gstudycodes.pages.dev/)


## 📷 预览

![preview](https://s1.vika.cn/space/2025/12/02/7559170593c440c6a843cced5dd24c4a)


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



## 🚀 快速开始

### 环境要求

- Node.js ≤ 22
- pnpm ≤ 9

### 本地开发部署

1. **克隆仓库：**
   ```bash
   git clone https://github.com/zayck/Kael.git
   cd Kael
   ```
   **先 [Fork](https://github.com/zayck/Kael/fork) 到自己仓库在克隆（推荐）**
   ```bash
   git clone https://github.com/you-github-name/Kael.git
   cd Kael
   ```
3. **安装依赖：**
   ```bash
   # 如果没有安装 pnpm，先安装
   npm install -g pnpm
   
   # 安装项目依赖
   pnpm install
   ```

4. **配置博客：**
   - 编辑 `src/config/` 目录下的配置文件自定义博客设置

5. **启动开发服务器：**
   ```bash
   pnpm dev
   ```
   博客将在 `http://localhost:4321` 可用

### 平台托管部署
- **可将博客部署至 Vercel, Netlify, GitHub Pages, Cloudflare Pages, EdgeOne Pages 等。**

   框架预设： `Astro`

   根目录： `./`

   输出目录： `dist`

   构建命令： `pnpm run build`

   安装命令： `pnpm install`


### 设置网站语言

要设置博客的默认语言，请编辑 `src/config/siteConfig.ts` 文件：

```typescript
// 定义站点语言
const SITE_LANG = "zh_CN";
```

**支持的语言代码：**
- `zh_CN` - 简体中文
- `zh_TW` - 繁体中文
- `en` - 英文
- `ja` - 日文
- `ru` - 俄文


### 配置文件结构

```
src/
├── config/
│   ├── index.ts              # 配置索引文件
│   ├── siteConfig.ts         # 站点基础配置
│   ├── profileConfig.ts      # 用户资料配置
│   ├── commentConfig.ts      # 评论系统配置
│   ├── licenseConfig.ts      # 许可证配置
│   ├── expressiveCodeConfig.ts # 代码高亮配置
│   ├── fontConfig.ts         # 字体配置
│   ├── sidebarConfig.ts      # 侧边栏布局配置
│   ├── navBarConfig.ts       # 导航栏配置
│   ├── friendsConfig.ts      # 友链配置
│   ├── sponsorConfig.ts      # 赞助配置
```
