/**
 * mini-todo 课程 · Ch 1 Lab —— 任务对象与列表
 *
 * import 与两个函数签名由 ProMentor 生成的脚手架给定，函数体由我完成。
 *   · 规则清单：.promentor/chapters/ch01-task-object/lab.json（notes.rules 共 11 条）
 *   · 讲义：.promentor/chapters/ch01-task-object/lecture.md
 *   · 测试：node .promentor/chapters/ch01-task-object/lab_test.js
 *
 * 归档说明：本文件从课程目录复制到这里留档，import 路径已改为同目录的 ./ch00-title.js。
 * 下面 addTask 里那句"ProMentor 示范"的注释是课程原话，保留作为学习痕迹。
 */

import { normalizeTitle } from './ch00-title.js'

function nextId(tasks) {
  let max = 0
  for (const task of tasks) {
    const n = Number(task.id.slice(1))
    if (n > max) max = n
  }
  return 't' + (max + 1)
}

export function createTask(tasks, rawTitle) {
  if (Array.isArray(tasks) === false) {
    throw new Error('tasks 必须是数组')
  }
  return {
    id: nextId(tasks),
    title: normalizeTitle(rawTitle),
    done: false,
  }
}

export function addTask(tasks, task) {
  // ProMentor 示范：把 tasks 里的每一张卡片"倒出来"（...），最后放上新的 task
  return [...tasks, task]
}
