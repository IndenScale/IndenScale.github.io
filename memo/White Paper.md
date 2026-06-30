# White Paper：Engineering as Code 与 HWE Agent

## 摘要

**Engineering as Code（EaC）是 AI 与 Hardware-world Engineering（HWE）之间缺失的表征层。**

AI 已经深度进入软件工程，但仍难以真正进入多数物理世界工程。差别不在于软件简单、硬件复杂，而在于软件天然是 code-native：设计对象、执行对象、测试对象和版本对象高度统一。AI 生成代码后，可以直接进入编译、测试、部署和反馈闭环。

多数 HWE 不是 code-native。它的工程事实分散在 CAD/CAE/BIM/EDA/CAM 文件、图纸、BOM、规范、PPT、Excel、邮件、PLM、MES、供应链系统和专家经验中。AI 即使理解工程知识，也很难直接操作工程本身。

因此，HWE 的 AI 化不只是模型问题，而首先是表征问题。

> 没有 EaC，AI 只能围绕工程文件工作；有了 EaC，AI 才能直接操作工程本身。

EaC 指使用开放、声明式、可执行的代码描述工程设计，并用这套代码驱动验证、仿真、制图、制造输出和约束检查。它的目标不是“用代码画 CAD”，而是建立 HWE 的源事实层。

如果 EaC 成立，Engineering 会从 AI 的 minor domain 变成 major domain。HWE Agent 会成为高推理负载、高 ARPU 的重要市场。最强工程智能会沿着私有工业模型和公共盗火线两条路径同时发展。Physical AI 与 EaC 最终会合流，形成从设计到制造再到现实反馈的 AI-to-atoms 闭环。

## 1. HWE 是什么

HWE 指：

> SWE 之外，人类为了确定目的而进行的造物工程活动。

它区别于艺术创作，也区别于无意生成的物理结果。

HWE 包括：

```text
IC
AEC
ME
VE
石化
能源
机器人
先进制造
材料工程
合成生物
航空航天
医疗设备
基础设施
```

HWE 的共同特征不是“硬件”，而是：

```text
确定目的
物理约束
制造约束
成本约束
法规约束
供应链约束
运维约束
责任约束
```

HWE 的核心任务不是“生成一个东西”，而是在多重约束下创造一个可验证、可制造、可运营、可负责、且经济上成立的人造物。

这也是 HWE 与 AI4Science 的关键区别。AI4Science 的核心是 discovery，HWE/EaC 的核心是 artifact delivery。

```text
AI4Science = discovery frontier
HWE / EaC = artifact frontier
```

AI4Science 追求发现新规律、新材料、新分子、新机制。HWE/EaC 追求设计、验证、制造、运营、优化和负责。

## 2. EaC 是什么

EaC 指：

> 使用开放、声明式、可执行的代码描述工程设计，并用这套代码驱动验证、仿真、制图、制造输出和约束检查。

EaC 的目标不是“用代码画 CAD”，也不是在现有工业软件旁边增加一个漂亮的 DSL。EaC 的目标是建立 HWE 的源事实层。

传统 HWE 的源事实是分散的：

```text
图纸
CAD 模型
CAE 项目
BOM
规范文档
工艺文件
专家经验
PLM / MES / ERP 记录
```

EaC 试图把源事实迁移到：

```text
design code
constraints
simulation pipeline
verification checks
manufacturing outputs
audit trail
```

这会改变工程协作的中心。设计不再只是某个工具里的模型，而是一个可以被 diff、review、test、simulate、patch、replay 和 audit 的工程对象。

因此，EaC 的本质是：

> 把工程设计从文件、模型和经验驱动，转变为代码、约束和验证闭环驱动。

## 3. 为什么 AI 在 HWE 中滞后于 SWE：Atom Lag

AI 在 SWE 中率先爆发，不是因为软件更简单，而是因为 SWE 的对象天然适合 AI 操作。

SWE 具备：

```text
代码化表征
自动化测试
低成本验证
快速反馈
可回滚
开源数据
成熟工具链
```

HWE 缺少这些条件。

因此出现 **atom lag**：

> AI 从 bits 世界进入 atoms 世界时，由于表征、验证、反馈、数据和责任体系尚未代码化而造成的采用滞后。

Atom lag 可拆成五类：

```text
representation lag：表征滞后
verification lag：验证滞后
data lag：数据滞后
feedback lag：反馈滞后
liability lag：责任滞后
```

