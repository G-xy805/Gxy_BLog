# Waline 评论区主题系统使用指南

## 概述

本主题系统为 Waline 评论区提供了完整的亮色/暗色主题切换功能，与你的博客整体主题风格保持一致。支持自动跟随系统主题、手动切换，并针对不同平台进行了优化。

## 功能特性

✨ **核心功能**
- 🌓 完整的亮色/暗色主题支持
- 🔄 自动跟随系统主题
- 🎨 与应用主题完美融合
- 💾 主题偏好本地存储
- ⚡ 平滑的主题过渡动画
- 📱 跨平台兼容性优化
- ♿ WCAG 无障碍标准支持
- 🎯 响应式设计

## 文件结构

```
src/
├── components/
│   ├── comment/
│   │   └── Waline.astro                    # Waline 组件（已更新）
│   └── interactive/
│       └── WalineThemeSwitch.svelte        # Waline 主题切换按钮（新增）
├── styles/
│   └── waline-theme.css                   # Waline 主题样式（新增）
├── utils/
│   └── waline-theme-manager.ts            # Waline 主题管理器（新增）
└── global.d.ts                            # 全局类型定义（已更新）
```

## 快速开始

### 1. 基本使用

Waline 组件已经自动集成了主题系统，无需额外配置。只需在需要评论的地方使用 Waline 组件即可：

```astro
---
import Waline from '@/components/comment/Waline.astro';
---

<Waline path="/posts/your-post-path" />
```

### 2. 使用主题切换按钮

如果你想在评论区附近添加一个独立的主题切换按钮，可以使用 `WalineThemeSwitch` 组件：

```svelte
<script>
  import WalineThemeSwitch from '@/components/interactive/WalineThemeSwitch.svelte';
</script>

<WalineThemeSwitch />
```

## 主题配置

### 亮色主题变量

Waline 亮色主题使用以下 CSS 变量：

```css
:root:not(.dark) #waline {
  --waline-theme-color: var(--primary);           /* 主题色 */
  --waline-active-color: var(--secondary);        /* 激活色 */
  --waline-text-color: var(--text-color);        /* 文本色 */
  --waline-bg-color: var(--card-bg);             /* 背景色 */
  --waline-bg-color-light: #F8FAFC;              /* 浅色背景 */
  --waline-bg-color-hover: #F1F5F9;             /* 悬停背景 */
  --waline-border-color: var(--card-border);     /* 边框色 */
  --waline-shadow: var(--card-shadow);           /* 阴影 */
  /* ... 更多变量 */
}
```

### 暗色主题变量

Waline 暗色主题使用以下 CSS 变量：

```css
:root.dark #waline {
  --waline-theme-color: var(--primary);           /* 主题色 */
  --waline-active-color: var(--secondary);        /* 激活色 */
  --waline-text-color: var(--text-color);        /* 文本色 */
  --waline-bg-color: var(--card-bg);             /* 背景色 */
  --waline-bg-color-light: #1E293B;              /* 浅色背景 */
  --waline-bg-color-hover: #334155;             /* 悬停背景 */
  --waline-border-color: var(--card-border);     /* 边框色 */
  --waline-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* 阴影 */
  /* ... 更多变量 */
}
```

## API 参考

### WalineThemeManager

主题管理器提供了以下方法：

#### `initWalineThemeManager(): Promise<void>`

初始化 Waline 主题管理器。

```typescript
import { initWalineThemeManager } from '@/utils/waline-theme-manager';

await initWalineThemeManager();
```

#### `setWalineInstance(instance: WalineInstance | null): void`

设置 Waline 实例，用于主题更新。

```typescript
import { setWalineInstance } from '@/utils/waline-theme-manager';
import { init } from '@waline/client';

const waline = init(config);
setWalineInstance(waline);
```

#### `updateWalineTheme(): void`

手动更新 Waline 主题。

```typescript
import { updateWalineTheme } from '@/utils/waline-theme-manager';

updateWalineTheme();
```

#### `setWalineTheme(theme: LIGHT_DARK_MODE): void`

设置 Waline 主题。

```typescript
import { setWalineTheme, DARK_MODE } from '@/utils/waline-theme-manager';

setWalineTheme(DARK_MODE);
```

