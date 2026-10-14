/**
 * mini-todo 课程 · Ch 5 Lab —— 存盘与读盘
 *
 * 课程脚手架把本文件清空、要求"自己打一遍"，所以下面这些是我照着讲义逐行敲出来的。
 *   · 规则清单：.promentor/chapters/ch05-save-and-load/lab.json（notes.rules 第 1-9 条）
 *   · 测试：node .promentor/chapters/ch05-save-and-load/lab_test.js
 *
 * 两个函数都要和硬盘打交道，所以是 async、调用时要用 await。
 * 记下来的一点：只有"文件不存在"（ENOENT）才算正常情况、返回空数组；
 * 其它错误（比如 JSON 坏了）要原样抛出去，不能吞掉。
 */

import { readFile, writeFile } from 'node:fs/promises'

export async function loadTasks(path) {
  try {
    const text = await readFile(path, 'utf8')
    const data = JSON.parse(text)
    return Array.isArray(data) ? data : []
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

export async function saveTasks(path, tasks) {
  const text = JSON.stringify(tasks, null, 2) + '\n'
  await writeFile(path, text, 'utf8')
}
