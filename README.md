# hpc-learning

FZU-ASC 超级计算团队 · 学习仓库。当前环境：**WSL2 + Ubuntu**。

## 怎么跑（一个能运行的成品）

`promentor/mini-todo/` 是 ProMentor 课程七章攒出来的命令行待办清单，**零依赖**（Node 18+）：

```bash
cd promentor/mini-todo
node main.js add 买牛奶
node main.js add 写作业
node main.js list        # t1  [ ]  买牛奶 / t2  [ ]  写作业
node main.js done t1
node main.js remove t1
```

## 仓库里有什么

| 路径 | 内容 |
|---|---|
| `promentor/mini-todo/` | ProMentor 第一门课：7 章实现 + 可运行入口 `main.js`（7/7，63 条测试全绿） |
| `promentor/dsh-plugin/` | 插件课（TypeScript）Ch0 / Ch1 实现（2/7） |
| `promentor/ts-bridge/` | TypeScript 速成练习 |
| `promentor/notes/` | 学习笔记 5 份：学习工作流、课程地图、我的代码合集、固定格式、标点速查 |

## 学习计划

- 目标：学习高性能计算、并行编程
- 阶段计划：先熟悉 Linux 与 Git，再学习 MPI、OpenMP

## 问题记录

1. 问题：输入 `is` 命令提示 command not found
   解决：正确命令是 `ls`，用来列出文件夹内文件，命令拼写不能错。

2. 问题：一开始不清楚 SSH 密钥的作用
   解决：SSH 密钥用于 WSL 免密安全连接 GitHub，私钥保存在本机不能外传，公钥放在 GitHub。

3. 问题：分不清 git commit 和 git push 的区别
   解决：`commit` 只是在本地 Linux 保存版本快照；`push` 才把快照上传到 GitHub 网页。