这些滞后相互强化。没有代码化表征，AI 很难产生可验证的 design patch；没有自动验证，失败无法形成高质量训练数据；没有训练数据，模型无法学会工程 trade-off；没有可审计链条，组织也不敢把 Agent 放入关键工程流程。

EaC 的作用，就是系统性缩短 atom lag。

## 4. Engineering 将成为 AI 的 Major Domain

当前 HWE 对 AI 来说仍接近 minor domain，因为工程数据大多是静态文本、图纸、模型和封闭文件，缺少可执行设计轨迹。

但一旦 HWE 完成 as Code，Engineering 会成为 major domain。

原因是 HWE/EaC 数据不是普通行业语料，而是高密度行为数据：

```text
需求
-> 设计代码
-> 约束
-> 仿真设置
-> 仿真结果
-> 失败报告
-> 修复 patch
-> 制造输出
-> 检测反馈
```

这类数据会训练模型获得跨领域能力：

```text
约束满足
多目标优化
物理推理
工具编排
失败诊断
设计修复
制造可行性判断
工程 trade-off
```

如果 Code 数据让模型学会“如何改变软件并通过测试”，EaC 数据会让模型学会“如何改变人造物设计并通过工程验证”。

因此，EaC 成熟后，Engineering 不只是一个垂直行业，而会成为类似 Code、Math、Search 的基础能力域。

## 5. IC 是 HWE 中的领先案例

IC 是 HWE 中最接近 SWE 的分支。

它已经具备：

```text
HDL / RTL
testbench
EDA flow
timing constraint
DRC / LVS
formal verification
simulation
synthesis
place and route
signoff
```

因此，IC 已经部分完成 EaC 化。

IC 领先，不是偶然，而是因为它最早具备：

```text
代码化表征
形式化约束
自动化工具链
仿真验证闭环
层级抽象
版本化流程
```

结论：

> IC 是 HWE 中最 software-like 的领域，因此会最早出现 AI 深度采用。

这也说明：其他 HWE 领域若要缩短 atom lag，需要朝 code-native、constraint-native、verification-native 方向演进。

## 6. HWE 是 Private Major Domain

HWE 的最高价值数据通常不在公开互联网上，而在行业巨头内部。

例如芯片领域的关键数据包括：

```text
PDK
design rules
yield learning
process window
defect metrology
equipment drift
lithography recipe
EDA signoff data
customer tapeout failures
```

合成生物、航空航天、化工、先进制造也类似。

因此，HWE 很可能成为 **Private Major Domain**：

> 它对 AI 能力跃迁非常重要，但其最高价值数据不会充分进入通用模型训练，而会进入私有、联盟或合资模型体系。

未来可能出现：

```text
AI Lab + 行业巨头
-> 合资公司 / 私有模型 / 受控训练联盟
-> 使用私有闭环数据训练
-> 模型只在内部使用
-> 能力外溢被严格治理
```

这意味着：

> 最强工程智能可能不在通用模型中，而在行业私有模型中。

## 7. 公共盗火线是第二主线

与私有工业线并行，另一条路线是公共盗火线。

公共盗火线指：

> 通过仿真器、求解器、开源工业软件、可复现实验、公共 benchmark 和低敏产线数据共享，把 HWE know-how 转化为公共 AI 训练资产。

它的目标不是泄漏企业机密，而是扩大公共工程知识边界。

公共线会生产：

```text
开放设计库
开放约束库
开放仿真轨迹
开放失败-修复数据
开放工程 benchmark
开放 HWE Agent
开放工业模型
```

私有线决定最高端工业能力的上限。公共线决定工程智能扩散的速度和社会创新的广度。

结论：

> 如果没有公共盗火线，HWE AI 会成为少数巨头的生产率武器；如果公共盗火线成功，HWE AI 才可能成为类似开源软件一样的通用创新基础设施。

这两条线不是互相替代的关系。私有线负责把最敏感、最高价值、最靠近真实生产的 know-how 转化为受控能力；公共线负责把可公开、可复现、可验证的工程知识变成公共训练资产。前者决定能力上限，后者决定扩散速度。

## 8. HWE Agent 会是高推理负载、高 ARPU 市场

General Purpose Agent 用户最多，但单任务价值低。SWE Agent 用户较少，但需求强、ROI 清晰、付费意愿高。HWE Agent 用户最少，但单任务价值最高、推理链最长、工具调用最重。

HWE Agent 的工作不是简单生成，而是：

