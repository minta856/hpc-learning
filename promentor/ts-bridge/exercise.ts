/**
 * TypeScript 速成 · 练习（已完成）
 *
 * 逻辑都是 mini-todo 里学过的（addTask 就是 Ch 1 的 `[...tasks, task]`；summarize 就是 Ch 3 的减法），
 * 这一节练的是"给代码加上类型"：类型标注 / interface / readonly / 参数与返回值标注。
 *
 * 测试：node exercise_test.ts（课程提供，不修改）
 *
 * 归档说明：本文件从学习目录复制留档，代码逻辑未改动，只对齐了手打时的空格。
 * 记住的一句话：**类型只在写代码时有用，运行时会被 Node 完全擦掉** —— 所以"跑得过"不等于"类型写对了"。
 */

export interface Task {
  readonly id: string
  readonly title: string
  readonly done: boolean
}

export interface Summary {
  readonly total: number
  readonly done: number
  readonly todo: number
}

function nextId(tasks: Task[]): string {
  let max = 0
  for (const task of tasks) {
    const n = Number(task.id.slice(1))
    if (n > max) max = n
  }
  return 't' + (max + 1)
}

export function addTask(tasks: Task[], title: string): Task[] {
  const task: Task = { id: nextId(tasks), title, done: false }
  return [...tasks, task]
}

export function summarize(tasks: Task[]): Summary {
  const done = tasks.filter(task => task.done).length
  return { total: tasks.length, done, todo: tasks.length - done }
}
