---
title: 从0.5到1：如何在AI时代快速搭建自己的LLM理解
layout: post
date: 2026-07-10
permalink: /posts/from-05-to-1-llm-sharing/
categories: [Blogging, AI]
tags: [LLM, AI, Learning]
math: true
---

**讲者：** 本凌  
**创建日期：** 2026年6月8日

本文围绕三个问题展开：LLM 从哪来、当下的大模型长什么样、以及普通学习者如何建立一套持续更新的 AI 学习工作流。

## 快速塑形：从机器学习到大模型，到底发生了什么

这一章的目标很简单：**用最短的路径，把"机器学习"到"大模型"之间的那条演化线给串起来**。很多人觉得这些东西又多又杂，但其实它们之间有一条非常清晰的进化逻辑，每一个新东西的出现，都是为了补上一个东西的短板。

### 1.1 最初的起点：线性回归 -> 逻辑回归 -> 感知机

**这三个东西本质上都是"用一条线（或一个面）去拟合数据"，区别只在于你要拟合什么、怎么拟合。**

#### 线性回归：用最简单的直线去预测一个连续值

想象你是一个房产中介，你的工作经验告诉你：房子面积越大、离地铁越近，价格越高。线性回归做的事情就是把这些经验量化成一个公式：

$$
y = w_1 \cdot x_1 + w_2 \cdot x_2 + b
$$

其中 $x_1$ 是面积、$x_2$ 是地铁距离，$w$ 是权重，$b$ 是偏置。训练的过程就是不断调整 $w$ 和 $b$，让模型的预测值和真实值之间的误差（线性回归通常用均方误差 MSE）最小化。这个过程用到的核心算法叫**梯度下降**，你站在山坡上，每次往最陡的方向迈一步，最终就能走到山谷（误差最小的地方）<sup>[1]</sup>。

线性回归虽然简单，但它奠定了后续所有模型的两大基石：

1.  **用参数（$w, b$）去“学习”数据中的规律**
    
2.  **用损失函数 + 梯度下降来优化参数**
    

#### 逻辑回归：在线性回归外面套一层"开关"，变成分类器

线性回归输出的是一个实数，可以是任何值，但很多时候我们要的不是一个数，而是一个**分类决策**：这封邮件是不是垃圾邮件？这个肿瘤是良性还是恶性？

逻辑回归的做法非常直觉，在线性回归的输出外面套一层 **Sigmoid 函数**：

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

这个函数会把任何实数"压"到 $(0, 1)$ 之间。于是模型的输出就变成了"属于正类的概率"，大于 0.5 判为正，否则判为负。

虽然名字叫"回归"，但逻辑回归实际上是一个**分类模型**。它画出来的决策边界仍然是一条直线（或一个超平面），所以本质上它还是"线性模型家族"的一员 <sup>[2]</sup>。

#### 感知机：生物神经元的数学抽象

1957 年，Frank Rosenblatt 提出了感知机（Perceptron），它的灵感直接来源于生物神经元：接收信号、加权求和、超过阈值就"激活"。数学上，感知机和逻辑回归非常像，区别在于它用的是阶跃函数（Step Function）而不是 Sigmoid：

$$
f(z) = \begin{cases} 1, & z \geq 0 \\ 0, & z < 0 \end{cases}
$$

感知机的学习规则也很直觉：**预测错了就调，预测对了不动**。这叫做"感知机学习规则"，后来被证明在数据线性可分的情况下一定能收敛。

但 1969 年，Minsky 和 Papert 出版了一本书叫《Perceptrons》，用数学证明了：**单层感知机连 XOR 这种简单的非线性问题都解决不了**。这个发现直接导致了 AI 的第一次寒冬，大家觉得这条路走不通了 <sup>[3]</sup>。

### 1.2 多层感知机及其技术跳跃

**破局之道：加层！**

既然单层感知机搞不定非线性问题，那叠起来呢？答案是可以。多层感知机（MLP, Multi-Layer Perceptron）在输入层和输出层之间加入了**隐藏层**，每一层的输出作为下一层的输入：

$$
\text{Layer 1: } h = \sigma(W_1 x + b_1) \\ \text{Layer 2: } y = \sigma(W_2 h + b_2)
$$

这里的 $\sigma$ 不再是阶跃函数，而是 **Sigmoid、Tanh** 这类可导的激活函数。为什么一定要可导？因为接下来要请出深度学习的核心武器，**反向传播算法（Backpropagation）**。

