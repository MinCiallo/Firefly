# 内容功能使用说明

本次将 CuteLeaf/Firefly 上游的文章系列、项目展示、MDX 组件、Wiki Link 和 LQIP 方案适配到本博客，保留 Astro 6 与现有网址。

上游参考版本：994c0b8da0cb63f7a6190b4da88ecb08446575c4。
来源：https://github.com/CuteLeaf/Firefly

## 文章系列

在文章 frontmatter 增加：

```yaml
series: Linux 游戏服务器部署
seriesOrder: 1
```

同名文章自动归为一个系列，按 seriesOrder 从小到大排列；未设置序号的文章排在最后。生产构建不包含草稿。文章顶部显示可展开的系列目录，导航栏“系列”入口查看全部系列。

现有服务器教程与 Galgame 感想已分别分组，不改变原文章 URL。

## 项目展示

在 src/content/projects 新建 Markdown 或 MDX 文件。项目页入口为 /projects/，可搜索、按状态筛选。

```yaml
---
title: 项目名称
published: 2026-11-07
description: 一句话简介
status: developing
tags: [Astro]
order: 1
image: ../../assets/images/cover.avif
draft: false
link:
  - label: GitHub
    icon: fa7-brands:github
    value: https://github.com/MinCiallo/Firefly
---
```

状态支持 planning、developing、published、archived，也可填写自定义文字。order 越大越靠前；未设置时按发布日期排序。pages.projects 控制项目页开关。

## MDX 组件

在 .mdx 文件导入：

```jsx
import { Badge, Steps, StepItem, Timeline, TimelineItem, TabGroup } from "@/components/firefly-mdx";

<Badge type="tip">推荐</Badge>

<Steps>
  <StepItem title="安装依赖">运行 pnpm install。</StepItem>
  <StepItem title="启动开发服务器" icon="rocket">运行 pnpm dev。</StepItem>
</Steps>

<Timeline>
  <TimelineItem date="2026-05-31" title="博客上线">记录一个里程碑。</TimelineItem>
</Timeline>
```

TabGroup 使用 labels 数组和 client:load，每个直接子块对应一个标签；代码块之间留空行。键盘左右方向键、Home、End 可切换标签。实际展示见 /projects/blog/。

## Wiki Link

- 行内：阅读 [[2026-9-20-1|模组介绍]]。
- 独立成段：[[2026-9-20-1]] 会生成文章卡片。
- 带锚点：[[2026-9-20-1#环境要求|运行环境]]。
- 支持 frontmatter slug、完整文件路径、唯一的裸文件名；链接始终使用文章实际 ID。
- 找不到目标时保留原文字，不生成猜测地址；代码块和图片嵌入语法不转换。
- 加密文章只引用已公开的标题与描述，不读取正文；生产环境不引用草稿。

## 图片渐变占位

构建时自动为本地图片生成三色渐变与宽高信息，应用到封面、头像、相册和 Markdown 图片。图片失败时保留现有回退机制；无 JavaScript 时图片仍可见；尊重“减少动态效果”设置。

pnpm lqips 手动更新图片数据。pnpm dev、pnpm start 和 pnpm build 都会生成占位数据。
缓存位于 .astro/lqip-cache.json，图片更换或删除后会更新；public/pio 等模型资源不扫描。远程图片使用中性渐变，不增加额外网络下载。

## 验证

```sh
node --test tests/upstream-fixes.test.mjs
node --import tsx --test tests/content-features.test.mjs
pnpm build
```
