---
title: DeepSeek Harness 架构深度解析
layout: post
date: 2026-08-13
permalink: /posts/deepseek-harness-analysis/
categories: [Blogging, AI]
tags: [DeepSeek, Agent, Architecture, OpenSource, learn-art]
---

> 本文是一篇使用 [learn-art](https://github.com/deepseek-ai/deepseek-harness) 生成的深度解析报告，完整 HTML 版本（含 Mermaid 架构图、代码+大白话双栏对照、TOC 侧边栏）请访问：
>
> **[DeepSeek Harness · learn-art 解析报告（完整 HTML）]({{ site.url }}/sharing/deepseek-harness.html)**

## 什么是 DeepSeek Harness

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）是由 DeepSeek AI 开发的开源 AI Agent 运行时框架。它的核心设计理念是 **"一切皆插件"**——基于 [Cordis](https://github.com/cordiverse/cordis) 框架，将模型适配器、工具注册表、会话日志、Agent 循环等所有组件都实现为可替换的插件，通过声明式 YAML 配置组装出完整的 Agent。

## 报告涵盖的 9 个章节

1. **一句话理解**：dsh 是什么
2. **项目卡片**：版本、许可证、技术栈、仓库地址等元信息
3. **为什么存在**：5 条核心痛点 + 4 个现有方案评述 + 本项目切入点
4. **架构/模块拆解**：全局架构 Mermaid 图 + 逐模块展开（核心包层 + 能力包层 + 组装层）
5. **核心抽象逐条解析**：7 个关键概念（能力接缝、事件溯源日志、Turn/Step 循环、工具执行管道、可逆注册、事件分发四模式、Profile/Bundle 组合）
6. **关键代码 + 大白话**：6 组代码对照（三相位状态机、Session 事件追加、工具并行调度、Waterfall 事件分发、提示词组装、BlockAssembler）
7. **端到端流程**：完整 Mermaid 时序图，追踪用户消息到工具结果返回的全链路
8. **心智模型**：3 个类比（乐高底板、会计账本、餐厅厨房）
9. **延伸阅读 / 文件索引**：35+ 关键文件路径和职责表

## 核心发现

- **一切皆插件**：Agent 循环本身也是可替换的插件，没有特权核心
- **事件溯源会话日志**：LLM 消息历史从日志派生，永不单独存储；"模型可见即已记录"是运行时不变量
- **能力接缝三角色分离**：Service Definition / Provider / Consumer 让 Provider 自由替换而不影响 Consumer
- **工具执行管道五阶段**：pre-execute → guards → execute → post-execute → finalize，将策略与实现解耦
- **Profile/Bundle 组合系统**：Agent 能力组合从代码提升为声明式 YAML 配置

## 如何阅读

推荐直接打开 [完整 HTML 报告]({{ site.url }}/sharing/deepseek-harness.html)，它包含：

- 左侧 TOC 侧边栏 + 滚动联动高亮
- Mermaid 架构图和时序图
- 代码 + 大白话双栏对照
- 离线可读（仅 Mermaid/highlight.js 走 CDN）