**反向传播：让"加层"真正可行的关键**

MLP 的概念其实很早就有了，但一直没人知道怎么高效地训练多层网络。直到 1986 年，Rumelhart、Hinton 和 Williams 用反向传播算法解决了这个问题 <sup>[4]</sup>。

反向传播的本质是**链式求导**：从输出层的误差出发，一层一层地往回算，每一层都知道自己对最终误差贡献了多少，然后朝着减小误差的方向调整自己的参数，每一层都清楚自己该改什么。

**技术跳跃：从MLP到深度学习的三个里程碑**

MLP 虽然解决了非线性问题，但在很长一段时间里仍然被传统机器学习算法（SVM、随机森林等）压制，直到三个关键事件改变了格局：

1.  **ReLU 激活函数（2010 年）**：Sigmoid 和 Tanh 在层数多了之后会出现"梯度消失"问题，梯度连乘后趋近于零，深层的参数学不动了。ReLU（$f(x) = \max(0, x)$）简洁而优雅地缓解了这个问题，让训练几十上百层的网络成为可能 <sup>[5]</sup>。
    
2.  **GPU 并行计算（2012 年）**：AlexNet 在 ImageNet 比赛中用 GPU 训练深层网络，以碾压性的优势获胜（错误率降低了 10.8%），证明了深度学习的工程可行性。
    
3.  **大规模数据集 + 预训练范式（2017 年至今）**：从 ImageNet 到 WebText，再到 Common Crawl，数据规模的爆发配合预训练 + 微调的范式，让深度学习从"特定任务"走向了"通用能力"。
    

从 MLP 到大模型，中间还差一个关键桥梁，**如何让模型处理"序列"**。这就是接下来分词器、编码器、解码器要解决的问题。

### 1.3 一张图讲清楚分词器、编码器、解码器的作用

**一张图看全貌**

![image.png](/sharing/images/tokenizer-encoder-decoder.png)

**三者关系一句话总结**：分词器是"翻译官"（人类语言 → 数字），编码器是"阅读理解"（数字 → 语义向量），解码器是"作文输出"（语义向量 → 新文本）。

**分词器（Tokenizer）：让模型"认字"的第一步**

模型不认识中文、英文，它只认识数字。分词器的工作就是把文本拆成"子词单元"（Token），每个单元对应一个整数 ID。

目前主流的分词方法有三种：

| 方法 | 核心思路 | 代表算法 | 优缺点 |
| --- | --- | --- | --- |
| 基于词 | 按空格/标点切分 | 朴素分词 | 遇到生僻词就废了，只能标 UNK |
| 基于字符 | 每个字符一个 Token | Char-level | 词汇表极小，但序列太长 |
| 基于子词 | 常用词保留，生僻词拆成子词 | **BPE**、WordPiece、SentencePiece | 当前主流，平衡了词汇表大小和覆盖度 |

**BPE（Byte Pair Encoding）** 是当前最主流的分词算法，它的思想极其简单：

1.  初始时，把每个字符当作一个 Token
    
2.  统计所有相邻 Token 对的出现频率
    
3.  把出现最多的那对 Token 合并成一个新 Token
    
4.  重复 2-3 步，直到词汇表达到预设大小
    

举个例子：假设语料里 "low" 出现 5 次、"lower" 出现 2 次，BPE 会先把 "l" 和 "o" 合并成 "lo"，再把 "lo" 和 "w" 合并成 "low"，但不会把 "low" 和 "er" 合并，因为 "low" 出现的频率足够高，没必要再拆 <sup>[6]</sup>。

**编码器（Encoder）：把输入"读懂"成语义向量**

编码器的使命是把一串 Token 变成一组**富含上下文信息的向量**。关键在于"上下文"三个字，在 Transformer 的编码器中，每个 Token 的向量不是孤立的，而是"看过"了整句话所有其他 Token 之后才生成的。

这背后的核心机制是 **Self-Attention（自注意力）**：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

简单来说，对于句子里的每个词，Self-Attention 会计算它和句子里所有其他词的"相关度"（通过 $Q$ 和 $K$ 的点积），然后按照相关度加权汇总所有词的信息（$V$），形成这个词的"上下文感知表示" <sup>[7]</sup>。

比如句子"我爱北京天安门"中，当编码器处理"北京"这个词时，它会同时看到前面的"我爱"和后面的"天安门"，因此它生成的向量既知道"北京"本身的意思，也融入了"谁爱"和"爱的是什么"的上下文信息。

