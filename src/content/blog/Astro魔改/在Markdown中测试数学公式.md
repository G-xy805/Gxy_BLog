---
title: 在Markdown中测试数学公式
description: 使用 LaTeX 在 Markdown 中渲染的各种数学公式的演示
pubDate: 2025-12-06
image: "/image/be0cf6.jpeg"
categories:
  - Astro魔改
tags:
  - Markdown
  - Astro
  - 博客
  - LaTeX
---

本文档用于测试在 Markdown 中使用 `$$` 符号渲染数学公式。

## 基础代数

让我们从一些基本的代数表达式开始。

二次方程的求根公式为:
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

一个简单的线性方程:
$$y = mx + c$$

二项式平方的展开:
$$(a+b)^2 = a^2 + 2ab + b^2$$

---

## 微积分

Here are some common expressions from calculus.

The limit definition of a derivative:
$$f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

A definite integral:
$$\int_{a}^{b} f(x) dx$$

The Taylor series expansion of $e^x$ around $x=0$:
$$e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots$$

---

## 三角函数

Some basic trigonometric identities.

Pythagorean identity:
$$\sin^2\theta + \cos^2\theta = 1$$

Angle addition formula for sine:
$$\sin(\alpha + \beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$$

Euler's formula:
$$e^{i\theta} = \cos\theta + i\sin\theta$$

---

## 统计和概率

Formulas commonly used in statistics and probability.

The formula for the mean ($\mu$) of a set of $n$ numbers $x_1, x_2, \ldots, x_n$:
$$\mu = \frac{1}{n} \sum_{i=1}^{n} x_i$$

The probability density function of a normal distribution:
$$f(x | \mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$

Bayes' theorem:
$$P(A|B) = \frac{P(B|A)P(A)}{P(B)}$$

---

## 线性代数

Examples from linear algebra.

A 2x2 matrix:
$$A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$$

The determinant of a 2x2 matrix:
$$\det(A) = ad - bc$$

Matrix multiplication of two matrices A and B:
$$C = AB$$

---

## 物理学

A couple of well-known physics equations.

Einstein's mass-energy equivalence:
$$E = mc^2$$

Newton's second law of motion:
$$F = ma$$

This should provide a good test of how various mathematical formulas are rendered.
