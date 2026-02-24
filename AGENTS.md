# AGENTS.md

本文件包含在此代码库中工作的代理编码代理的指南和约定。

## 项目概述

**Gxy' Blog** - 基于 Astro 5.16.3 的静态博客，使用 TypeScript、Tailwind CSS 3.4.17、Svelte 5.45.2，Biome 用于代码检查，pnpm 作为包管理器。

## 构建和开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器 (localhost:4321)
pnpm start            # pnpm dev 的别名

# 构建和生产
pnpm build            # 构建生产版本 + pagefind 索引
pnpm preview          # 预览生产构建

# 代码质量
pnpm check            # 运行 Astro 类型检查
pnpm type-check       # TypeScript 类型检查 (tsc --noEmit) [推荐]
pnpm lint             # 运行 Biome linter 并自动修复
pnpm format           # 使用 Biome 格式化代码

# 工具
pnpm new-post         # 创建新博客文章
pnpm astro [命令]     # 运行 Astro CLI 命令
```

**注意**: 本项目未配置测试套件。

## 代码风格指南

### 导入模式
- 使用路径别名进行绝对导入（`@/`、`@components/`、`@utils/`）
- 使用 `import type` 进行纯类型导入
- 组件导入：`.astro` 或 `.svelte` 扩展名是必需的

### 文件命名
- 组件：PascalCase（`PostCard.astro`、`LightDarkSwitch.svelte`）
- 工具函数：kebab-case（`date-utils.ts`、`url-utils.ts`）
- 配置文件：camelCase 加上 Config 后缀（`siteConfig.ts`）
- 常量：UPPER_SNAKE_CASE

### TypeScript
- 启用严格模式
- 优先使用 `interface` 定义对象形状，`type` 用于联合类型和原始类型
- 工具函数使用函数声明，组件使用箭头函数

### Astro 组件
```astro
---
import type { CollectionEntry } from "astro:content";

interface Props {
  class?: string;
  entry: CollectionEntry<"posts">;
}
const { entry, class: className } = Astro.props;
---
<div class:list={["card-base", className]}>
```

### Svelte 组件
```svelte
<script lang="ts">
import { onMount } from "svelte";
$: formattedDate = formatDateI18n(date);
</script>
<button onclick={handleClick} class="btn-primary" />
```

### 错误处理
- 异步操作使用 `try/catch`
- 切勿使用空 catch 块或类型断言来绕过错误
- 对无效输入抛出有意义的错误

### CSS 和样式
- 使用 Tailwind CSS 工具类
- 使用 `class:list` 处理条件类
- 暗色模式：使用 `[data-theme='dark']` 选择器
- 移动端优先的响应式设计

## 路径别名 (tsconfig.json)
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@config/*` → `src/config/*`

## 组件组织
- `layout/` - 页面布局
- `content/` - 内容展示
- `interactive/` - 用户交互
- `common/` - 可复用 UI
- `widget/` - 侧边栏小部件

## 部署前检查清单
1. `pnpm type-check` 通过
2. `pnpm lint` 通过
3. `pnpm build` 成功完成

## 关键依赖
- Astro 生态、KaTeX（数学公式）、Expressive Code（语法高亮）
- Iconify 图标库、Swup 页面转场
- Pagefind 搜索、支持多种评论系统（Waline、Twikoo、Giscus 等）