**解码器（Decoder）：基于编码器的输出，逐步生成新内容**

解码器的工作方式和编码器有一个**核心区别**：它是**自回归的（Autoregressive）**，每生成一个 Token，就把它加入到已有的序列中，然后基于整个已有序列来生成下一个 Token。

为了实现这一点，解码器使用了一种叫 **Causal Mask（因果掩码）** 的技术：在计算注意力时，每个位置只能"看到"它前面的 Token，看不到后面的，毕竟，你不可能在写作文的时候参考你还没写出来的内容。

$$
\text{Masked Attention}: \quad \text{score}_{i,j} = \begin{cases} Q_i \cdot K_j^T, & j \leq i \\ -\infty, & j > i \end{cases}
$$

解码器还会用 **Cross-Attention** 去"查看"编码器的输出，从而知道"原文说了什么"，然后据此生成目标文本。

这三个模块的组合方式，直接决定了后续大模型的两大流派。

### 1.4 从BERT到GPT的分水岭

2017 年，Google 发表了《Attention Is All You Need》<sup>[7]</sup>，提出了 Transformer 架构，它同时包含编码器和解码器，最初是为机器翻译设计的。但随后的两年里，学术界迅速"分家"了：有人只拿编码器，有人只拿解码器，走出了两条完全不同的路。

**BERT：Encoder-Only 路线，"填空式学习"**

2018 年，Google 的 Devlin 等人提出了 BERT（Bidirectional Encoder Representations from Transformers）<sup>[8]</sup>。BERT 只用了 Transformer 的编码器部分，它的预训练方式非常直觉：**随机遮住句子中的某些词，让模型根据上下文把它们填回来**（Masked Language Modeling, MLM）。

比如原始句子是"我今天去了[BASK]京故宫"，模型需要根据"我今天去了"和"京故宫"来推断被遮住的是"北"字。

这个训练方式有一个巨大的优势：**双向上下文**。模型在处理每个词时，能同时看到它前面和后面的所有词，因此它对语言的理解特别"全面"。BERT 在文本分类、情感分析、命名实体识别等**判别式任务**上表现极其出色，一度成为 NLP 的"万金油"。

但 BERT 有一个本质局限：**它不擅长生成**。因为它的训练方式是"填空"，它学会了理解语言，但没有学会从左到右逐词生成语言。

**GPT：Decoder-Only 路线，"接龙式学习"**

差不多同一时间（2018 年），OpenAI 提出了 GPT（Generative Pre-trained Transformer）<sup>[9]</sup>。GPT 只用了 Transformer 的解码器部分，它的预训练方式更简单粗暴：**给一段文本，预测下一个词是什么**（Next Token Prediction）。

比如输入"我今天去了北京"，模型需要预测下一个词，可能是"故宫"、"烤鸭"、"旅游"等。然后把预测出的词拼接到输入后面，继续预测再下一个词，如此循环。

GPT 在早期并没有引起太大轰动，因为模型太小，生成的文本质量也一般。但 OpenAI 坚持了一条关键路线：**不断放大模型规模**。当 GPT-3 以 1750 亿参数的体量出现时，它展现出了令人震惊的 **In-Context Learning** 能力，只要给几个示例（Few-Shot Prompt），它就能理解你的意图并完成任务 <sup>[10]</sup>。

**分水岭的本质：为什么 Decoder-Only 赢了？**

从今天的视角回头看，GPT 路线胜出有几个关键原因：

1.  **生成能力是刚需**。双向理解固然重要，但 AI 应用最终需要"输出"。写文章、写代码、回答问题，而Decoder 天然就是为了生成而设计的。
    
2.  **规模效应（Scaling Laws）**。2020 年，OpenAI 和 DeepMind 的研究表明：模型性能与参数量、数据量、计算量之间存在可预测的幂律关系 <sup>[11]</sup>。Decoder-Only 架构结构简单、容易并行，特别适合"堆规模"。
    
3.  **统一的任务范式**。BERT 的每个下游任务需要一个专门的分类头，而 GPT 可以把所有任务都统一成"文本生成"。分类是生成标签文本，翻译是生成目标语言，写代码是生成代码。**一个模型，一个接口，解决所有问题。**
    

