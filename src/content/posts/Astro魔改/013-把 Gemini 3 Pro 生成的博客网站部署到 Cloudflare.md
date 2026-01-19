---
title: WAC | 把 Gemini 3 Pro 生成的博客网站部署到 Cloudflare
description: Cloudflare 部署 Gemini 3 Pro 生成的博客网站
published: 2025-12-31
image: "https://zayck-img.pages.dev/file/网站/1767143606908_image.jpeg"
tags: [博客, 网站, Gemini, Cloudflare]
category: 网站实战
---


兄弟们，上次不是把一个博客网站整成一个 HTML 文件吗？只是这个网站不是传统的博客模板，更像是一个作品集。

然后呢，我就魔改了一下。兄弟们，这次是真的可以变成博客了，先来看下效果吧。


  <iframe  src="//player.bilibili.com/player.html?bvid=BV1zbvdBCEeM&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

## 博客魔改

样式是参照我的 Kael 博客主题来改的，几乎一模一样了。

我把这个`articles`功能独立出来，里面的每一个文件夹就是一个`分类`，文件夹里面的`.md`文件自动归属于相对应的`分类`。

实现了**动态监测**文件夹和文件变更，只需要在文章的`yaml`区写上对应的信息——

```
---
title: 青囊 | 辨治别论
Date: 2023-06-14
image: https://zayck-img.pages.dev/file/青囊/1765228331536_幻灯片5.jpg
tags:
  - 中医
  - 辨证
---
```

不过现在的这个文章功能还是有欠缺的，我魔改到这里的时候，发现这个`目录`不能实现`悬浮固定效果`。

![640.webp](https://zayck-img.pages.dev/file/网站/1767482519109_640.webp)

你看我的博客，是可以在看文章的时候，随着页面的下拉，目录是跟随固定的。

我在这个网站试了好几次都不成功，就放弃了。

这个仓库已经开源了，地址我会放到简介和评论区，看看有没有大佬出手优化一下。


## GitHub Actions 部署

你 Fork 我的仓库之后，可以下载修改再上传，这里的步骤我就不详细介绍了，参考之前的《手把手 9 分钟带你 0 成本部署个人博客网站》，里面有很详细的步骤了。

那上传之后，怎么部署呢？

![640.webp](https://zayck-img.pages.dev/file/网站/1767482519219_640.webp)

进入你的仓库，然后点击`Settings`，找到左侧边栏的`Pages`，把`Build and deployment`的`Source`选成`GitHub Actions`，接着等待一会就部署成功了。


## Cloudflare 部署

然后呢，这个博客怎么部署到 Cloudflare 上呢？

我看了一下，原作者只是部署到 github 上，用的 GitHub Actions 来部署的，并没有用 Cloudflare 来部署。

![640.webp](https://zayck-img.pages.dev/file/网站/1767482522382_640.webp)

相对来说，用 GitHub Actions 国内是比较难访问的。

如果想部署到 Cloudflare 上面，需要修改根目录下的 `vite.config.ts`。

把原来的`base`配置修改——

```
base: '/',
```

接着，还是老样子，用 Cloudflare Pages 来部署。

这里的`Framework preset`选`React(Vite)`，下面这些不用管，它会自动填写，最后点击`Save and Deploy`，等一会你的个人博客网站就上线啦！！！。

![640.webp](https://zayck-img.pages.dev/file/网站/1767482524235_640.webp)

然后呢，兄弟们，我就发现 GitHub Actions 部署失败了！

这是咋个回事呢？

后来我发现，如果我想成功部署到 GitHub Actions 呢？

又需要把`base`配置修改成下面的——

```
base: '/LuN3cy/', 
```

总而言之，言而总之，就是能部署 GitHub Actions 就不能部署 Cloudflare；能部署 Cloudflare 就不能部署 GitHub Actions。

这不是耍我吗？

后面我就问 AI，兄弟们，还得是 AI 有用啊。

> 实现动态base路径配置。可以通过环境变量来区分不同部署环境，让构建时自动选择正确的base值。


总之，改了3个文件，现在就是能同时部署 GitHub Actions 和 Cloudflare 了。


---



仓库地址：https://github.com/zayck/LuN3cy

体验网址：https://zayck-blog.pages.dev

文档地址：https://mp.weixin.qq.com/s/FeGIWNhQdSlIeZq_ZqISXA