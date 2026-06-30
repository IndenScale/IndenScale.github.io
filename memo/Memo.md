# Thesis Memo：EaC 是 AI 与物理世界工程之间缺失的表征层

## 一句话

**Engineering as Code（EaC）是 AI 与 Hardware-world Engineering（HWE）之间缺失的表征层。**

SWE 之所以率先被 AI 改造，不是因为软件更简单，而是因为软件天然是 code-native：设计对象、执行对象、测试对象和版本对象高度统一。AI 生成代码后，可以直接进入编译、测试、部署和反馈闭环。

HWE 则大多仍是 file-native、tool-native 和 expert-native。工程事实分散在 CAD/CAE/BIM/EDA/CAM 文件、图纸、BOM、规范、PPT、Excel、PLM、MES、供应链系统和专家经验中。AI 即使理解工程知识，也很难直接操作工程本身。

因此，HWE 的 AI 化首先不是模型问题，而是表征问题。

> 没有 EaC，AI 只能围绕工程文件工作；有了 EaC，AI 才能直接操作工程本身。

## 核心判断

### 1. HWE 是 SWE 之外的人造物工程

HWE 指 SWE 之外，人类为了确定目的而进行的造物工程活动，包括 IC、AEC、机械、车辆、能源、石化、机器人、先进制造、材料工程、合成生物、航空航天、医疗设备和基础设施等。

这些领域的共同点不是“硬件”，而是它们都必须在物理、制造、成本、法规、供应链、运维和责任约束下交付可验证、可制造、可运营、可负责、且经济上成立的人造物。

### 2. Atom lag 来自工程闭环尚未代码化

AI 从 bits 世界进入 atoms 世界时会遭遇 **atom lag**。它不是单一瓶颈，而是五类滞后的叠加：

- representation lag：工程事实没有统一、开放、可执行的表征。
- verification lag：验证、仿真和测试成本高，闭环慢。
- data lag：高价值工程数据多在企业内部，且难以直接训练。
- feedback lag：从设计到制造、检测、运维的反馈链条长。
- liability lag：工程结果需要承担安全、合规和经济责任。

EaC 的作用，就是系统性缩短 atom lag。

### 3. EaC 是 HWE 的源事实层

EaC 不是“用代码画 CAD”，也不是普通 DSL。它指使用开放、声明式、可执行的代码描述工程设计，并用这套代码驱动约束检查、仿真验证、制图、制造输出和审计。

它把 HWE 的源事实从分散文件迁移到：

- design code
- constraints
- simulation pipeline
- verification checks
- manufacturing outputs
- audit trail

EaC 的本质是把工程从文件、模型和经验驱动，转变为代码、约束和验证闭环驱动。

### 4. Engineering 会从 minor domain 变成 major domain

今天的 HWE 对 AI 来说仍接近 minor domain，因为公开数据大多是静态文本、图纸、模型和封闭文件，缺少可执行的设计轨迹。

一旦 HWE 完成 as Code，Engineering 会成为类似 Code、Math、Search 的基础能力域。原因是 EaC 数据不是普通行业语料，而是高密度行为数据：

```text
需求 -> 设计代码 -> 约束 -> 仿真设置 -> 仿真结果
-> 失败报告 -> 修复 patch -> 制造输出 -> 检测反馈
```

这类数据会训练模型获得约束满足、多目标优化、物理推理、工具编排、失败诊断、设计修复和制造可行性判断等跨领域能力。

### 5. IC 是领先案例

IC 是 HWE 中最 software-like 的领域。HDL/RTL、testbench、EDA flow、timing constraint、DRC/LVS、formal verification、simulation、synthesis、place and route、signoff 已经构成了部分 EaC 化的闭环。

IC 不是偶然领先，而是因为它最早具备代码化表征、形式化约束、自动化工具链、仿真验证闭环、层级抽象和版本化流程。其他 HWE 领域若要缩短 atom lag，也会朝 code-native、constraint-native、verification-native 方向演进。

### 6. HWE Agent 是高推理负载、高 ARPU 市场

General Purpose Agent 用户最多，但单任务价值低。SWE Agent 用户较少，但 ROI 清晰、付费意愿强。HWE Agent 用户可能最少，却拥有最高单任务价值、最长推理链和最重工具调用。

HWE Agent 不只是生成设计，而要检查约束、调用仿真、诊断失败、修改设计、多目标优化、生成制造输出并记录审计链。它消耗的不只是 LLM token，还包括 CAD kernel、mesh generation、FEA、CFD、SPICE、EDA、CAM、optimization loop 和 manufacturing simulation。

> General wins users; SWE wins early revenue; HWE wins high-value compute.

### 7. HWE 会形成私有主线和公共盗火线

HWE 的最高价值数据通常在行业巨头内部，例如 PDK、design rules、yield learning、process window、设备漂移、工艺 recipe、客户失败案例和 signoff 数据。最强工程智能很可能首先出现在私有模型、合资公司和受控训练联盟中。

但另一条路线同样重要：公共盗火线。它通过仿真器、求解器、开源工业软件、可复现实验、公共 benchmark 和低敏产线数据共享，把 HWE know-how 转化为公共 AI 训练资产。

私有线决定最高端工业能力的上限；公共线决定工程智能扩散的速度和社会创新的广度。

### 8. EaC 与 Physical AI 分工不同

Physical AI、world model、VLA、WAM 等路线解决的是 AI 如何在物理世界中感知、预测和行动。

EaC 解决的是 AI 如何在工程约束下设计、验证、制造和负责地交付人造物。

简写：

```text
Physical AI：如何行动
EaC / HWE：应该造什么，怎样证明它能造且值得造
```

最终强系统会是 hybrid：EaC 提供显式设计、约束和制造意图，白盒求解器提供可信验证，world model 提供快速预测，Physical AI 负责制造、实验、检测和现实反馈，Agent 编排整个闭环。

## 可验证预测

如果 EaC 范式成立，应该看到这些信号：

- 工程设计开始 repo 化。
- 约束检查成为日常流程。
- 仿真进入 CI。
- AI Agent 输出 design patch，而不只是报告或图纸。
- 公共工程 benchmark 和失败-修复数据集出现。
- 工业私有模型围绕工程闭环训练。
- CAD/CAE/EDA/BIM/PLM 厂商争夺源事实层。
- 客户愿意为高推理负载 HWE Agent 付费。

如果这些信号长期没有出现，EaC thesis 需要修正。

## 最终命题

SWE 的成功来自软件天然 as Code。HWE 的滞后来自物理世界尚未 as Code。

EaC 的使命是把 HWE 的设计、约束、验证、制造和反馈迁移到可计算、可执行、可审计的代码层。

如果 EaC 成立，AI 将不再只是工程师的助手，而会成为工程设计闭环中的主动参与者。