```text
生成设计
检查约束
调用仿真
诊断失败
修改设计
多目标优化
生成制造输出
记录审计链
```

HWE 的推理负载不仅包括 LLM token，还包括：

```text
CAD kernel
mesh generation
FEA
CFD
SPICE
EDA
CAM
optimization loop
constraint checking
manufacturing simulation
```

因此，HWE Agent 的用户规模可能只有 1% 到 5%，但推理负载和收入贡献可能远高于用户占比。

核心判断：

> General wins users; SWE wins early revenue; HWE wins high-value compute.

## 9. HWE 的可接受解空间比 SWE 更窄

大部分 SWE 任务处在 slack-rich 状态。

很多软件只需要：

```text
跑通
测试通过
性能不太差
体验可接受
维护成本可控
```

但 HWE 常常工作在物理和经济边界附近。

HWE 的优化直接影响：

```text
材料
重量
功耗
成本
良率
寿命
散热
安全裕度
制造节拍
盈亏平衡
```

因此，HWE 不是简单求“可接受”，而是在大量场景中求“盈亏边界上的最优”。

这产生 **Slack Compression Hypothesis**：

> 当一个工程领域进入成熟竞争阶段，材料、器件或单点技术进步带来的外部红利下降，企业会通过压缩设计 slack 获得性能、成本和体验优势；slack 越被压缩，抽象泄漏越严重，AI Agent 所需的推理与仿真算力越高。

压缩后的链条是：

```text
竞争压缩工程松弛
-> 抽象开始泄漏
-> 黑盒封装不足
-> 必须跨层联合优化
-> 仿真和推理循环增加
-> HWE Agent 吃掉更多算力
```

这也是 HWE Agent 的市场价值所在。它不是替代一个“画图的人”，而是帮助组织在复杂约束中找到更窄、更贵、更难验证的可行解。

## 10. Physical AI 不是 EaC 的替代品

Physical AI、world model、JEPA、VLA、WAM 等路线主要解决：

> AI 如何在物理世界中感知、预测和行动。

它们通常依赖隐式或半隐式世界模型：

```text
视觉
语言
状态
动作
latent world model
policy
control
```

EaC 解决的是另一个问题：

> AI 如何在工程约束下设计、验证、制造和负责地交付人造物。

两者分工不同：

```text
Physical AI：如何行动
EaC / HWE：应该造什么，怎样证明它能造且值得造
```

最终强系统会是 hybrid：

```text
EaC：显式设计、约束、验证、制造意图
白盒求解器：高可信仿真和验证
World model：快速预测和 surrogate simulation
VLA / Physical AI：制造、装配、实验、检测、现实反馈
Agent：编排整个闭环
```

因此：

> EaC 不是和 Physical AI 竞争，而是在填补 Physical AI 没有覆盖的工程表征层空白。

## 11. 与 AI Lab 认知的关系

AI Lab 大概率已经看到：

```text
AI4Science
robotics
physical AI
world models
coding agents
digital twins
industrial AI
```

但它们的公开叙事可能仍然把 HWE 粗略纳入 AI4Science、robotics 或 industrial AI。

本 thesis 的区别在于：

> HWE 不是 AI4Science 的附属领域，而是 AI4Engineering 的核心对象。

AI4Science 的核心是 discovery：

```text
发现新规律
发现新材料
发现新分子
发现新机制
```

HWE/EaC 的核心是 artifact delivery：

```text
设计
验证
制造
运营
优化
负责
```

简写：

```text
AI4Science = discovery frontier
HWE/EaC = artifact frontier
```

AI Lab 可能看到了“AI will enter the physical world”。

但本 thesis 强调：

> Physical-world engineering must become code-native before AI can truly design.

## 12. EaC 的战略位置

EaC 不是 CAD Copilot。CAD Copilot 主要提升人在既有工具中的操作效率，EaC 则试图改变工程源事实的组织方式。

EaC 不是简单 DSL。DSL 可以描述局部对象，EaC 要连接设计、约束、仿真、制造、反馈和审计。

EaC 也不是普通工业 SaaS。工业 SaaS 往往围绕流程、协同和数据管理展开，EaC 的位置更接近 AI-native engineering 的操作系统层。

EaC 的战略位置是：

> AI-native engineering 的源事实层。

它向上连接 AI 模型和 Agent。向下连接 CAD/CAE/CAM/EDA/BIM/PLM/MES 和生产设备。横向连接约束、仿真、制造、检测、运维和审计。

如果成立，EaC 会成为：