从 BERT 到 GPT 的分水岭，本质上是**"理解"和"生成"两条路线的抉择**。历史证明，在大规模预训练的时代，"生成"是更具扩展性的选择，而当今所有主流大模型都站在 GPT 的肩膀上。

## 雕刻纹理：当下的大模型长什么样

如果说第一章是"回顾历史"，这一章就是"看看现在"。我们以 DeepSeek 的迭代为主线，看看一个大模型从 V3 到 V4 到底经历了哪些架构进化，再拉高视角看看 2025-2026 年间 LLM 领域的整体变化趋势。

### 2.1 以DeepSeek-V3为例的上一代大模型框架解读

DeepSeek-V3 发布于 2024 年 12 月，它代表了"上一代大模型"的巅峰架构。理解 V3，是理解后续所有进化的基础。

#### 基本参数

DeepSeek-V3 是一个 **MoE（Mixture of Experts，混合专家）** 模型：总参数量 671B，但每次推理只激活其中 37B 参数 <sup>[12]</sup>。这个设计极大地降低了推理成本，你不需要每次都让所有 671B 参数都参与计算，只需要让"最懂当前问题"的 37B 参数出来干活。

#### MoE 的工作原理

![image.png](/sharing/images/moe-architecture.png)

传统的 Dense 模型每个 Token 都会经过所有参数。而 MoE 模型把每一层的前馈层（FFN）替换成了多个"专家"（Experts），用一个**路由器（Router）** 来决定每个 Token 交给哪几个专家处理：

输入 Token → Router → 选出 Top-K 个专家 → 各专家分别处理 → 加权求和 → 输出

DeepSeek-V3 用的是 **DeepSeekMoE** 架构 <sup>[13]</sup>，它的两个关键改进：

*   **细粒度专家**：而是 256 个路由专家 + 1 个共享专家，路由粒度更细
    
*   **辅助损失平衡**：为了防止所有 Token 都涌向少数几个热门专家，引入了辅助损失来均衡负载
    

#### MLA：Multi-head Latent Attention

![image.png](/sharing/images/mla-vs-mha.png)

这是 DeepSeek-V3 的另一个标志性创新。传统的 Multi-Head Attention（MHA）需要为每个注意力头存储独立的 Key 和 Value 向量，在推理时会占用大量 KV Cache 内存。

MLA 的思路是：**把 K 和 V 压缩到低维的潜在向量（Latent Vector），推理时再解压**。具体来说：

$$
c_t = W_{DKV} h_t \quad \text{(压缩：隐藏维度 → 低维潜在向量)} \\ K_t = W_{UK} c_t, \quad V_t = W_{UV} c_t \quad \text{(解压：低维 → 完整 K/V)}
$$

这使得 KV Cache 的大小从 $O(n \cdot h \cdot d)$ 降低到 $O(n \cdot c)$，其中 $c \ll h \cdot d$。在 DeepSeek-V3 中，这个压缩比大约能让 KV Cache 缩小 **5-13 倍**，对长文本推理至关重要 <sup>[12]</sup>。

#### 训练流水线

DeepSeek-V3 的训练分为三个阶段：

1.  **预训练（Pre-training）**：在 14.8T Token 上训练，数据来自互联网文本、书籍、代码等，不经过严格过滤。这一阶段让模型学会语言的基本规律和广泛的通用知识。
    
2.  **监督微调（SFT, Supervised Fine-Tuning）**：用人工标注的高质量对话数据来"教会"模型如何按照人类期望的方式回答问题。
    
3.  **RLHF（Reinforcement Learning from Human Feedback）**：通过人类偏好反馈进一步对齐模型的输出，让它的回答更有帮助、更安全、更诚实。
    

### 2.2 从2025年3月到2026年6月LLM发生了哪些变化

从 DeepSeek-V3 发布到现在（2026 年 6 月），大约 18 个月的时间里，大模型架构经历了密集的迭代。下面我以 DeepSeek 的进化为主轴，穿插其他模型的关键变化，梳理这段时间的技术脉络。

#### 第一阶段：推理能力的觉醒（2025.01-2025.05）

**DeepSeek-R1（2025年1月）** 是国内第一个引起轰动的"推理模型"。它的核心创新是**训练方式**：

*   **R1-Zero**：完全跳过 SFT，直接在 V3 基座上做大规模强化学习（RL），让模型通过"试错"自己学会推理。结果令人惊讶，模型自发学会了 **Chain-of-Thought（思维链）**，会一步步地推理而不需要人类教它怎么推理 <sup>[14]</sup>。
    
