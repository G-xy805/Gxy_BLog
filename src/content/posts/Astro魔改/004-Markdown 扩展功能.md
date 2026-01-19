---
title: Astro | Markdown 扩展功能
published: 2025-12-06
description: 了解 Kael 中的 Markdown 功能
image: https://zayck-img.pages.dev/file/玄黄/1766372767056_xh.webp
tags: [博客, Markdown, Astro]
category: Astro魔改
---

## GitHub 仓库卡片

::github{repo="zayck/kael"}


```markdown
::github{repo="zayck/kael"}
```

## 提醒框

支持以下类型的提醒框：`note` `tip` `important` `warning` `caution`，支持`基本语法`和 `GitHub 语法`。

:::note
突出显示用户应该考虑的信息，即使在快速浏览时也是如此。
:::

```markdown
:::note
突出显示用户应该考虑的信息，即使在快速浏览时也是如此。
:::
```

```
> [!NOTE]
> 突出显示用户应该考虑的信息，即使在快速浏览时也是如此。
```

---

:::tip
可选信息，帮助用户更成功。
:::


```markdown
:::tip
可选信息，帮助用户更成功。
:::
```

```
> [!TIP]
> 可选信息，帮助用户更成功。
```

---

:::important
用户成功所必需的关键信息。
:::

```markdown
:::important
用户成功所必需的关键信息。
:::
```

```
> [!IMPORTANT]
> 用户成功所必需的关键信息。
```

---

:::warning
由于潜在风险需要用户立即注意的关键内容。
:::

```markdown
:::warning
由于潜在风险需要用户立即注意的关键内容。
:::
```

```
> [!WARNING]
> 由于潜在风险需要用户立即注意的关键内容。
```

---

:::caution
行动的负面潜在后果。
:::

```markdown
:::caution
行动的负面潜在后果。
:::
```

```
> [!CAUTION]
> 行动的负面潜在后果。
```


## 文字隐藏

内容 :spoiler[被隐藏了 **哈哈**]！

```markdown
内容 :spoiler[被隐藏了 **哈哈**]！
