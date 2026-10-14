/**
 * mini-todo 课程 · Ch 4 Lab（一）—— renderList
 *
 * 课程脚手架把本文件清空、要求"自己打一遍"，所以下面这些是我照着讲义逐行敲出来的。
 *   · 规则清单：.promentor/chapters/ch04-render-and-args/lab.json（notes.rules 第 1-5 条）
 *   · 测试：node .promentor/chapters/ch04-render-and-args/lab_test.js
 *
 * 记下来的两点：
 *   1) 先把最长的 id 量出来（idwidth），再用 padEnd 补齐，输出的列才会对齐；
 *   2) 空列表要给一句人话（"（还没有任务）"），而不是打印一个空字符串。
 */

export function renderList(tasks) {
  if (tasks.length === 0) {
    return '（还没有任务）'
  }

  const idwidth = Math.max(...tasks.map(task => task.id.length))

  return tasks
    .map(task => {
      const box = task.done ? '[x]' : '[ ]'
      return `${task.id.padEnd(idwidth)}  ${box}  ${task.title}`
    })
    .join('\n')
}