*   **R1（完整版）**：在 R1-Zero 的基础上，加入了数千条"冷启动"数据来引导 RL 的探索方向，然后进行多阶段训练：冷启动 SFT → RL → 拒绝采样 → 再 SFT → 再 RL。
    

这一阶段的发现是，**推理能力不是由SFT独立完成，而是需要SFT配合RL共同训练**。这一发现直接影响了后续所有模型的后训练策略。

#### 第二阶段：架构瘦身与效率革命（2025.05-2025.12）

**V3-0324 到 V3.1（2025年）**：V3.1 将 V3 线和 R1 线合并为一个 671B 的混合模型，核心创新是**可以在"快速回答"和"深度推理"之间切换**，只需修改 Chat Template 就能控制模型是直接回答还是先推理再回答 <sup>[12]</sup>。此外还引入了 **CoT 压缩训练**，让模型在推理时减少冗余的"思考 Token"。

**V3.2 系列（2025 年末）**：这一版本引入了两个重大变化：

*   **DeepSeek Sparse Attention（DSA）**：对长文本的注意力计算进行稀疏化，不再让每个 Token 都关注所有其他 Token，而是有选择地关注最相关的部分。
    
*   **大规模 Agent 训练生态**：V3.2 投入了超过预训练算力 10% 的资源在 RL 训练上，并构建了完整的 Agent 训练体系 <sup>[12]</sup>。
    

**同期其他模型的关键创新**：

| 创新点 | 代表模型 | 核心思路 |
| --- | --- | --- |
| 极端稀疏 MoE | ZAYA1 | 每个 Token 只激活 1 个路由专家 |
| 跨层 KV 共享 | Gemma | 多个解码层复用同一层的 K/V，降低内存 |
| Per-Layer Embeddings | Gemma | 每层独立的 Token 嵌入，低成本增加模型容量 |
| 层级注意力预算 | Laguna | 不同层分配不同数量的注意力头，动态调整计算量 |
| 压缩卷积注意力（CCA） | ZAYA1 | 在压缩的潜在空间中直接做注意力 + 卷积混合 |

#### 第三阶段：百万上下文的架构飞跃（2026.01-2026.06）

**DeepSeek-V4（2026 年 4 月）** 是这一阶段的标志性事件，也是目前为止架构变化最大的开源大模型。它有两个版本：V4-Pro（1.6T）和 V4-Flash（284B），原生支持 **100 万 Token 的上下文窗口** <sup>[12]</sup><sup>[15]</sup>。

V4 的核心架构创新有三个：

**1. 混合注意力系统：CSA + HCA**

V4 放弃了传统的"每层都做完整 Self-Attention"的设计，引入了两种互补的注意力机制并在层间交替使用：

*   **CSA（Compressed Sparse Attention，压缩稀疏注意力）**：把小段 Token 压缩成摘要表示，后续 Token 只关注最相关的 Top-K 个摘要，实现"精准但高效"的局部关注。
    
*   **HCA（Heavily Compressed Attention，重度压缩注意力）**：把大段 Token（每 128 个 Token 压缩为 1 个表示）极度压缩，提供"廉价但全局"的宏观视野。
    

两者交替使用，让模型在1M的上下文中，**推理算力只需要 V3.2 的 27%，KV Cache 只需要 10%** <sup>[15]</sup>。

**2. 流形约束超连接（mHC, Manifold-constrained Hyper-Connections）**

传统 Transformer 用一条"残差流"在层间传递信息。V4 把它替换为**多条并行的残差流**，并施加双随机数学约束来保证信息在各流之间的稳定重分配。这让信息在超深网络中的流动更加高效和稳定 <sup>[15]</sup>。

#### 全局视角：2025-2026 LLM 变化的五大趋势

1.  **从"训得好"到"用得省"**：MoE 稀疏化、注意力压缩、KV Cache 优化成为标配。模型不再追求参数量的简单堆叠，而是在效率和能力之间找到最优平衡点。
    
2.  **强化学习成为标配后训练手段**：R1 的成功证明了 RL 对推理能力的价值，后续所有主流模型都加入了 RL 训练阶段，甚至出现了"RL 预算超过预训练"的趋势。
    
3.  **长上下文从"特性"变成"基础设施"**：1M上下文不再是宣传卖点，而是模型的底层能力，专为代码仓库分析、多文档推理、Agent 记忆等场景优化。
    