#### `toggleWalineTheme(): void`

切换 Waline 主题。

```typescript
import { toggleWalineTheme } from '@/utils/waline-theme-manager';

toggleWalineTheme();
```

#### `isWalineDarkMode(): boolean`

检查当前是否为暗色模式。

```typescript
import { isWalineDarkMode } from '@/utils/waline-theme-manager';

if (isWalineDarkMode()) {
  console.log('当前是暗色模式');
}
```

#### `getWalineThemeStatus(): ThemeStatus`

获取主题状态信息。

```typescript
import { getWalineThemeStatus } from '@/utils/waline-theme-manager';

const status = getWalineThemeStatus();
console.log(status);
// {
//   currentTheme: 'LIGHT_MODE',
//   resolvedTheme: 'light',
//   isDark: false,
//   isSystem: false
// }
```

#### `onWalineThemeChange(listener: (theme: string) => void): () => void`

监听主题变化事件。

```typescript
import { onWalineThemeChange } from '@/utils/waline-theme-manager';

const unsubscribe = onWalineThemeChange((theme) => {
  console.log('主题已切换到:', theme);
});

// 取消监听
unsubscribe();
```

## 自定义样式

### 覆盖默认样式

如果你想自定义 Waline 的样式，可以在你的 CSS 文件中覆盖相应的变量：

```css
/* 自定义主题色 */
:root:not(.dark) #waline {
  --waline-theme-color: #FF6B6B;
  --waline-active-color: #FF8E8E;
}

/* 自定义暗色主题 */
:root.dark #waline {
  --waline-theme-color: #FF6B6B;
  --waline-active-color: #FF8E8E;
}
```

### 自定义组件样式

```css
/* 自定义评论卡片 */
#waline .wl-card {
  border-radius: 20px;
  padding: 24px;
}

/* 自定义按钮 */
#waline .wl-btn {
  border-radius: 12px;
  font-weight: 700;
}
```

## 平台优化

主题系统已经针对不同平台进行了优化：

### iOS Safari
- 优化了触摸反馈
- 禁用了高亮颜色
- 改进了滚动体验

### Android Chrome
- 优化了触摸目标大小
- 改进了触摸反馈
- 优化了滚动性能

### Desktop
- 优化了鼠标悬停效果
- 改进了键盘导航
- 优化了动画性能

### Firefox
- 优化了滚动条样式
- 改进了表单控件样式

## 无障碍支持

主题系统遵循 WCAG 2.1 AA 标准：

- ✅ 文本对比度 ≥ 4.5:1
- ✅ 键盘导航支持
- ✅ ARIA 标签
- ✅ 焦点指示器
- ✅ 屏幕阅读器支持

## 性能优化

- 使用 CSS 变量实现主题切换
- GPU 加速的动画
- 减少重绘和回流
- 懒加载和代码分割
- 响应式图片优化

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- Opera: ✅ 完全支持
- IE 11: ❌ 不支持

## 故障排除

### 主题不切换

1. 检查是否正确初始化了主题管理器
2. 检查 Waline 实例是否正确设置
3. 检查控制台是否有错误信息

### 样式不生效

1. 确保 `waline-theme.css` 已正确导入
2. 检查 CSS 变量是否正确定义
3. 检查是否有样式冲突

### 动画卡顿

1. 检查是否启用了 `prefers-reduced-motion`
2. 减少动画复杂度
3. 优化 CSS 选择器

## 最佳实践

1. **保持一致性**: 确保 Waline 主题与应用整体主题保持一致
2. **测试多平台**: 在不同设备和浏览器上测试主题切换
3. **优化性能**: 使用 CSS 变量和 GPU 加速
4. **无障碍优先**: 确保符合 WCAG 标准
5. **渐进增强**: 为不支持的功能提供降级方案

## 更新日志

### v1.0.0 (2024-02-07)
- ✨ 初始版本发布
- 🌓 完整的亮色/暗色主题支持
- 🔄 自动跟随系统主题
- 📱 跨平台兼容性优化
- ♿ WCAG 无障碍支持
- ⚡ 平滑的主题过渡动画

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
