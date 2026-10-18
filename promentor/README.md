# ProMentor 学习记录 · 两门课 + 学习笔记

用 [ProMentor](https://github.com/Lyn-77/ProMentor) 把**真实项目**变成"手写核心逻辑 → 跑行为测试 → AI Review"的课程。
已经打完两门（一门零基础课、一门语言速成），第三门（TypeScript 插件课）进行到 2/7。

课程数据（`.promentor/`：讲义、规格、测试、提交记录）按 ProMentor 约定**不入库**；这里放**我自己写的实现**和**我的学习笔记**。

## 进度总览

| 课程 | 语言 | 进度 | 说明 |
|---|---|---|---|
| `mini-todo`（零依赖命令行待办清单） | JavaScript | **7/7 ✅** | 63 条行为测试全绿，每章一次通过 |
| TypeScript 速成（为插件课铺路） | TypeScript | **✅ 完成** | 类型标注 / interface / readonly / import type |
| `promentor-dashboard-plugin`（DSH 插件源码：host 网关 + client 面板） | TypeScript | **2/7** | Ch0 11/11 ✅、Ch1 18/18 ✅，Ch2–Ch6 待做 |

## 目录

```
promentor/
├── mini-todo/     第一门课：7 章实现 + 可运行入口（main.js / package.json，零依赖）
├── dsh-plugin/    第三门课：已完成的两章实现（TypeScript）
├── ts-bridge/     TypeScript 速成练习
└── notes/         学习笔记（5 份）
```

### `mini-todo/` —— 第一门课（7/7）

| 章 | 内容 | 文件 | 状态 |
|---|---|---|---|
| ch00 | 你的第一个函数：把标题洗干净 | `ch00-title.js` | ✅ 100% |
| ch01 | 任务对象与列表 | `ch01-task.js` | ✅ 100% |
| ch02 | 改状态与删除 | `ch02-task.js` | ✅ 100% |
| ch03 | 过滤与统计 | `ch03-query.js` | ✅ 100% |
| ch04 | 打印列表与读懂命令行 | `ch04-render.js`、`ch04-args.js` | ✅ 100% |
| ch05 | 存盘与读盘 | `ch05-store.js` | ✅ 100% |
| Final | 组装命令行程序 | `ch06-cli.js` | ✅ 100% |

**可以直接跑**（零依赖，Node 18+）：

```bash
cd promentor/mini-todo
node main.js add 买牛奶
node main.js add 写作业
node main.js list
node main.js list todo 牛奶
node main.js done t1
node main.js remove t1
```

`main.js` 只负责"接线"（拿命令行参数 → 调 `run()` → 处理错误与退出码），真正的逻辑全在
`ch01`–`ch06` 那七个文件里 —— 这七章攒出来的就是一个成品。数据存在同目录 `tasks.json`（已被 `.gitignore` 排除）。

> 提示：中文参数在 Windows PowerShell 里可能因控制台编码（936）变乱码，先 `chcp 65001`，或直接在 WSL 的 Ubuntu 里跑。

### `dsh-plugin/` —— 第三门课（2/7，正在做）

| 章 | 内容 | 难度 | 文件 | 状态 |
|---|---|---|---|---|
| ch00 | 插件双半模型与运行环境 | easy | `ch00-plugin-anatomy.ts`（`describePlugin`） | ✅ 100% |
| ch01 | Host 数据网关与路径安全 | hard | `ch01-host-gateway.ts`（`resolveCourseFile` / `contentTypeFor` / `isReadableMethod`） | ✅ 100% |
| ch02 | 数据层：把文件树折叠成课程模型 | mid | — | 下一步 |
| ch03 | 状态层：手写 external store | easy | — | 待做 |
| ch04 | 视图状态机：dock 与 panel | mid | — | 待做 |
| ch05 | 插件装配：slot / 词典 / 打包清单 | mid | — | 待做 |
| Final | 组装 mini-promentor | hard | — | 待做 |

### `ts-bridge/` —— TypeScript 速成

| 文件 | 说明 |
|---|---|
| `exercise.ts` | 给 `addTask` / `summarize` 加类型：interface、`readonly`、参数与返回值标注 |

### `notes/` —— 学习笔记（5 份）

| 文件 | 讲什么 |
|---|---|
| `学习工作流.md` | 一章的 10 步流程、三条硬规则（保存协议 / 别全选 / 整行替换）、把错误分成"打字层 vs 理解层"、Node 直接跑 `.ts` 的内部五步、四种运行期报错怎么分辨 |
| `课程地图.md` | 一页纸地图：插件为什么拆成 host / client 两块、那条线上为什么必须站"保安"、mini-todo 五步与插件课五步的对应关系 |
| `我的代码合集.md` | mini-todo 七章代码速览，每段附一句"这一段学到的" |
| `我学过的固定格式.md` | JS 句型与标点速查（20 节：函数/对象/数组/if/for/箭头/三元/展开，运算符表、报错读法、默写清单、Ch4–Final 新格式） |
| `标点速查表.md` | 标点配对规则与常用句型，写代码时对着看 |

> 笔记里出现的 `.promentor/chapters/...` 是本地课程目录的路径。课程数据不入库，这里只保留文字记录。

## 两门课在学什么（一句话）

- **mini-todo**：把一件事拆成"能测试的小零件"再拼起来 —— 造零件 → 查改 → 显示 → 存取 → 组装，五步全走通。
- **插件课**：同一套五步，但**零件分布在两个程序里**（后台能读盘、浏览器能画界面），中间只有一条**不可信**的线，所以线上必须站一个"保安" —— 那就是 Ch1 的路径安全判定。

## 归档说明（整理方式）

**代码逻辑一字未改**，只做了两类整理：

1. **路径**：跨文件的 `import` 改成归档后的扁平文件名（课程目录里的相对路径复制过来会失效）。
2. **可读性**：课程脚手架留下的"本文件已清空，请自己打一遍""填空版""逻辑留给你写"等过期注释，改写成说明性注释；对齐了手打时的缩进空格。

笔记里"还没 submit""下一章是 Ch4"之类的进度描述，已按实际完成情况更新。