4.  **模型开始"分化"：推理模型 vs 通用模型 vs Agent 模型**：同一个基座模型可以衍生出不同的专长版本，训练流水线的模块化让"定制模型"变得更容易。
    
5.  **架构创新进入"组合拳"时代**：单一创新（如单独的MoE、MLA）已经不够了，V4 代表了"MoE + 混合注意力 + 多残差流 + 灵活推理"的系统性设计思路，未来的大模型竞争，是整体架构设计的竞争。
    

## 持续迭代：我的「用AI学AI」工作流

**开源节流**

### 3.1 开信息源

在AI时代，信息鱼龙混杂，相信大家也经常在各个科技公众号、论文分享中看到纯AI的垃圾内容，想看优质干货又需要自己花时间去搜集、检索和筛选，会占用自己不少时间和精力；随着时间累积，每当新技术、新产品出现，我们总是要重新追踪、挖掘和筛选，信息差不断拉大，最后疲于"技术奔命"。因此，开拓自己的一套信息源在这个时代极为重要，下面我分享我自用的不同维度信息源：

*   个人博客（较高筛选难度，但是质量较高且稳定）
    
    *   [阮一峰科技爱好者周刊](https://www.ruanyifeng.com/blog/2026/06/weekly-issue-399.html)，阮一峰 科技爱好者周刊，"新闻周刊跟热点"
        
    *   [Sebastian Raschka](https://magazine.sebastianraschka.com/?utm_campaign=profile_chips)，国外科普博主，Learning LLM from Scratch作者
        
    *   [OpenLLMAI](https://www.zhihu.com/people/hai-tan-shang-chong-hua-47/posts)，知乎博客，分享LLM架构知识
        
    *   [lilian](https://lilianweng.github.io/)，系统梳理通俗易懂、深入浅出
        
    *   [ShowMeAI](https://www.zhihu.com/people/show-me-ai/posts)，建议搭配公众号食用
        
*   微信公众号
    
    *   御三家：机器之心、量子位、新智元，标题党居多，机器之心相对好一些
        
    *   NLP：JioNLP、刘聪NLP，一些自然语言处理的技术贴
        
*   官方博客或海外信息源：
    
    *   [https://news.mit.edu/](https://news.mit.edu/)，国内科技自媒体的上游信息源
        
    *   [https://hub.baai.ac.cn/view/24040](https://hub.baai.ac.cn/view/24040)，各类科技前沿的创始人、博主等
        
    *   [https://datawhalechina.github.io/diy-llm/](https://datawhalechina.github.io/diy-llm/)，斯坦福cs336的汉化进阶
        
    *   [https://www.bentoml.com/blog](https://www.bentoml.com/blog)，Bento团队的官方博客，更新速度快
        

### 3.2 节思维流

有了信息源之后，下一个问题是：**每天这么多新内容，我怎么消化？**

如果纯靠人肉一篇篇读、一个个仓库翻，一天下来能看的东西很有限。我的策略是**用AI帮AI做第一轮筛选和预处理**，把"搜索-筛选-阅读"这条链路里最费时间的环节交给工具，自己只负责最后的"判断和吸收"。目前主要依赖两个自建工具：**Ascan（每日科技日报 Agent）** 和 **Learn-art Skill（深度学习报告生成器）**，并整理成便于回顾的日报归档。

#### Ascan：每天08:30自动送到桌面的科技日报

Ascan 是我自建的一个 AI Agent 工作流，核心定位就一句话：**让 AI 每天帮我扫一遍 arXiv 和 GitHub，把值得看的东西挑出来，生成一份 Notion 风格的 HTML 日报**。

它的整体架构是一个多阶段 Pipeline：

```
arXiv API / GitHub API
       ↓
  FetchStage（抓取论文/仓库列表）
       ↓
  ParseStage（解析元数据，arXiv 支持多分类去重）
       ↓
  ScoreStage（多维度评分：关键词 +30、次要词 +8、机构匹配 +15）
       ↓
  AnalyzeStage（LLM 翻译摘要 / 深度分析 GitHub 仓库）
       ↓
  GenerateReportStage → Ascan-YYYYMMDD.html + .md
```

主题配置可以围绕若干长期关注方向展开，每个方向设置独立的关键词、权重和筛选阈值：

| 方向 | 关注问题 | 举例关键词 |
| --- | --- | --- |
| 大模型算法 | 训练、推理、对齐、评测 | reasoning, alignment, scaling law |
| Agent 算法 | 工具调用、规划、反思、协作 | tool use, planning, multi-agent |
| 智能体架构 | 记忆、状态、编排、执行环境 | memory, orchestration, workflow |
| 智能体记忆 | 长上下文、检索增强、个性化 | long context, RAG, personalization |
| 大模型前沿 | 新模型、新架构、新评测 | MoE, sparse attention, benchmark |

arXiv、GitHub、官方博客、独立博客和会议论文可以作为不同层次的信息源：论文负责“理论增量”，仓库负责“工程趋势”，博客负责“解释框架”，官方动态负责“产品和研究方向”。

**几个我觉得比较重要的工程细节**：

1. **定时自主运行**：用本地定时任务按工作日自动生成日报，失败时重试，避免每天手动触发。

2. **LLM 并发加速**：分析阶段通过可配置的 LLM 服务和并发控制加速摘要、翻译和项目解读。

3. **双格式输出**：同时生成 HTML 和 Markdown，HTML 用于阅读归档，Markdown 便于二次编辑和迁移。

4. **评分系统可解释**：每篇论文或项目都保留推荐原因，避免日报变成不可解释的“黑盒列表”。


#### Learn-art Skill：把仓库和论文变成一篇可自测的学习报告

Ascan 解决的是"每天看什么"的问题，但当你真的看到一篇感兴趣的论文或一个想深入的仓库时，**怎么高效地吃透它？** 这就是 Learn-art 的用途。

Learn-art 是我自建的一套深度学习报告生成流程，它能把任意 **GitHub 仓库**或**论文**（arXiv 链接、PDF、Markdown）转换成一篇**单文件、离线可读的中文交互式 HTML 学习报告**。不是简单的摘要或翻译，而是一份按照固定 12 章节结构深入拆解的学习材料：

| 章节 | 内容 | 说明 |
| --- | --- | --- |
| 1. 一句话理解 | ≤80 字概括"它是什么" | 先建立第一印象 |
| 2. 项目/论文卡片 | 元信息表格 | stars、机构、年份、PDF 链接等 |
| 3. 为什么存在 | 解决什么问题、以前为什么不够 | 定位动机 |
| 4. 架构/论文骨架 | **Mermaid 架构图** | 必须有一张图把模块关系画清楚 |
| 5. 核心抽象拆解 | 3-7 个关键概念 | 每个概念：定义 + 心智模型 + 为什么需要它 |
| 6. 关键代码/公式 + 大白话 | 代码和中文解释双栏对照 | 至少 3 组，左侧代码右侧"人话翻译" |
| 7. 端到端流程 | **Mermaid sequenceDiagram** | 选一个 happy-path 从入口追到底层 |
| 8. 心智模型 | ≥2 个类比/比喻 | 帮助建立直觉，比如"Attention 像查字典" |
| 9. 常见误区 | 3-5 条"看起来对其实不对"的认知陷阱 | 红色左边框高亮提醒 |
| 10. 学习路径 | 5-8 步递进式学习计划 | 每步给出目标、推荐资源、大概耗时 |
| 11. 自测题 | 5-10 道可展开答案的题 | 考"理解"而非"记忆"，问的是"为什么/如果改 X 会怎样" |
| 12. 延伸阅读 | 关键文件清单或参考文献 | 给后续深入留入口 |

输出物是一个单文件 HTML，CSS/JS 全部内嵌，支持 Mermaid 图表渲染、代码阅读和离线打开。设计上走“温暖的纸感”风格，米白底色配暖橘强调色，长时间阅读不累眼。

**对仓库和论文的分析策略不同**：

*   **仓库**：先 `ls -la` + README 做结构鸟瞰，再用 `grep` 统计声明频次提取 3-7 个核心抽象，然后选一个最有代表性的调用链画 sequenceDiagram，最后按"先理解依赖再理解使用者"排出学习路径。大型仓库（>500 文件）不硬扫，以 README 为地图按需深入。

*   **论文**：先抽 Abstract/Method/Experiments 的骨架，把方法翻译成"输入 → 关键变换 → 输出"的三步式表达，公式拆成"输入是什么 → 干了什么 → 输出是什么"三句中文，实验部分挑 3-5 个最有说服力的数字，标注和谁比、提升多少。


这类报告适合用于沉淀“值得反复看的材料”：例如一篇重要论文、一个关键开源仓库，或一份官方技术文档。真正有价值的不是一次性摘要，而是把材料拆成可复习、可测试、可延展的知识骨架。

## 写在最后

回过头看这篇文档的三章，其实对应的是三个递进的问题：**"LLM从哪来"、"LLM现在长什么样"、"我怎么跟上它"**。

第一章从线性回归一路串到GPT，不是为了让你记住每个公式，而是希望你看到一条主线：**每一个新技术的出现，都是在解上一代留下的具体问题**。感知机搞不定非线性，就加层；MLP处理不了序列，就引入Transformer；BERT只会理解不会生成，GPT就换了解码器。理解了这条因果链，后面再出现什么新架构，你都能快速定位它在"补谁的短板"。

第二章聚焦当下，从DeepSeek-V3到V4的18个月迭代里，我们看到大模型已经从"堆参数"进入了"精打细算"的阶段：MoE让参数按需激活，MLA让显存压缩数倍，混合注意力让百万上下文变得可用。这些不是论文里的抽象概念，而是你每天用的模型背后正在发生的工程变革。

第三章是我自己的工作流分享。信息源和工作流是私人的，但"开源节流"的思路是通用的：**与其被动追赶每一篇推文、每一个热点，不如主动搭建一套适合自己的信息过滤和知识沉淀体系**。AI时代最不缺的就是信息，最缺的是把信息变成自己认知的能力。

最后想说一句：这篇文档的标题叫"从0.5到1"，而不是"从0到1"。因为在AI这个领域，没有人真正从0开始，大家多少都有一些直觉和碎片化的认知。这篇文档想做的，就是帮你把那些散落的0.5拼成一个相对完整的1，让你在面对下一篇论文、下一个新模型时，有一个可以挂靠的知识骨架。

至于1到10的部分，交给时间去迭代。共勉。

---

## 参考文献

<sup>[1]</sup> 吴恩达，_Machine Learning_，Coursera/Stanford，2022. https://kyonhuang.top/Andrew-Ng-Machine-Learning-notes/#/week1

<sup>[2]</sup> 吴恩达，_Deep Learning Specialization - Neural Networks and Deep Learning_，Coursera，2017. https://kyonhuang.top/Andrew-Ng-Deep-Learning-notes/#/Neural\_Networks\_and\_Deep\_Learning/神经网络基础

<sup>[3]</sup> Minsky, M. & Papert, S., _Perceptrons: An Introduction to Computational Geometry_, MIT Press, 1969.

<sup>[4]</sup> Rumelhart, D., Hinton, G. & Williams, R., "Learning representations by back-propagating errors", _Nature_, 1986.

<sup>[5]</sup> Nair, V. & Hinton, G., "Rectified Linear Units Improve Restricted Boltzmann Machines", _ICML_, 2010.

<sup>[6]</sup> Datawhale, _DIY-LLM: 分词器原理与 BPE 实现_. https://datawhalechina.github.io/diy-llm/

<sup>[7]</sup> Vaswani, A. et al., "Attention Is All You Need", _NeurIPS_, 2017. https://arxiv.org/abs/1706.03762

<sup>[8]</sup> Devlin, J. et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding", _NAACL_, 2019. https://arxiv.org/abs/1810.04805

<sup>[9]</sup> Radford, A. et al., "Improving Language Understanding by Generative Pre-Training", OpenAI, 2018.

<sup>[10]</sup> Brown, T. et al., "Language Models are Few-Shot Learners", _NeurIPS_, 2020. https://arxiv.org/abs/2005.14165

<sup>[11]</sup> Kaplan, J. et al., "Scaling Laws for Neural Language Models", OpenAI, 2020. https://arxiv.org/abs/2001.08361

<sup>[12]</sup> BentoML, "The Complete Guide to DeepSeek Models: From V3 to R1 and Beyond", 2026. https://www.bentoml.com/blog/the-complete-guide-to-deepseek-models-from-v3-to-r1-and-beyond

<sup>[13]</sup> Dai, D. et al., "DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models", 2024. https://arxiv.org/abs/2401.06066

<sup>[14]</sup> Guo, D. et al., "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning", 2025. https://arxiv.org/abs/2501.12948

<sup>[15]</sup> Sebastian Raschka, "Recent Developments in LLM Architectures", 2026. https://magazine.sebastianraschka.com/p/recent-developments-in-llm-architectures
