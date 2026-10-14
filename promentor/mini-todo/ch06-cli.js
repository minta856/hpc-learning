/**
 * mini-todo 课程 · Final Lab —— 组装命令行程序
 *
 * 课程脚手架把本文件清空、要求"自己打一遍"，所以下面这些是我照着讲义逐行敲出来的。
 * 这一章把前面几章写好的 6 个文件接成一个真能跑的程序。
 *   · 规则清单：.promentor/chapters/ch06-final-cli/lab.json（notes.rules 第 1-10 条）
 *   · 章节测试：node .promentor/chapters/ch06-final-cli/lab_test.js
 *   · 课程自带的真跑入口：node .promentor/main.js
 *
 * 归档说明：本文件从课程目录复制到这里留档，下面 6 行 import 的路径已改成同目录的扁平
 * 文件名（原来指向 ../ch0X-xxx/ 的课程目录，复制过来会失效）。
 */

import { createTask, addTask } from './ch01-task.js'
import { findTask, toggleTask, removeTask } from './ch02-task.js'
import { filterTasks, summarize } from './ch03-query.js'
import { parseArgs, usage } from './ch04-args.js'
import { renderList } from './ch04-render.js'
import { loadTasks, saveTasks } from './ch05-store.js'

export async function run(argv, dataFile) {
  const { command, args } = parseArgs(argv)
  const tasks = await loadTasks(dataFile)

  if (command === 'add') {
    const task = createTask(tasks, args.join(' '))
    await saveTasks(dataFile, addTask(tasks, task))
    console.log(`已添加 ${task.id}：${task.title}`)
    return 0
  }

  if (command === 'list') {
    const status = args[0] ?? 'all'
    const keyword = args.slice(1).join(' ')
    const shown = filterTasks(tasks, { status, keyword })
    const stats = summarize(tasks)

    console.log(renderList(shown))
    console.log(`共 ${stats.total} 条 · 未完成 ${stats.todo} · 已完成 ${stats.done}`)
    return 0
  }

  if (command === 'done') {
    const id = args[0]
    if (findTask(tasks, id) === undefined) {
      throw new Error(`没有 id 为 ${id} 的任务`)
    }
    await saveTasks(dataFile, toggleTask(tasks, id))
    console.log(`已切换 ${id} 的状态`)
    return 0
  }

  if (command === 'remove') {
    const id = args[0]
    if (findTask(tasks, id) === undefined) {
      throw new Error(`没有 id 为 ${id} 的任务`)
    }
    await saveTasks(dataFile, removeTask(tasks, id))
    console.log(`已删除 ${id}`)
    return 0
  }

  console.log(usage())
  return 1
}
