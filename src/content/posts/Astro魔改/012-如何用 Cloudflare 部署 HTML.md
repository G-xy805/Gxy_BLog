---
title: WAC | 如何白嫖 Cloudflare 部署 HTML？
description: Cloudflare 部署 HTML
published: 2025-12-30
image: "https://zayck-img.pages.dev/file/网站/1767181162327_BandiView_im1age.webp"
tags: [博客, 网站, HTML, Cloudflare]
category: 网站实战
---


兄弟们，之前不是做了几个 HTML 文件吗？特别是这个博客网站，就想部署到 Cloudflare 上面。

没想到啊，兄弟们，直接上传这个 HTML 是不行的，把名字改成`index.html`也不成。

这个在 B站好像没有人提出来，后来我摸索出了两种方法。


  <iframe  src="//player.bilibili.com/player.html?bvid=BV1tXiTBoEa5&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>


## 一、上传 github 再部署

![640.png](https://zayck-img.pages.dev/file/网站/1767180898828_640.png)

直接上传 HTML 不是不行吗？

我上传到 github，然后再用 Cloudflare 部署，没想到这次就行了。

## 二、增加 _headers 文件

![640.png](https://zayck-img.pages.dev/file/网站/1767180896579_640.png)

用 Cloudflare 部署的时候，选择上传文件夹，文件夹里除了原本的`index.html`，还要另外加上一个 `_headers` 文件。

新建一个`TXT`文件，里面增加以下内容——

```
/*
  Content-Type: text/html; charset=UTF-8
```

然后把这个 TXT 文件重命名为`_headers`，最后把这个文件夹直接部署就 OK 了。

好了，兄弟们，快去试试吧！

---


文档地址：https://mp.weixin.qq.com/s/eEZsPzRfSlomRwWUE7yKuA