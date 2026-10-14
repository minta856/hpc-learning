# ProMentor 学习记录 · mini-todo

用 [ProMentor](https://github.com/Lyn-77/ProMentor) 对 `mini-todo` 项目（零依赖命令行待办清单，纯 JavaScript / ESM，7 个文件约 320 行）生成的**零基础课程**，逐章手写核心函数并通过行为测试。

**进度：7/7 章全部完成，每章都是 100 分、一次通过。**

课程数据（`.promentor/`：讲义、规格、测试、提交记录）按 ProMentor 约定不入库，这里只放**我自己写的实现**。

| 章 | 内容 | 我写的文件 | 状态 |
|---|---|---|---|
| ch00 | 你的第一个函数：把标题洗干净 | `mini-todo/ch00-title.js` | ✅ 100% |
| ch01 | 任务对象与列表 | `mini-todo/ch01-task.js` | ✅ 100% |
| ch02 | 改状态与删除 | `mini-todo/ch02-task.js` | ✅ 100% |
| ch03 | 过滤与统计 | `mini-todo/ch03-query.js` | ✅ 100% |
| ch04 | 打印列表与读懂命令行 | `mini-todo/ch04-render.js`、`ch04-args.js` | ✅ 100% |
| ch05 | 存盘与读盘 | `mini-todo/ch05-store.js` | ✅ 100% |
| ch06 | Final：组装命令行程序 | `mini-todo/ch06-cli.js` | ✅ 100% |

## 目录说明

每个文件是那一章要求的实现，接口签名与课程规格（`lab.json`）一致。文件名前面加了章号，因为 ch01 和 ch02 要求的文件名都叫 `task.js`。

归档时做了两类轻整理，**代码逻辑没有改动**：

1. **路径**：`ch01` 的 1 行 import、`ch06` 的 6 行 import 改成同目录的扁平文件名（原来指向 `../ch0X-xxx/` 的课程目录，复制过来会失效）。
2. **可读性**：课程脚手架留下的"本文件已清空，请自己打一遍""填空版"等过期注释，改写成解释性说明；`ch02`、`ch04` 的缩进对齐。

## 各章学到的东西

- **ch00 `normalizeTitle`**：先判类型再加工 —— 不判的话 `raw.trim()` 会崩，而 `raw.trim is not a function` 这种报错对调用方毫无帮助；"洗完为空"的判断必须放在**加工之后**；坏输入用 `throw` 挡在门口，而不是返回空字符串让它悄悄流进数据文件。
- **ch01 `createTask` / `addTask`**：对象字面量 `{ id, title, done }`；用展开运算符 `...` 往数组末尾加东西；**返回新数组**而不是修改原数组。
- **ch02 `findTask` / `toggleTask` / `removeTask`**：`find` 找不到返回 `undefined` 是**正常结果**，但"用户要改一条不存在的任务"就该抛错 —— 要区分"正常的没有"和"出错了"；用 `map` / `filter` 做到"只改需要改的那一个"。
- **ch03 `filterTasks` / `summarize`**：把多个条件组合起来（状态 + 关键字）；`??` 用来区分"没给参数"和"给了空字符串"；派生数据 —— 不改原数据，只算出新的东西。
- **ch04 `renderList` / `parseArgs`**：先量出最长的 id（`idwidth`），再用 `padEnd` 补齐，输出的列才会对齐；空列表要给一句人话；命令表做成常量 `COMMANDS`，校验和报错都引用它，以后加命令只用改一处；报错时顺手接上 `usage()`。
- **ch05 `loadTasks` / `saveTasks`**：读写硬盘是异步的，所以函数是 `async`、调用时要 `await`；只有 `ENOENT`（文件不存在）算正常情况、返回空数组，其它错误（比如 JSON 坏了）原样抛出，**不能吞掉**；写盘用 `JSON.stringify(tasks, null, 2)` 并以换行结尾，文件才是人可读、结尾干净的。
- **ch06 `run`**：入口文件只做"编排"—— 解析参数 → 读数据 → 按命令分派 → 写回 → 打印结果；把 6 个零件接成一个真能跑的程序（`node .promentor/main.js` 跑到 exit 0）。

## 怎么跑测试

在 `mini-todo` 项目目录下：

```bash
node .promentor/chapters/<章节目录>/lab_test.js
```

行为测试由课程提供，**不修改**；`src/` 是原项目的参考实现，只读对照，不抄。
