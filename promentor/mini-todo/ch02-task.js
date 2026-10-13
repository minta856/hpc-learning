/**
 * mini-todo 课程 · Ch 2 Lab —— 改状态与删除
 *
 * 课程给的是"脚手架 + 填空版"：新句型（箭头函数、三元运算符、展开运算符）的标点先由课程
 * 写好，只留几个空位 ____，要动手填的是讲义里的概念。
 * **本文件里的空位已全部由我填完**；课程留下的"该填什么"的注释改写成了解释性说明，
 * 保留在这里作为学习痕迹。
 *
 *   · 规则清单：.promentor/chapters/ch02-update-and-remove/lab.json（notes.rules 共 10 条）
 *   · 讲义：.promentor/chapters/ch02-update-and-remove/lecture.md
 *        （2.2 节讲 find，2.4 节讲 map，2.5 节讲 filter）
 *   · 测试：node .promentor/chapters/ch02-update-and-remove/lab_test.js
 */

// ① 找：按 id 找任务。找到 → 返回那一条；找不到 → 返回 undefined（"没有"是正常结果，不抛错）
export function findTask(tasks, id) {
  // find 的条件就是："这张卡片是不是我要找的那一条？"
  return tasks.find(task => task.id === id)
}

// ② 改：把目标任务的 done 取反，返回【新数组】；找不到 id 要抛错
export function toggleTask(tasks, id) {
  // 复用上面写好的 findTask —— 这就是"抽成函数"的好处
  if (findTask(tasks, id) === undefined) {
    throw new Error(`没有 id 为 ${id} 的任务`)
  }
  // map：逐个换成新的；只改命中的那一条，其余原样返回（...task 再覆盖 done）
  return tasks.map(task => (task.id === id ? { ...task, done: !task.done } : task))
}

// ③ 删：把目标任务去掉，返回【新数组】；找不到 id 要抛错
export function removeTask(tasks, id) {
  if (findTask(tasks, id) === undefined) {
    throw new Error(`没有 id 为 ${id} 的任务`)
  }
  // filter：留下符合条件的卡片，也就是 id 不等于目标的那一些
  return tasks.filter(task => task.id !== id)
}