```text
design source-of-truth
constraint runtime
verification pipeline
manufacturing compiler
engineering memory
HWE Agent operating substrate
```

最终目标是：

> 把工程从文件中介的工作，转化为可计算的设计闭环。

## 13. 如果 thesis 成立，会产生什么影响

### 对 AI Lab

AI Lab 需要从“模型中心”转向“模型 + 工程表征 + 工具链 + 数据治理”组合。

真正高价值的 HWE 能力不会只来自通用预训练，而来自私有闭环数据和可验证工程轨迹。

### 对工业巨头

工业巨头会把 AI 作为 know-how 放大器。

它们不会轻易把数据交给通用模型，而会通过私有模型、JV、受控训练和能力防火墙保留数据主权。

### 对开源生态

公共盗火线可能成为 HWE 版开源软件革命。

开源工业软件、开放仿真、开放 benchmark 和开放设计库会显著降低工程创新门槛。

### 对工程师

工程师不会被简单替代，而会从手工设计者转向：

```text
目标定义者
约束编写者
Agent 审查者
trade-off 决策者
工程责任承担者
系统编排者
```

### 对工业软件

CAD/CAE/EDA/BIM/PLM 厂商将争夺 AI-native 工程源事实层。

传统文件中心工具会受到 code-native、agent-native、constraint-native 工作流挑战。

### 对经济

AI 将从信息生产力工具进一步进入物质生产力系统。

HWE/EaC 会影响制造、建筑、能源、交通、芯片、机器人、生物制造和基础设施。

## 14. 最小落地路径

EaC 不应一开始追求覆盖全部 HWE，而应从可闭环领域切入。

优先方向包括：

```text
参数化机械结构
PCB / 电子硬件
开源芯片 / 开源 EDA
机器人设计
实验室自动化
增材制造
散热与结构优化
```

最小闭环应包括：

```text
design code
constraint checker
simulation runner
repair agent
manufacturing/export backend
benchmark
```

早期产品的关键不是“生成一个设计”，而是证明：

```text
设计可代码化
约束可执行
仿真可自动化
失败可诊断
设计可修复
结果可制造
过程可审计
```

这意味着第一代 EaC 产品不应该追求覆盖所有工程类型，而应该在一个足够窄、足够可验证、足够可自动化的工程域里跑通闭环。只有闭环成立，设计 patch、失败报告、修复轨迹、制造输出和检测反馈才会变成可积累的数据资产。

## 15. 最重要的验证信号

如果 EaC 范式正在成立，应观察到：

```text
工程设计开始 repo 化
约束检查成为日常流程
仿真进入 CI
AI Agent 输出 design patch
工程 benchmark 出现
公共失败-修复数据集出现
工业私有模型围绕工程闭环训练
CAD/CAE/EDA 厂商争夺源事实层
客户愿意为高推理负载 HWE Agent 付费
```

如果长期没有这些信号，EaC 范式可能尚未成立，或者需要被修正为更窄的行业命题。

## 16. 关键预测

### 预测一

HWE 当前是 AI 的 minor domain，但 EaC 成熟后会成为 major domain。

### 预测二

IC 会是 HWE Agent 最早深度采用的领域，因为它已经最接近 EaC。

### 预测三

AI Lab 与行业巨头将形成私有工业模型、合资公司和受控训练联盟。

### 预测四

公共盗火线会成为第二主线，推动开放工程智能和低成本创新。

### 预测五

HWE Agent 用户少，但推理负载和收入贡献会显著高于用户占比。

### 预测六

HWE 的成熟竞争会压缩 slack，迫使跨层联合优化，从而显著增加 AI 推理和仿真算力需求。

### 预测七

Physical AI 会解决行动层，EaC 会解决设计与验证层，最终二者合流形成 AI-to-atoms 闭环。

## 17. 最终命题

**SWE 的成功来自软件天然 as Code。HWE 的滞后来自物理世界尚未 as Code。**

EaC 的使命是把 HWE 的设计、约束、验证、制造和反馈迁移到可计算、可执行、可审计的代码层。

如果 EaC 成立，AI 将不再只是工程师的助手，而会成为工程设计闭环中的主动参与者。

最终判断：

> Engineering as Code is the missing representation layer between AI and hardware-world engineering.

中文：

> EaC 是 AI 与物理世界工程之间缺失的表征层。

更短：

> 没有 EaC，AI 只能围绕工程文件工作；有了 EaC，AI 才能直接操作工程本身。
