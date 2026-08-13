---
title: DeepSeek Harness 架构深度解析
layout: post
date: 2026-08-13
permalink: /posts/deepseek-harness-analysis/
categories: [Blogging, AI]
tags: [DeepSeek, Agent, Architecture, OpenSource, learn-art]
mermaid: true
---

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-light.min.css">
<style>
.learn-art-report{--la-ink:#1a1c2c;--la-ink-2:#3b3f5c;--la-ink-3:#6c7395;--la-paper-2:#f3efe5;--la-line:#e6dfcd;--la-accent:#d96f3a;--la-accent-2:#7c5cff;--la-good:#3a8f5d;--la-err:#b03a48;--la-radius:14px;--la-mono:'JetBrains Mono',SFMono-Regular,Menlo,Consolas,monospace}
.learn-art-report .la-badge{display:inline-block;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--la-accent);background:rgba(217,111,58,.08);padding:4px 10px;border-radius:999px;margin-bottom:14px}
.learn-art-report .la-subtitle{font-size:17px;color:var(--la-ink-2);margin:0 0 32px;line-height:1.6}
.learn-art-report section{margin:0 0 48px;scroll-margin-top:24px}
.learn-art-report section h2{font-size:24px;font-weight:700;margin:0 0 20px;padding-bottom:8px;border-bottom:1px solid var(--la-line);display:flex;align-items:baseline;gap:14px}
.learn-art-report section h2 .num{font-family:var(--la-mono);font-size:13px;color:var(--la-accent);background:rgba(217,111,58,.08);padding:3px 9px;border-radius:6px;font-weight:500}
.learn-art-report section h3{font-size:18px;font-weight:500;margin:28px 0 10px;color:var(--la-ink)}
.learn-art-report section p{margin:0 0 14px}
.learn-art-report section ul,.learn-art-report section ol{padding-left:22px;margin:0 0 16px}
.learn-art-report section li{margin:6px 0}
.learn-art-report table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14.5px}
.learn-art-report th,.learn-art-report td{padding:10px 12px;text-align:left;vertical-align:top;border-bottom:1px solid var(--la-line)}
.learn-art-report th{background:var(--la-paper-2);font-weight:500;color:var(--la-ink-2);font-size:13px;letter-spacing:.02em}
.learn-art-report tr:hover td{background:rgba(217,111,58,.03)}
.learn-art-report pre,.learn-art-report code{font-family:var(--la-mono)}
.learn-art-report :not(pre)>code{background:var(--la-paper-2);padding:2px 6px;border-radius:4px;font-size:13.5px;color:var(--la-ink)}
.learn-art-report pre{margin:14px 0;padding:18px 20px;background:#fdfcf7;border:1px solid var(--la-line);border-radius:var(--la-radius);overflow:auto;font-size:13.5px;line-height:1.6}
.learn-art-report pre code{background:transparent;padding:0;font-size:inherit;color:var(--la-ink)}
.learn-art-report .code-pair{display:grid;grid-template-columns:1.05fr 1fr;gap:16px;margin:18px 0}
.learn-art-report .code-pair pre{margin:0}
.learn-art-report .code-pair .explain{background:rgba(124,92,255,.045);border:1px solid rgba(124,92,255,.18);border-radius:var(--la-radius);padding:16px 18px;font-size:14.5px;line-height:1.7;color:var(--la-ink-2);position:relative}
.learn-art-report .code-pair .explain::before{content:'大白话';display:inline-block;font-size:11px;letter-spacing:.12em;color:var(--la-accent-2);font-weight:500;background:#fff;padding:2px 8px;border-radius:999px;margin-bottom:10px}
.learn-art-report .code-pair .explain p{margin:0 0 8px}
.learn-art-report .code-pair .explain p:last-child{margin:0}
@media (max-width:900px){.learn-art-report .code-pair{grid-template-columns:1fr}}
.learn-art-report .mermaid{margin:20px 0;padding:22px;text-align:center;background:#fdfcf7;border:1px solid var(--la-line);border-radius:var(--la-radius)}
.learn-art-report .la-footer{margin-top:48px;padding-top:24px;border-top:1px solid var(--la-line);color:var(--la-ink-3);font-size:13px;line-height:1.7}
.learn-art-report .la-footer a{color:var(--la-ink-3)}
</style>

<div class="learn-art-report">

<span class="la-badge">learn-art · 研究报告</span>
<p class="la-subtitle">一个基于 Cordis 框架的"一切皆插件"AI Agent 运行时——模型适配、工具注册、会话日志、Agent 循环本身都是可替换的插件。</p>

<section id="sec-1">
<h2><span class="num">01</span> 一句话理解</h2>
<p>DeepSeek Harness（<code>dsh</code>）是由 DeepSeek AI 开发的开源 AI Agent 运行时框架，核心设计理念是<strong>"一切皆插件"</strong>——基于 vendored Cordis 框架，将模型适配器、工具注册表、会话日志、Agent 循环等所有组件都实现为可替换的插件，通过声明式 YAML 配置组装出完整的 Agent。</p>
</section>

<section id="sec-2">
<h2><span class="num">02</span> 项目卡片</h2>
<table>
<tr><th>属性</th><th>值</th></tr>
<tr><td>项目名</td><td>DeepSeek Harness (<code>dsh</code>)</td></tr>
<tr><td>开发者</td><td><a href="https://deepseek.com">DeepSeek AI</a></td></tr>
<tr><td>版本</td><td>0.1.0-rc.5（开发者预览阶段）</td></tr>
<tr><td>许可证</td><td>MIT</td></tr>
<tr><td>主语言</td><td>TypeScript（ESM only，strict mode）</td></tr>
<tr><td>运行时</td><td>Node.js ^22.19 || >=24</td></tr>
<tr><td>包管理</td><td>pnpm 11.7.0（monorepo workspaces）</td></tr>
<tr><td>底层框架</td><td>Cordis（vendored，源自 <a href="https://github.com/cordiverse/cordis">cordiverse/cordis</a>）</td></tr>
<tr><td>仓库地址</td><td><a href="https://github.com/deepseek-ai/deepseek-harness">github.com/deepseek-ai/deepseek-harness</a></td></tr>
<tr><td>源码文件数</td><td>~1247 个 TypeScript 源文件（不含测试/node_modules）</td></tr>
<tr><td>包数量</td><td>~50+ 个 <code>@deepseek-ai/dsh-*</code> 工作区包</td></tr>
<tr><td>示例配置</td><td>15 个 <code>cordis.yml</code> 可运行组合</td></tr>
<tr><td>Web UI</td><td>内置 VitePress 文档站 + React Web 前端</td></tr>
<tr><td>Python SDK</td><td>内置 Python SDK 和 bundled runtime</td></tr>
<tr><td>沙箱</td><td>Landlock（Linux）+ Windows ACL restricted-token</td></tr>
<tr><td>设计论文</td><td><a href="https://github.com/cordiverse/paper">A Programming Paradigm for Spatiotemporal Composability</a></td></tr>
</table>
</section>

<section id="sec-3">
<h2><span class="num">03</span> 为什么存在</h2>

<h3>核心痛点</h3>

<p><strong>痛点 1：Agent 循环与能力硬耦合</strong> → 传统 Agent 框架将模型调用、工具执行、会话管理写死在核心代码中，添加新模型提供商或新工具类型需要修改框架本身 → <strong>严重程度：高</strong>。例如 Claude Code 的 Agent 循环与 Anthropic API 深度绑定，无法替换为 DeepSeek 模型而不 fork 整个代码库。</p>

<p><strong>痛点 2：会话状态不可靠</strong> → 多数框架将对话历史存在简单数组中，模型可见的内容与持久化内容脱节，崩溃恢复时丢失上下文 → <strong>严重程度：高</strong>。Agent 执行长任务时（如代码重构），中途崩溃意味着从头开始。</p>

<p><strong>痛点 3：工具执行缺乏策略层</strong> → 工具调用通常只有"执行/不执行"两个选项，缺乏审批、沙箱、超时、重试等策略维度，也无法在执行前后注入自定义逻辑 → <strong>严重程度：中</strong>。例如文件写入工具无法按路径做细粒度权限控制。</p>

<p><strong>痛点 4：子 Agent 编排困难</strong> → 将任务委派给子 Agent 需要处理进程隔离、上下文传递、结果回收等底层细节，且不同委派策略（同进程 fork vs 跨进程 spawn vs 跨产品委托）缺乏统一接口 → <strong>严重程度：中</strong>。</p>

<p><strong>痛点 5：配置与代码边界模糊</strong> → Agent 的能力组合（用哪些工具、哪个模型、什么权限策略）散落在代码各处，无法通过配置文件声明式地组合出不同形态的 Agent → <strong>严重程度：高</strong>。</p>

<h3>现有方案盘点</h3>

<p><strong>方案 1：LangChain / LangGraph</strong> → 通过链式调用和图结构组合 LLM + 工具 → <strong>不够的地方</strong>：链式组合是代码级的，运行时不可重组；会话状态是附加层而非核心设计；工具执行没有内建的策略管道 → 例子：LangChain 的 AgentExecutor 需要手写 retry/timeout 逻辑。</p>

<p><strong>方案 2：Claude Code / Codex CLI</strong> → 将 Agent 循环、工具、模型 API 打包为一体化产品 → <strong>不够的地方</strong>：模型适配器、工具注册表、执行策略都写死在产品代码中，用户无法替换任一组件；没有公开的插件扩展机制 → 例子：无法将 Claude Code 的工具管道接到 DeepSeek API。</p>

<p><strong>方案 3：AutoGen / CrewAI</strong> → 多 Agent 协作框架，强调角色分工和消息传递 → <strong>不够的地方</strong>：缺少底层 Agent 运行时的抽象（会话日志、工具管道、能力接缝），Agent 之间的协作缺乏可审计的持久化记录 → 例子：AutoGen 的对话历史是 Python 列表，不是事件溯源日志。</p>

<p><strong>方案 4：OpenAI Assistants API</strong> → 托管式 Agent 服务，提供线程、工具、模型一体化 API → <strong>不够的地方</strong>：完全依赖 OpenAI 基础设施，无法本地部署或自定义执行策略；工具执行在服务端黑箱运行 → 例子：无法为文件写入工具添加自定义审批流程。</p>

<h3>本项目的切入点</h3>

<p>DeepSeek Harness 选择了<strong>"插件化架构 + 能力接缝"</strong>的角度来突破。核心洞察是：Agent 运行时的每个组件——模型适配器、工具注册表、会话日志、Agent 循环、文件系统、子进程、子 Agent——都可以定义为具有三个角色（Service Definition / Provider / Consumer）的"能力接缝"。只要接缝定义清晰，Provider 可以自由替换而不影响 Consumer。</p>

<p>这个角度有效的原因是：它将"可替换性"从设计原则下沉为架构骨架。Cordis 框架提供了服务注册、依赖注入、类型化事件、可逆注册四原语，dsh 在此之上构建了完整的能力接缝体系。结果是：换一个 <code>ctx.fs</code> Provider 从本地文件系统切到 E2B 沙箱，Bash、PTY、LSP 工具全部自动跟随迁移，零代码改动。</p>

<h3>设计哲学/原则</h3>

<ul>
<li><strong>一切皆插件</strong>：没有特权核心，Agent 循环本身也是一个插件，可以通过配置替换。</li>
<li><strong>注册即副作用</strong>：所有贡献（工具注册、提示词段落、事件监听器）通过 <code>ctx.effect()</code> / <code>ctx.on()</code> 安装，卸载时自动回滚。</li>
<li><strong>模型可见即已记录</strong>：任何到达模型请求的内容必须可从会话日志重建，运行时不变量会断言这一点。</li>
<li><strong>显式优于隐式</strong>：在包边界处，默认值是显式的 <code>resolve(request): Spec</code> 步骤，不是 <code>run()</code> 内部的 <code>?? default</code>。</li>
<li><strong>误配置立即报错</strong>：在加载时自包含地失败，否则在最早可解析点失败，绝不静默跳过缺失的引用。</li>
<li><strong>信任 TypeScript</strong>：在同进程的类型化边界处不加运行时校验；只在解析器/配置、队列、模型/工具 JSON、持久化/文件、worker、进程、网络边界处做校验。</li>
</ul>
</section>

<section id="sec-4">
<h2><span class="num">04</span> 架构/模块拆解</h2>

<p>DeepSeek Harness 是一个 pnpm monorepo，包含 ~50+ 个 <code>@deepseek-ai/dsh-*</code> 包。整体架构分为四层：vendored Cordis 框架层 → 核心包层（core/） → 能力包层（llm/shell/fs/...） → 组装层（bundle/app）。以下架构图展示全局模块关系。</p>

<div class="mermaid">
flowchart TB
  subgraph CLI["CLI 入口层"]
    APP[apps/cli<br/>dsh 命令行]
    BOOT[boot/app-boot<br/>启动组装]
  end
  subgraph Bundle["组装层"]
    BASE[dsh-base<br/>基础 bundle]
    WEB[dsh-web-app<br/>Web UI bundle]
    HEAD[dsh-headless<br/>无头 bundle]
  end
  subgraph Core["核心包层 packages/core/"]
    SESSION[session<br/>事件溯源会话日志]
    SYSPROMPT[system-prompt<br/>提示词组装]
    TOOLS[tools<br/>工具注册表+执行管道]
    AGENT[agent<br/>Agent 接口+注册表]
    LOOP[agent-loop<br/>具体驱动实现]
    SCOPE[scope<br/>每 Agent 作用域]
  end
  subgraph Cap["能力包层"]
    LLM[llm<br/>模型适配器]
    SHELL[shell<br/>Shell 能力]
    FS[fs<br/>文件系统能力]
    SUBPROC[subprocess<br/>子进程能力]
    WEB_CAP[web<br/>Web 搜索/抓取]
    SUBAGENT[subagent<br/>子 Agent 能力]
    SANDBOX[sandbox<br/>沙箱隔离]
    COMPACT[compaction<br/>上下文压缩]
  end
  subgraph Vendor["vendored Cordis 框架"]
    CORDIS["@deepseek-ai/cordis<br/>插件框架"]
  end
  APP --> BOOT
  BOOT --> BASE
  BASE --> WEB
  BASE --> HEAD
  BASE --> Core
  Core --> Cap
  Core --> CORDIS
  Cap --> CORDIS
</div>

<h3>4.1 核心包层（packages/core/）——产品 API 脊柱</h3>

<p><strong>session（<code>@deepseek-ai/dsh-session</code>）</strong> — 职责：维护 append-only 的 <code>SessionEvent</code> 日志和内存存储。对外接口：<code>ctx.sessions</code>（<code>SessionStore</code> 服务，提供 create/resume/fork/flush）。依赖：scope 库。内部结构：<code>Session</code> 类（事件追加+派生）+ <code>SurfaceManager</code>（消息表面投影）+ <code>SessionStore</code> 服务（生命周期管理）。设计决策：采用事件溯源模式——LLM 消息历史从日志派生（<code>deriveMessages()</code>），永不单独存储；所有事件 deepFreeze 后不可变；<code>SessionEventMap</code> 通过 declaration merging 支持插件扩展事件类型。</p>

<p><strong>system-prompt（<code>@deepseek-ai/dsh-system-prompt</code>）</strong> — 职责：提示词段落和工具 schema 的组装。对外接口：<code>ctx.systemPrompt</code>（<code>SystemPrompt</code> 服务）。依赖：scope 库、tools 服务（收集工具 schema）。内部结构：<code>ScopedLayers</code> 管理全局+作用域段落/上下文/变量，<code>assemble()</code> 方法执行组装管道。设计决策：段落有数值 <code>order</code> 字段排序；<code>{{variable}}</code> 插值在遇到未知变量时 fail-loud；<code>complete</code> 段落可覆盖整个提示词；<code>system-prompt/assemble</code> waterfall 允许插件在组装后变换。</p>

<p><strong>tools（<code>@deepseek-ai/dsh-tools</code>）</strong> — 职责：作用域工具注册表和带守卫的执行管道。对外接口：<code>ctx.tools</code>（<code>ToolRuntime</code> 服务）。依赖：scope 库、session（记录工具事件）。内部结构：<code>ScopedLayers</code> 管理工具注册（作用域覆盖全局），五阶段执行管道（pre-execute → guards → execute → post-execute → finalize），<code>TOOL_RUNTIME_SCHEDULER</code> 分阶段调度器接口。设计决策：工具声明 <code>output.schema</code> 和 <code>output.render</code>；<code>ToolGuard</code> 是单调的（只能 deny，不能 allow）；<code>ToolExecutionMode</code> 区分 parallel/exclusive 控制并发；Code Mode（<code>run_code</code>）作为传输层让模型通过 SDK 调用工具。</p>

<p><strong>agent（<code>@deepseek-ai/dsh-agent</code>）</strong> — 职责：<code>Agent</code> 接口定义、活跃 Agent 注册表、发起者作用域。对外接口：<code>ctx.agents</code>（<code>AgentRegistry</code> 服务）。依赖：session。内部结构：<code>Agent</code> 接口（send/followup/steer/inject/cancel/whenIdle）+ <code>Inbox</code> 类（待处理消息投影）+ <code>AgentEventDispatch</code>（融合分发器）+ <code>AsyncLocalStorage</code> 发起者追踪。设计决策：Agent 状态只有 <code>idle</code> / <code>running</code>；<code>Inbox</code> 从 <code>agent/inbox/spliced</code> 事件派生；扩展插件依赖 <code>agent</code> 而非 <code>agent-loop</code>，保持循环可替换。</p>

<p><strong>agent-loop（<code>@deepseek-ai/dsh-agent-loop</code>）</strong> — 职责：<code>Agent</code> 接口的具体实现。对外接口：<code>ctx.agentLoop</code>（<code>AgentLoop</code> 服务，实现 <code>AgentFactory</code>）。依赖：agent、session、system-prompt、tools、llm。内部结构：<code>ReactLoopAgent</code> 类（三相位状态机 idle/maintenance/running，turn-then-step 嵌套循环）+ <code>executeToolCalls</code> 调度器（有界并行+独占屏障）+ <code>AgentLoop</code> 工厂服务。设计决策：每个相位一个 <code>AbortController</code>；工具调用按 <code>executionMode</code> 分类——parallel 填充滚动池，exclusive 形成屏障；结果按模型顺序提交；prepare-then-publish 两阶段发布。</p>

<p><strong>scope（<code>@deepseek-ai/dsh-scope</code>）</strong> — 职责：每 Agent 的作用域注册原语。对外接口：库函数（<code>createScope</code>/<code>scopeOf</code>/<code>scopeTarget</code>），无 <code>ctx</code> key。依赖：无（零依赖库）。设计决策：作用域是两级扁平结构——global（每个 Agent）和 scoped（一个 scope key）；作用域注册不继承到子 Agent；通过 <code>ScopedLayers</code> 实现 shadow 语义（作用域覆盖全局）。</p>

<h3>4.2 能力包层——可替换的能力接缝</h3>

<p><strong>llm（<code>@deepseek-ai/dsh-llm</code>）</strong> — 职责：消息和流词汇表 + 模型适配器接缝。对外接口：<code>ctx.llm</code>（<code>LlmRuntime</code> 服务）。Provider：<code>dsh-llm-deepseek</code>（DeepSeek 官方）、<code>dsh-llm-pi-ai</code>（多模型）、<code>dsh-llm-replay</code>（回放）。Consumer：agent-loop、compaction。设计决策：<code>LlmAdapter</code> 抽象类只实现 <code>stream()</code>；<code>PreparedLlmCall</code> 是注册绑定的一次性调用句柄，防止 HMR 不匹配；<code>BlockAssembler</code> 是唯一的 chunk→message 组装算法；适配器异常归一化为终止 <code>error</code>/<code>aborted</code> finish chunk。</p>

<p><strong>shell（<code>@deepseek-ai/dsh-shell</code>）</strong> — 职责：Shell 执行能力。Provider：<code>dsh-bash-local</code>、<code>dsh-bash-sandbox</code>、<code>dsh-pwsh-local</code>。Consumer：<code>dsh-tool-bash</code>、hooks 桥接。设计决策：本地 bash 通过 <code>ctx.subprocess</code> 生成；沙箱 bash 包装 argv 后生成；Windows 平台仅 pwsh。</p>

<p><strong>fs（<code>@deepseek-ai/dsh-fs</code>）</strong> — 职责：文件系统能力 + 策略。Provider：<code>dsh-fs-local</code>、<code>dsh-fs-sandbox</code>、<code>dsh-fs-e2b</code>。Consumer：<code>dsh-tool-fs</code>。设计决策：<code>fs/write-intent</code> 和 <code>fs/edit-intent</code> 事件门控写入；读前编辑检查在 <code>fs/*</code> 事件层。</p>

<p><strong>subagent（<code>@deepseek-ai/dsh-subagent</code>）</strong> — 职责：子 Agent 委派能力。Provider：<code>dsh-subagent-spawn-in-process</code>、<code>dsh-subagent-fork-in-process</code>、<code>dsh-subagent-acp</code>、<code>dsh-subagent-codex</code>、<code>dsh-subagent-claude-code</code>。Consumer：<code>dsh-tool-subagent</code>、<code>dsh-tool-ralph</code>。设计决策：不同委派策略（同进程 fork vs 跨进程 spawn vs 跨产品委托）共用一个接口。</p>

<p><strong>其他能力包简述：</strong></p>
<table>
<tr><th>包名</th><th>ctx key</th><th>一句话职责</th></tr>
<tr><td>subprocess</td><td><code>ctx.subprocess</code></td><td>子进程能力 + 本地进程树 provider</td></tr>
<tr><td>terminal</td><td><code>ctx.terminals</code></td><td>持久终端会话（PTY）</td></tr>
<tr><td>web</td><td><code>ctx.web</code></td><td>Web 搜索 + 页面抓取</td></tr>
<tr><td>compaction</td><td><code>ctx.compaction</code></td><td>上下文窗口压缩</td></tr>
<tr><td>sandbox</td><td><code>ctx.sandbox</code></td><td>进程沙箱隔离</td></tr>
<tr><td>session-persistence</td><td><code>ctx.sessionPersistence</code></td><td>会话持久化（JSONL / SQLite）</td></tr>
<tr><td>approval</td><td><code>ctx.approval</code></td><td>人工审批交互</td></tr>
<tr><td>skill</td><td><code>ctx.skills</code></td><td>技能提供者注册表</td></tr>
<tr><td>workflow</td><td><code>ctx.workflowEngine</code></td><td>工作流引擎（worker-thread）</td></tr>
<tr><td>lsp</td><td><code>ctx.lsp</code></td><td>语言服务器协议能力</td></tr>
<tr><td>mcp</td><td><code>ctx.mcp</code></td><td>Model Context Protocol 桥接</td></tr>
<tr><td>todo</td><td>—</td><td>todo_write 工具</td></tr>
<tr><td>plan</td><td><code>ctx.planMode</code></td><td>计划模式（日志状态）</td></tr>
<tr><td>guard</td><td>—</td><td>循环卫生 + 工具超时插件</td></tr>
</table>

<h3>4.3 组装层——Profile 与 Bundle</h3>

<p>一个运行中的 <code>dsh</code> 是从有序层组合的插件树。<strong>Profile</strong> 是存储在 Harness home 中的命名组合，列出它堆叠的 bundle。<strong>Bundle</strong> 是 Cordis 配置行和它们挂载代码的分发格式——<code>dsh-base</code> 是每个 profile 的第一层（模型适配器、工具、持久化、沙箱、审批策略、设置、凭证、遥测），<code>dsh-web-app</code> 添加浏览器应用，<code>dsh-headless</code> 添加一次性无服务器运行器。</p>

<p>层按顺序应用到空条目列表：profile 列出的 bundle 顺序 → profile 的 <code>cordis.patch.yml</code> → home 级别的 → <code>--patch</code> 覆盖。补丁通过 id 定位行并替换其整个配置，或插入新行。</p>
</section>

<section id="sec-5">
<h2><span class="num">05</span> 核心观点/抽象逐条解析</h2>

<h3>5.1 能力接缝（Capability Seam）</h3>
<p><strong>定义</strong>：一个可替换的能力，由三个角色组成——Service Definition（声明接口，拥有 <code>ctx.&lt;key&gt;</code>）、Service Provider（实现接口）、Consumer（使用接口，通常是模型面向的工具）。</p>
<p><strong>为什么需要它</strong>：如果没有接缝，能力与实现绑定，替换一个 Provider 需要修改所有 Consumer。例如将文件系统从本地切到沙箱，需要修改每个使用文件系统的工具。</p>
<p><strong>它是怎么工作的</strong>：Service Definition 包声明 <code>ctx</code> key 和词汇类型；Provider 包实现接口并注册到 <code>ctx</code>；Consumer 包通过 <code>ctx.&lt;key&gt;</code> 调用能力。三者可以在不同包中独立演进。Canonical 例子：<code>dsh-shell</code>（Definition）→ <code>dsh-bash-local</code>/<code>dsh-bash-sandbox</code>（Provider）→ <code>dsh-tool-bash</code>（Consumer）。</p>
<p><strong>与其他概念的关系</strong>：接缝是 Cordis 插件系统的具体应用——Cordis 提供"服务注册到 ctx key"的原语，接缝定义了"三个角色完整才算一个能力"的规范。</p>
<p><strong>关键细节</strong>：一个包可以组合多个角色，但只有一个角色不构成接缝。添加新能力意味着设计全部三个角色。文件系统和子进程 Provider 共享一个执行世界——指向远程沙箱时，Bash、PTY、LSP 全部跟随迁移。</p>
<p><strong>源码定位</strong>：<code>docs/glossary.md</code> 定义；<code>docs/capability-seams.md</code> 生成完整接缝图。</p>

<h3>5.2 事件溯源会话日志（Event-Sourced Session Log）</h3>
<p><strong>定义</strong>：会话是一个 append-only 的类型化 <code>SessionEvent</code> 日志——唯一的真相来源。LLM 消息历史从日志派生，永不单独存储。</p>
<p><strong>为什么需要它</strong>：如果没有事件溯源，模型可见的内容与持久化内容可能脱节，崩溃恢复时丢失上下文。传统数组存储无法支持 fork、resume、transcript、遥测等派生操作。</p>
<p><strong>它是怎么工作的</strong>：<code>Session.append()</code> 是唯一突变点——验证 JSON 可序列化性、表面元数据、重入性后，deepFreeze 事件并追加到日志。<code>SurfaceManager</code> 维护产生消息的事件有序视图（只有 <code>user/message</code>、<code>assistant/message</code>、<code>tool/result</code> 三种事件类型出现在表面上）。<code>deriveMessages()</code> 从表面增量缓存投影——每个表面节点只投影一次，<code>replace</code> 代际递增使缓存失效。</p>
<p><strong>与其他概念的关系</strong>：会话日志是 Agent 循环的基础——循环的每一步都从日志派生模型历史。"模型可见即已记录"不变量保证日志是完整的审计记录。</p>
<p><strong>关键细节</strong>：<code>SessionEventMap</code> 通过 declaration merging 支持插件扩展——插件可以添加新的事件类型而不修改核心代码。<code>assistant/chunk</code> 事件保留 token 级回放保真度，但 <code>deriveMessages()</code> 跳过它们（组装后的 <code>assistant/message</code> 是权威的）。<code>replace</code> 操作用于上下文压缩——用压缩后的事件阴影表面条目范围。</p>
<p><strong>源码定位</strong>：<code>packages/core/session/src/index.ts</code>（Session 类）、<code>packages/core/session/src/types.ts</code>（SessionEventMap）、<code>packages/core/session/src/surface.ts</code>（SurfaceManager）。</p>

<h3>5.3 Turn/Step 双层循环</h3>
<p><strong>定义</strong>：<strong>Turn</strong> 是一次输入排空——从第一个输入被认领开始，到模型和工具停止或终止策略干预时结束。<strong>Step</strong> 是一次模型请求加上它调用的工具执行——一个 Turn 包含零或多个 Step。</p>
<p><strong>为什么需要它</strong>：如果没有双层结构，模型连续调用工具的循环无法区分"同一轮对话的连续步骤"和"新一轮对话"。Turn 标记对话轮次边界，Step 标记每次模型请求边界——这对于持久化、UI 渲染、遥测都至关重要。</p>
<p><strong>它是怎么工作的</strong>：<code>ReactLoopAgent</code> 使用三相位状态机（idle / maintenance / running）。<code>kick()</code> 驱动连续的 Turn；<code>turn()</code> 打开/关闭 Turn；<code>step()</code> 做一次 LLM 调用 + 工具执行。每个相位一个 <code>AbortController</code>。工具执行后，如果工具还需要另一个请求（如 Code Mode），或者下一步输入已到达，则认领并进入下一步。</p>
<p><strong>与其他概念的关系</strong>：Turn/Step 事件都是持久的会话事件（<code>turn/start</code>、<code>turn/end</code>、<code>step/start</code>、<code>step/end</code>）。<code>agent/pre-step</code> waterfall 是请求派生前的唯一串行监听器链——可以拒绝或重写认领的消息。</p>
<p><strong>关键细节</strong>：一个被拒绝或空首次认领仍然关闭一个不花费 step 的持久 Turn——所以日志记录了尝试。<code>agent/turn-stopping</code> 是串行的（没有 <code>next()</code>），是 Turn 关闭前的终止检查点。<code>TurnEndReason</code> 包括 completed、aborted、blocked、error、max-tokens、interrupted（仅崩溃恢复合成）。</p>
<p><strong>源码定位</strong>：<code>packages/core/agent-loop/src/agent.ts</code>（ReactLoopAgent）、<code>docs/architecture.md</code>（Turn flow 定义）。</p>

<h3>5.4 工具执行管道（Tool Execution Pipeline）</h3>
<p><strong>定义</strong>：工具调用从模型输出到结果返回经过的五阶段管道：pre-execute（waterfall 策略）→ monotonic guards（deny-only）→ execute（waterfall around-dispatch）→ post-execute（waterfall 检查/替换）→ finalizeContent（同步最终变换）。</p>
<p><strong>为什么需要它</strong>：如果没有管道，工具执行只有"执行/不执行"两个选项，无法在执行前后注入审批、沙箱、超时、重试、结果改写等策略。管道将策略与工具实现解耦——同一个工具在不同部署中可以有不同的策略组合。</p>
<p><strong>它是怎么工作的</strong>：<code>tools/pre-execute</code> 返回 allow/deny/ask——ask 触发 <code>ctx.approval</code> 一次性提示。注册的 monotonic guards 只能 deny（没有 allow 结果，所以顺序不能把 denial 变回 permission）。<code>tools/execute</code> 是 around-dispatch waterfall——超时、重试、指标作为包裹中间件。<code>tools/post-execute</code> 可以 accept/block/replace/add context。<code>finalizeContent</code> 是最后的内容级不变量，精确运行一次。</p>
<p><strong>与其他概念的关系</strong>：管道使用 Cordis 的 waterfall 事件——监听器必须调用 <code>next()</code> 来委托，不调用则短路链。<code>ToolRuntimeScheduler</code> 的分阶段接口（prepare/dispatch/finalize/finish）让 agent-loop 的并行调度器可以有序运行 pre/post 策略同时重叠 dispatch。</p>
<p><strong>关键细节</strong>：<code>ToolGuard</code> 是单调的——返回 reason 则 deny，返回 undefined 则不变。这保证了安全策略不会被后续监听器绕过。工具执行模式分为 parallel（可与兄弟工具重叠）和 exclusive（独占运行，形成排序屏障），由 <code>ctx.tools.executionMode()</code> 分类。</p>
<p><strong>源码定位</strong>：<code>packages/core/tools/src/index.ts</code>（ToolRuntime）、<code>packages/core/agent-loop/src/tool-calls.ts</code>（并行调度器）、<code>docs/tool-execution-pipeline.md</code>（管道文档）。</p>

<h3>5.5 可逆注册（Reversible Registration）</h3>
<p><strong>定义</strong>：所有对共享上下文的贡献——工具注册、提示词段落、事件监听器、适配器——通过 <code>ctx.effect()</code> / <code>ctx.on()</code> 安装，注册的 <code>register()</code> 返回 disposer，卸载时自动回滚。</p>
<p><strong>为什么需要它</strong>：如果没有可逆注册，插件卸载或 HMR（热模块替换）时会留下孤儿注册——事件监听器引用已卸载的插件，工具注册表中有不存在的工具。这导致内存泄漏和运行时错误。</p>
<p><strong>它是怎么工作的</strong>：Cordis 的 <code>ctx.effect()</code> 注册一个副作用和对应的清理函数。当插件所在的 fiber 卸载时，Cordis 按注册的逆序执行所有清理函数。<code>ctx.on()</code> 是事件监听器的快捷方式——返回的 disposer 移除监听器。</p>
<p><strong>与其他概念的关系</strong>：可逆注册是 Cordis 的第四原语，支撑了插件化架构的安全替换——任何插件可以在不重启进程的情况下卸载和替换。HMR 测试策略要求每个注册贡献都通过 dispose fiber 后观察移除来证明 disposal。</p>
<p><strong>关键细节</strong>：<code>ScopedLayers</code> 的作用域注册在 Agent 作用域生命周期结束时自动清理。Agent 的 <code>AgentHandle.dispose()</code> 是唯一可以拆除 Agent 的方式——持有者负责调用。</p>
<p><strong>源码定位</strong>：<code>docs/cordis-primer.md</code>（Cordis 原语）、<code>packages/core/tools/src/index.ts</code>（ScopedLayers）。</p>

<h3>5.6 Cordis 事件分发四模式</h3>
<p><strong>定义</strong>：Cordis 提供四种事件分发模式：<code>emit</code>（不等待、注册顺序、无返回值）、<code>waterfall</code>（不等待、注册顺序、有返回值——around 中间件，<code>next()</code> 委托）、<code>parallel</code>（等待、所有监听器并行、无返回值）、<code>serial</code>（等待、注册顺序、有返回值）。</p>
<p><strong>为什么需要它</strong>：不同的扩展点需要不同的交互语义——观察型扩展只需 emit，策略型扩展需要 waterfall（可短路），并行型扩展需要 parallel，有序型扩展需要 serial。统一的四模式避免了每种事件自定义交互协议。</p>
<p><strong>它是怎么工作的</strong>：分发模式是事件公开契约的一部分，用 <code>@mode</code> JSDoc 标签标注。<code>waterfall</code> 的 <code>next()</code> 传播可能被包裹的结果；<code>prepend: true</code> 让监听器在普通注册之前运行。对于单决策事件，短路是设计模式——<code>agent/pre-step</code> 可以 reject 来阻止整个步骤。</p>
<p><strong>与其他概念的关系</strong>：事件分发是 Cordis 的第三原语，与可逆注册配合——监听器通过 <code>ctx.on()</code> 注册并自动清理。封装规则：工具管道事件属于 <code>ctx.tools</code>，模型流属于 <code>ctx.llm</code>，Agent 协调属于 <code>ctx.agents</code>。</p>
<p><strong>关键细节</strong>：Waterfall 监听器必须调用 <code>next()</code> 来委托——不调用则短路链。<code>agent/turn-stopping</code> 是 serial 的，没有 <code>next()</code>。事件用于拦截/策略；服务方法用于直接能力调用。</p>
<p><strong>源码定位</strong>：<code>docs/cordis-primer.md</code>（四模式定义）、<code>packages/core/agent/src/dispatch.ts</code>（AgentEventDispatch 融合分发器）。</p>

<h3>5.7 Profile/Bundle 组合系统</h3>
<p><strong>定义</strong>：Profile 是存储在 Harness home 中的命名组合，列出它堆叠的 bundle。Bundle 是 Cordis 配置行和代码的分发格式——通过 <code>cordis.patch.yml</code> 声明式地插入/替换插件行。</p>
<p><strong>为什么需要它</strong>：如果没有组合系统，Agent 的能力组合散落在代码中，无法通过配置文件声明式地组合出不同形态的 Agent。Profile/Bundle 将"用哪些工具、哪个模型、什么权限策略"从代码提升为配置。</p>
<p><strong>它是怎么工作的</strong>：每个 bundle 在 <code>package.json</code> 的 <code>dsh</code> 字段声明：<code>dsh.profile</code> 列出 profile 的 bundle，<code>dsh.bundle</code> 指向 bundle 的 patch 文件。层按顺序应用：bundle 顺序 → profile <code>cordis.patch.yml</code> → home 级 → <code>--patch</code> 覆盖。补丁通过 id 定位行并替换整个配置（不做深度合并），或插入新行。</p>
<p><strong>与其他概念的关系</strong>：Profile/Bundle 建立在 Cordis Loader 之上——<code>cordis.yml</code> 是 YAML 列表，每条目有 <code>id</code>、<code>name</code>、<code>config</code>。<code>!!js</code> 表达式允许运行时求值（对 <code>config</code> 和 <code>disabled</code> 字段）。<code>cordis-plugin-include</code> 插件支持 patch-layer 组合——include 基础文件，按 id patch 行，插入新行。</p>
<p><strong>关键细节</strong>：补丁替换整个行配置——覆盖必须重述每个字段，没有深度合并。平台门控在 patch 文件中自包含——bash 在 Windows 上 <code>disabled: !!js process.platform === 'win32'</code>，pwsh 反之。一个共享 patch 文件，每个主机恰好一个 shell 栈。</p>
<p><strong>源码定位</strong>：<code>packages/bundle/base/README.md</code>、<code>packages/boot/app-boot/README.md</code>、<code>apps/cli/src/profile-boot.ts</code>。</p>

<div class="mermaid">
flowchart LR
  A[核心抽象关系]
  A --> B[能力接缝]
  A --> C[事件溯源日志]
  A --> D[Turn/Step 循环]
  A --> E[工具执行管道]
  A --> F[可逆注册]
  A --> G[事件分发四模式]
  A --> H[Profile/Bundle 组合]
  B -->|基于| F
  B -->|使用| G
  C -->|驱动| D
  D -->|调用| E
  E -->|记录到| C
  D -->|组装自| B
  H -->|组装| B
  H -->|组装| D
</div>
</section>

<section id="sec-6">
<h2><span class="num">06</span> 关键代码 + 大白话</h2>

<h3>6.1 Agent 循环的三相位状态机</h3>
<div class="code-pair">
<pre><code class="language-typescript">// packages/core/agent-loop/src/agent.ts:38-46
type Phase =
  | { kind: 'idle'; lastTurn: number }
  | {
    kind: 'maintenance'
    abort: AbortController
    lastTurn: number
    wakeRequested: boolean
  }
  | {
    kind: 'running'
    abort: AbortController
    turn: number
    step: number
    wakeRequested: boolean
  }</code></pre>
<div class="explain">
<p>Agent 循环用三个相位管理生命周期：<strong>idle</strong>（空闲等待用户输入）、<strong>maintenance</strong>（维护模式，运行不需要模型的后台任务）、<strong>running</strong>（正在与模型交互）。</p>
<p>每个相位都有独立的 <code>AbortController</code>——切换相位时取消前一个的信号。这种设计让取消操作精确到相位级别：你可以取消当前运行步骤而不影响维护任务。</p>
<p><code>wakeRequested</code> 标记在当前相位执行期间是否有新输入到达——如果是，循环在当前相位结束后自动继续而不是回到 idle。</p>
</div>
</div>

<h3>6.2 Session 事件追加——唯一突变点</h3>
<div class="code-pair">
<pre><code class="language-typescript">// packages/core/session/src/index.ts:604-655
append<T extends SessionEventType>(
  type: T,
  data: SessionEventMap[T],
  ...opts: T extends SurfaceEventType
    ? [opts: SurfaceIntent] : []
): SessionEvent<T> {
  const dataSnapshot = snapshotJsonValue(data)
  if (dataSnapshot === undefined) {
    throw new Error(
      `session event "${type}" carries non-JSON-serializable data`
    )
  }
  const event = deepFreeze({
    type, seq: this.log.length,
    time: Date.now(), data: dataSnapshot,
    ...opts.length ? opts[0] : {},
  })
  this.surfaceManager.validateNext(event)
  this.log.push(event)
  return event
}</code></pre>
<div class="explain">
<p>这是整个会话日志的<strong>唯一写入入口</strong>。所有模型可见的行为——用户消息、助手回复、工具调用、工具结果——都通过这个方法追加到日志。</p>
<p>三重保障：(1) <code>snapshotJsonValue</code> 确保数据是纯 JSON 可序列化的（函数、Symbol、循环引用都会被拒绝）；(2) <code>deepFreeze</code> 让事件不可变——追加后任何代码都无法篡改；(3) <code>validateNext</code> 让 SurfaceManager 验证事件在表面序列中的合法性。</p>
<p>这种设计意味着：会话日志是<em>不可篡改的审计记录</em>。模型看到的每一条消息都可以从日志精确重建——"模型可见即已记录"不只是口号，而是运行时不变量。</p>
</div>
</div>

<h3>6.3 工具并行调度——屏障与滚动池</h3>
<div class="code-pair">
<pre><code class="language-typescript">// packages/core/agent-loop/src/tool-calls.ts:84-101
while (next < planned.length) {
  const first = planned[next]!
  const mode = ctx.tools.executionMode(first.exec).kind
  const group = mode === 'parallel'
    ? planned.slice(next)  // 取后续所有
    : [first]               // 独占：只取自己
  const outcome = await runGroup(
    ctx, turn, step, group,
    mode, signal, acceptContext,
  )
  next += outcome.consumed
  concluded ||= outcome.concluded
  if (outcome.aborted) {
    for (const call of planned.slice(next))
      appendSkippedToolCall(
        session, turn, step, call.block
      )
    return { concluded }
  }
}</code></pre>
<div class="explain">
<p>工具调度器要解决的问题是：模型一次可能返回多个工具调用，有些可以并行执行（如读两个文件），有些必须独占执行（如运行 bash 命令）。</p>
<p>策略是：<strong>parallel 工具填充滚动池</strong>（最多 <code>maxParallelToolCalls = 10</code> 个并发），<strong>exclusive 工具形成屏障</strong>（必须等前面所有工具完成才能运行，且运行时不能有其他工具并发）。遇到 exclusive 工具时，把它单独一组执行。</p>
<p>结果按<strong>模型顺序</strong>提交——即使工具 B 先于工具 A 完成，结果也按 A、B 顺序写入日志。这保证了模型看到的工具结果顺序与它发出调用顺序一致。</p>
</div>
</div>

<h3>6.4 Cordis 事件分发——Waterfall 语义</h3>
<div class="code-pair">
<pre><code class="language-typescript">// packages/core/agent/src/dispatch.ts:107-149
export function agentEvents(
  ctx: Context, agent: Agent,
  carrier = agentCarrier(agent),
): AgentEventDispatch {
  const fused = <K extends AgentSubjectEvent>(
    payload: PayloadRest<K>,
  ): PayloadOf<K> =>
    ({ ...payload, agent } as PayloadOf<K>)
  return {
    emit(name, payload) {
      ctx.emit(name, fused(payload))
    },
    async serial(name, payload) {
      return ctx.serial(name, fused(payload))
    },
    waterfall(name, payload, ...rest) {
      return ctx.waterfall(
        name, fused(payload), ...rest,
      )
    },
  }
}</code></pre>
<div class="explain">
<p>这是 Agent 事件的<strong>融合分发器</strong>——在构造时把 Agent 主体和作用域载体耦合在一起，保证 scope key 和 payload 的 <code>agent</code> 字段不会分歧。</p>
<p><code>fused</code> 函数是关键：它自动把当前 agent 注入到每个事件的 payload 中。这意味着监听器总是知道是哪个 Agent 触发了事件，不需要从外部传入。</p>
<p>Waterfall 是最特殊的模式：监听器收到 payload 和 <code>next</code> 函数，调用 <code>next()</code> 委托给下一个监听器，可以包裹或替换结果。<strong>不调用 <code>next()</code> 则短路整个链</strong>——这是 <code>agent/pre-step</code> 拒绝步骤的机制。</p>
</div>
</div>

<h3>6.5 系统提示词组装——作用域合并</h3>
<div class="code-pair">
<pre><code class="language-typescript">// packages/core/system-prompt/src/index.ts:467-542
async assemble(
  context: AssembleContext = {},
): Promise<PromptAssembly> {
  const scope = context.scope
  const scopeLayers = this.layers.chainLayers(scope)
  // 变量：全局 → 链，最近作用域优先
  const variables: Record<string, string | undefined> = {}
  for (const [name, provider]
    of this.layers.global.variables.entries())
    variables[name] = provider(context)
  for (const layer of scopeLayers)
    for (const [name, provider]
      of layer.variables.entries())
      variables[name] = provider(context)
  // 段落/上下文：作用域覆盖全局
  const sectionByName =
    this.layers.merge(scope, l => l.sections)
  const contextByName =
    this.layers.merge(scope, l => l.contexts)
  // 工具 schema 收集
  const collected: ToolSchema[] = []
  for (const provider of providers) {
    const result = provider(context)
    collected.push(...result.schemas.map(...))
  }
  // ... 排序、应用 toolOrder、运行 waterfall
}</code></pre>
<div class="explain">
<p>系统提示词不是一段写死的文本，而是<strong>由多个段落在运行时组装</strong>而成的。每个插件可以注册自己的提示词段落（如身份描述、工具说明、环境信息）。</p>
<p>组装规则是<strong>作用域阴影</strong>：全局段落是基础，作用域段落覆盖同名全局段落。变量也是全局优先、最近作用域覆盖。这就像 CSS 的层叠规则——更具体的作用域优先级更高。</p>
<p>最后还有一个 <code>system-prompt/assemble</code> waterfall，允许专家插件在组装完成后做最终变换。加上 <code>toolOrder</code> 配置控制工具在提示词中的顺序。整个管道是声明式的——插件只需注册段落，不需要知道其他插件的存在。</p>
</div>
</div>

<h3>6.6 LLM 流式组装——BlockAssembler</h3>
<div class="code-pair">
<pre><code class="language-typescript">// packages/llm/llm/src/assembler.ts:36-93
export class BlockAssembler {
  private partials = new Map<number, PartialBlock>()
  private order: number[] = []
  push(chunk: StreamChunk): void {
    switch (chunk.type) {
      case 'block-start':
        // 创建 partial block
      case 'text-delta':
      case 'reasoning-delta':
        // 追加文本
      case 'tool-call-delta':
        // 积累 id/name/arguments
      case 'block-end':
        // 权威关闭
      case 'usage':
        this._usage = chunk.usage; return
      case 'finish':
        this._finish = chunk.reason; return
    }
  }
  blocks(): ContentBlock[] {
    const blocks = this.order.map(idx =>
      this.assemble(this.mustGet(idx), idx),
    )
    return this.finish.kind === 'max-tokens'
      ? blocks.filter(b => b.type !== 'tool-call')
      : blocks
  }
}</code></pre>
<div class="explain">
<p>模型流式返回的 chunk 是碎片化的——文本是一段段 delta，工具调用的 id/name/arguments 也是分片到达。<code>BlockAssembler</code> 是<strong>唯一的组装算法</strong>，把碎片重组成完整的 <code>ContentBlock</code>。</p>
<p>它容错处理只有 delta 的协议（没有 <code>block-start</code>），也处理有明确生命周期的协议（<code>block-start</code> → deltas → <code>block-end</code>）。</p>
<p>一个关键细节：如果 finish reason 是 <code>max-tokens</code>（模型被截断），<strong>丢弃所有 tool-call 块</strong>——因为不完整的工具调用参数无法安全执行。这防止了"模型输出到一半被截断，框架拿着半截 JSON 去调工具"的危险情况。</p>
</div>
</div>
</section>

<section id="sec-7">
<h2><span class="num">07</span> 端到端流程</h2>

<p>以下追踪一个完整的 happy-path：用户发送一条消息，Agent 执行一步模型请求 + 工具调用，最终返回结果。</p>

<div class="mermaid">
sequenceDiagram
  participant U as 用户
  participant A as ReactLoopAgent
  participant S as Session 日志
  participant SP as SystemPrompt
  participant L as LlmRuntime
  participant T as ToolRuntime
  U->>A: send(followup, "帮我读取 package.json"
  A->>S: append(agent/inbox/spliced
  A->>A: kick() → turn() → phase=running
  A->>S: append(turn/start, {turn: 1})
  A->>A: claim inbox: next-step + next-turn
  A->>A: agent/pre-step waterfall (enter)
  A->>S: append(step/start, {turn:1, step:1})
  A->>S: append(user/message, "帮我读取...")
  A->>SP: assemble(scope)
  SP-->>A: PromptAssembly{sections, tools, vars}
  A->>S: deriveMessages() → 模型历史
  A->>A: agent/request waterfall
  A->>L: prepareCall(config)
  L-->>A: PreparedLlmCall
  A->>L: stream(request)
  loop 流式 chunk
    L-->>A: StreamChunk(text-delta)
    A->>S: append(assistant/chunk, {chunk}
  end
  L-->>A: finish(stop)
  A->>A: BlockAssembler → AssistantMessage
  A->>S: append(assistant/message, {message, usage}
  Note over A: 检测到 tool-call: read_file
  A->>S: append(tool/call, {name:"read_file", args}
  A->>T: executionMode → parallel
  A->>T: tools/pre-execute waterfall → allow
  A->>T: monotonic guards → pass
  A->>T: tools/execute → tool body
  T-->>A: ToolExecutionResult(success)
  A->>T: tools/post-execute → accept
  A->>T: finalizeContent
  A->>S: append(tool/result, {message}
  A->>S: append(step/end, {turn:1, step:1}
  Note over A: 工具完成，无更多步骤
  A->>A: agent/turn-stopping (serial)
  A->>S: append(turn/end, {turn:1, reason:"completed"}
  A->>A: phase=idle
  A-->>U: agent/status: idle
</div>

<p><strong>叙述：</strong>用户调用 <code>agent.followup(message)</code> 将消息放入 Inbox。驱动器 <code>kick()</code> 唤醒，进入 running 相位，打开 Turn 1。驱动器从 Inbox 认领下一步输入和一个排队的 next-turn 提示，运行 <code>agent/pre-step</code> waterfall（监听器可以拒绝或重写消息）。</p>

<p>认领通过后，记录 <code>step/start</code> 和 <code>user/message</code>。系统提示词组装器 <code>ctx.systemPrompt.assemble()</code> 收集所有注册的段落、上下文、变量和工具 schema，生成 <code>PromptAssembly</code>。驱动器从会话日志派生模型历史 <code>session.deriveMessages()</code>。</p>

<p><code>agent/request</code> waterfall 运行后，驱动器调用 <code>ctx.llm.prepareCall(config)</code> 获取一次性调用句柄，然后 <code>stream(request)</code> 开始流式请求。每个 <code>StreamChunk</code> 作为 <code>assistant/chunk</code> 事件记录到日志。流结束后，<code>BlockAssembler</code> 组装完整的 <code>AssistantMessage</code>，记录为 <code>assistant/message</code> 事件。</p>

<p>如果助手消息包含 tool-call 块，驱动器通过 <code>executeToolCalls()</code> 调度。每个工具调用先记录 <code>tool/call</code> 事件，然后经过五阶段管道：pre-execute（策略审批）→ guards（单调守卫）→ execute（超时/重试包裹）→ post-execute（结果检查）→ finalizeContent。工具结果记录为 <code>tool/result</code> 事件。</p>

<p>步骤结束后，如果工具还需要另一个请求（如 Code Mode），或者下一步输入已到达，则认领并进入下一步。否则 <code>agent/turn-stopping</code> 串行检查点运行，Turn 关闭，驱动器回到 idle 相位。</p>
</section>

<section id="sec-8">
<h2><span class="num">08</span> 心智模型</h2>

<h3>类比 1：乐高底板与积木</h3>
<p>DeepSeek Harness 就像一块<strong>乐高底板</strong>（Cordis 框架），上面可以插各种<strong>积木</strong>（插件）。底板提供了统一的插孔（<code>ctx</code> key）和卡扣机制（<code>ctx.effect()</code> 可逆注册）。每个积木（能力包）有明确的接口形状（Service Definition）、不同材质版本（Provider：本地/沙箱/远程）、以及使用积木的模型（Consumer：工具）。</p>
<p>你想把"本地文件系统"积木换成"E2B 沙箱"积木？直接拔出 <code>dsh-fs-local</code> 插入 <code>dsh-fs-e2b</code>，所有使用文件系统的工具（Consumer）自动适配，零代码改动。这就是能力接缝的力量——接口形状不变，实现自由替换。</p>
<p>Profile 和 Bundle 就是<strong>乐高说明书</strong>——告诉你按什么顺序插哪些积木。<code>dsh-base</code> 是基础套装（每个模型都必须有的积木），<code>dsh-web-app</code> 是扩展包（加一个浏览器 UI 积木），你的 <code>cordis.patch.yml</code> 是自定义改装指南。</p>

<h3>类比 2：会计账本与实时看板</h3>
<p>会话日志（Session Log）就像一本<strong>会计账本</strong>——只追加、不修改、不删除。每一条交易（SessionEvent）都有序号（seq）、时间戳和不可变内容。会计师（<code>deriveMessages()</code>）可以从账本中按规则提取出当前财务报表（模型历史），但报表是派生物，账本才是唯一真相来源。</p>
<p><code>assistant/chunk</code> 事件就像逐笔流水——记录了每一分钱的流动（每个 token），用于审计回放。但财务报表（<code>deriveMessages</code>）只看汇总凭证（<code>assistant/message</code>），不看流水。上下文压缩（compaction）就像会计年度结算——用汇总条目替换原始凭证范围，但账本本身不丢失任何记录（<code>replace</code> 操作阴影而非删除）。</p>
<p><code>agent/*</code> 事件就像<strong>实时看板</strong>——显示当前正在进行的交易状态（idle/running），但不持久化。你看板上的数字来自账本派生，但看板本身是临时的。这就是为什么 <code>session/event</code> 用于回放和审计，<code>agent/*</code> 用于实时协调。</p>

<h3>类比 3：餐厅厨房的订单流程</h3>
<p>Turn/Step 双层循环就像餐厅的<strong>订单流程</strong>。一个 Turn 是一位顾客的一次点餐会话——从顾客坐下点第一道菜开始，到所有菜上完、顾客不再加菜时结束。一个 Step 是后厨的一次出菜——厨师（模型）做一道菜（一次 LLM 请求），可能需要调用多个帮手（工具调用）来准备食材。</p>
<p>Inbox 是服务员的<strong>订单本</strong>——<code>next-turn</code> 是"等这桌菜上完再点的菜"，<code>next-step</code> 是"加急，当前这道菜还没做完就要加的料"。<code>followup</code> 是正常点菜（下一轮），<code>steer</code> 是加急（当前步骤插队），<code>inject</code> 是偷偷加料但不催厨师。</p>
<p>工具执行管道是后厨的<strong>出菜质检流程</strong>：pre-execute 是厨师长审批（要不要做这道菜？）→ guards 是食品安全检查（只能拒绝，不能强制通过）→ execute 是实际烹饪 → post-execute 是出品检查（菜对不对？要不要退回重做？）。parallel 是可以同时炒的菜，exclusive 是独占灶台的菜（如蒸饭，占了灶台别人就不能用）。</p>
</section>

<section id="sec-9">
<h2><span class="num">09</span> 延伸阅读 / 文件索引</h2>

<h3>关键文件清单</h3>
<table>
<tr><th>文件路径</th><th>职责</th></tr>
<tr><td><code>AGENTS.md</code></td><td>Agent 工作规范——仓库布局、命令、约定、防御模式</td></tr>
<tr><td><code>docs/architecture.md</code></td><td>架构总览——Cordis、Profile/Bundle、核心包、事件、Turn 流程、接缝、扩展点</td></tr>
<tr><td><code>docs/cordis-primer.md</code></td><td>Cordis 框架入门——五原语、四事件模式、Loader 配置</td></tr>
<tr><td><code>docs/agent-lifecycle.md</code></td><td>Agent 生命周期时序图（生成的 Mermaid）</td></tr>
<tr><td><code>docs/tool-execution-pipeline.md</code></td><td>工具执行管道流程图（生成的 Mermaid）</td></tr>
<tr><td><code>docs/glossary.md</code></td><td>术语表——seam、scope、turn/step、goal、Ralph 等</td></tr>
<tr><td><code>docs/capability-seams.md</code></td><td>能力接缝图——所有 seam 的 Service Definition/Provider/Consumer 关系</td></tr>
<tr><td><code>docs/subsystems/core.md</code></td><td>核心子系统文档——六个核心包的类型定义和 Cordis API</td></tr>
<tr><td><code>docs/subsystems/session.md</code></td><td>会话子系统文档——SessionEventMap、Surface、持久化契约</td></tr>
<tr><td><code>docs/subsystems/tools.md</code></td><td>工具子系统文档——ToolDefinition、执行管道类型、UI 展示</td></tr>
<tr><td><code>docs/subsystems/llm-streaming.md</code></td><td>LLM 流式子系统文档——适配器、流协议、组装器</td></tr>
<tr><td><code>packages/core/agent-loop/src/agent.ts</code></td><td>ReactLoopAgent——Agent 循环的具体实现（三相位状态机）</td></tr>
<tr><td><code>packages/core/agent-loop/src/tool-calls.ts</code></td><td>executeToolCalls——工具并行调度器（屏障+滚动池）</td></tr>
<tr><td><code>packages/core/session/src/index.ts</code></td><td>Session 类——事件追加、消息派生、表面管理</td></tr>
<tr><td><code>packages/core/session/src/types.ts</code></td><td>SessionEventMap——可合并扩展的事件词汇表</td></tr>
<tr><td><code>packages/core/session/src/surface.ts</code></td><td>SurfaceManager——消息表面投影和增量缓存</td></tr>
<tr><td><code>packages/core/tools/src/index.ts</code></td><td>ToolRuntime——工具注册表和五阶段执行管道</td></tr>
<tr><td><code>packages/core/agent/src/index.ts</code></td><td>AgentRegistry——Agent 注册表和发起者作用域</td></tr>
<tr><td><code>packages/core/agent/src/runtime-types.ts</code></td><td>Agent 接口定义——send/followup/steer/inject/cancel</td></tr>
<tr><td><code>packages/core/system-prompt/src/index.ts</code></td><td>SystemPrompt——提示词段落和工具 schema 组装</td></tr>
<tr><td><code>packages/llm/llm/src/index.ts</code></td><td>LlmRuntime——模型适配器注册表和流式调用</td></tr>
<tr><td><code>packages/llm/llm/src/assembler.ts</code></td><td>BlockAssembler——chunk→message 组装算法</td></tr>
<tr><td><code>apps/cli/src/bin.ts</code></td><td>dsh CLI 入口——参数解析和启动分发</td></tr>
<tr><td><code>apps/cli/src/profile-boot.ts</code></td><td>Profile 组合和启动——patch 层堆叠</td></tr>
<tr><td><code>packages/bundle/base/README.md</code></td><td>dsh-base bundle 文档——第一层插件行和平台门控</td></tr>
<tr><td><code>examples/headless-agent/cordis.yml</code></td><td>无头 Agent 示例配置——完整的 one-shot 编码 Agent 组合</td></tr>
<tr><td><code>examples/acp-agent/cordis.yml</code></td><td>ACP Agent 示例配置——沙箱化自动化服务器</td></tr>
<tr><td><code>examples/jsonrpc-agent/minimal.cordis.yml</code></td><td>最小 JSON-RPC Agent 配置——Python SDK 用</td></tr>
<tr><td><code>pnpm-workspace.yaml</code></td><td>monorepo 工作区配置——vendor/packages/apps/examples</td></tr>
<tr><td><code>docs/cookbook/extension-cookbook.md</code></td><td>扩展手册——功能到能力的映射索引</td></tr>
<tr><td><code>docs/cookbook/adding-a-tool.md</code></td><td>添加工具的步骤指南</td></tr>
<tr><td><code>docs/cookbook/adding-an-llm-adapter.md</code></td><td>添加 LLM 适配器的步骤指南</td></tr>
<tr><td><code>docs/cookbook/adding-a-package.md</code></td><td>添加新包的步骤指南</td></tr>
<tr><td><code>docs/development.md</code></td><td>开发指南——TypeScript 项目布局、CI、工作流</td></tr>
<tr><td><code>docs/testing.md</code></td><td>测试策略——覆盖率门、快照测试、子进程启动模式</td></tr>
<tr><td><code>docs/defensive-patterns.md</code></td><td>防御模式——生命周期、并发、子进程、拆卸</td></tr>
</table>

<h3>进一步学习方向</h3>
<ul>
<li><strong>Cordis 框架深入</strong>：阅读 <code>docs/cordis-primer.md</code> 和 <code>docs/cordis-tutorial/</code>，理解 spatiotemporal composability 范式</li>
<li><strong>能力接缝设计</strong>：阅读 <code>docs/capability-seams.md</code>，理解 Service Definition/Provider/Consumer 三角色分离</li>
<li><strong>事件溯源模式</strong>：阅读 <code>packages/core/session/src/surface.ts</code>，理解 Surface 投影和 replace 操作</li>
<li><strong>工具管道策略</strong>：阅读 <code>docs/tool-execution-pipeline.md</code>，理解 pre-execute/guards/execute/post-execute 各阶段</li>
<li><strong>Code Mode</strong>：阅读 <code>packages/core/tools/src/code-mode.ts</code>，理解 <code>run_code</code> 传输层如何让模型通过 SDK 调用工具</li>
<li><strong>Profile/Bundle 组合</strong>：阅读 <code>packages/boot/app-boot/README.md</code>，理解层堆叠和 patch 语义</li>
<li><strong>子 Agent 编排</strong>：阅读 <code>docs/subsystems/subagent.md</code>，理解不同委派策略的统一接口</li>
<li><strong>Ralph 循环</strong>：阅读 <code>docs/glossary.md</code> 中的 Ralph 条目，理解 fresh-agent 工作流</li>
<li><strong>沙箱与安全</strong>：阅读 <code>native/README.md</code> 和 <code>packages/sandbox/</code>，理解 Landlock 和 Windows ACL 隔离</li>
<li><strong>Python SDK</strong>：阅读 <code>python/README.md</code>，理解 bundled runtime 的部署模式</li>
</ul>
</section>

<div class="la-footer">
<p>生成时间：2026-08-13 ｜ 源仓库：<a href="https://github.com/deepseek-ai/deepseek-harness">github.com/deepseek-ai/deepseek-harness</a> ｜ 分析工具：learn-art (Qoder)</p>
<p>本报告基于仓库源码、架构文档和示例配置的深度分析自动生成，旨在帮助开发者快速理解 DeepSeek Harness 的架构设计和核心抽象。</p>
</div>

</div>

<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
document.querySelectorAll('.learn-art-report pre code').forEach(b => window.hljs && hljs.highlightElement(b));
if (window.mermaid) {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      primaryColor:'#fdfcf7',
      primaryTextColor:'#1a1c2c',
      primaryBorderColor:'#d96f3a',
      lineColor:'#6c7395',
      fontFamily:'Noto Sans SC, sans-serif'
    },
    flowchart:{ curve:'basis' }
  });
}
</script>
