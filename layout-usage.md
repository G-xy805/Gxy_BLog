# 布局组件使用情况

## 使用 MainGridLayout.astro 的页面

以下页面直接使用了 `MainGridLayout.astro` 布局：

- `src/pages/posts/[...slug].astro` - 博客文章详情页
- `src/pages/about.astro` - 关于页面
- `src/pages/rss.astro` - RSS 页面
- `src/pages/friends.astro` - 友链页面
- `src/pages/sponsor.astro` - 赞助页面
- `src/pages/project.astro` - 项目页面
- `src/pages/404.astro` - 404 错误页面
- `src/pages/archive.astro` - 归档页面
- `src/pages/[...page].astro` - 分页页面

## 使用 Layout.astro 的页面和组件

`Layout.astro` 是基础布局组件，被广泛使用：

### 直接使用的页面
- `src/pages/rss.astro` - RSS 页面

### 通过 MainGridLayout.astro 间接使用的页面
所有使用 `MainGridLayout.astro` 的页面都间接使用了 `Layout.astro`，因为 `MainGridLayout.astro` 内部引用了 `Layout.astro`。

### 使用 Layout.astro 的组件
- `src/components/layout/PostPage.astro` - 文章页面组件
- `src/components/interactive/FloatingTOC.astro` - 浮动目录组件
- `src/components/widget/SiteStats.astro` - 站点统计组件
- `src/components/widget/Tags.astro` - 标签组件
- `src/components/widget/SidebarTOC.astro` - 侧边栏目录组件
- `src/components/widget/WidgetLayout.astro` - 小部件布局组件
- `src/components/widget/Categories.astro` - 分类组件
- `src/components/widget/Calendar.astro` - 日历组件

## 布局层次关系

```
Layout.astro (基础布局)
├── MainGridLayout.astro (主网格布局)
│   ├── 博客文章详情页
│   ├── 关于页面
│   ├── 友链页面
│   ├── 赞助页面
│   ├── 项目页面
│   ├── 404 错误页面
│   ├── 归档页面
│   └── 分页页面
├── RSS 页面
└── 各种组件
    ├── 文章页面组件
    ├── 浮动目录组件
    └── 各种小部件组件
```