# LiteLoaderQQNT-Markdown

## Introduction

这是一个 [LiteLoaderQQNT](https://github.com/mo-jinran/LiteLoaderQQNT) 插件，使用 [Markdown-it](https://github.com/markdown-it/markdown-it) 为 QQnt 增加 Markdown 和 $\LaTeX$​ 渲染功能！

> [!NOTE]
> 此插件最低支持 LiteLoaderQQNT 1.0.0，并且依赖[LLAPI](https://github.com/Night-stars-1/LiteLoaderQQNT-Plugin-LLAPI/tree/main)插件。

## Features

- 标准 Markdown 语法；
- 基于 $KaTeX$ 的公式渲染；
- 基于 `pangu.js` 的中英文混排优化；
- 黑/白名单设置功能，针对窗口设置是否需要启用渲染功能；

## Demo 

 1. Markdown基础语法/公式渲染：

<img src="https://raw.githubusercontent.com/CJReinforce/LiteLoaderQQNT-Markdown/v4/imgs/1.png" width="71%" style="zoom: 50%;"> <img src="https://raw.githubusercontent.com/CJReinforce/LiteLoaderQQNT-Markdown/v4/imgs/2.png" width="21%">

2. 黑/白名单设置

<img src="https://raw.githubusercontent.com/CJReinforce/LiteLoaderQQNT-Markdown/v4/imgs/4.png" alt="Black/WhiteList" style="zoom:45%;" /><img src="https://raw.githubusercontent.com/CJReinforce/LiteLoaderQQNT-Markdown/v4/imgs/3.png" alt="Black/WhiteList" style="zoom:45%;" />

## Tips

- 需要先安装[LLAPI插件](https://github.com/Night-stars-1/LiteLoaderQQNT-Plugin-LLAPI/tree/main)。
- 本插件正处于测试阶段，若无法使用请积极发 issue，发 issue 时带上系统版本，插件列表和 LiteLoaderQQNT 设置中所示的版本信息。
- 该插件无须`npm install`，所有依赖已经通过`bpkg`打包内置，`package.json`只是便于开发。
