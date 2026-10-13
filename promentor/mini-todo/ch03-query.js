/**
 * mini-todo 课程 · Ch 3 Lab —— 过滤与统计
 *
 * 课程给的是"脚手架 + 填空版"，共 5 个空位 ____，每个对应讲义里的一个概念。
 * **本文件里的 5 个空位已全部由我填完**；原来标着"空 1…空 5"的位置改成了说明填的是哪个概念。
 *
 *   · 规则清单：.promentor/chapters/ch03-filter-and-summary/lab.json（notes.rules 共 8 条）
 *   · 讲义：.promentor/chapters/ch03-filter-and-summary/lecture.md
 *        （3.2 讲 ??，3.4 讲"并且"，3.5 讲派生数据）
 *   · 测试：node .promentor/chapters/ch03-filter-and-summary/lab_test.js
 */

// 过滤：按"状态 + 关键字"挑出任务，返回【新数组】（不改动传进来的 tasks）
export function filterTasks(tasks, options = {}) {
  // 用 ?? 而不是 ||：只有左边是 null / undefined 时才用右边的默认值（讲义 3.2 节的关键区别）
  const status = options.status ?? 'all'
  const keyword = (options.keyword ?? '').toLowerCase()

  // 三个都不认识 → 抛错。注意：**没给** status 是正常情况（上面已经给了默认值），
  // 只有**给了但不认识**才是错误。
  if (status !== 'all' && status !== 'done' && status !== 'todo') {
    throw new Error(`status 只能是 all、done 或 todo，收到的是 "${status}"`)
  }

  // 读法：挨个条件过筛。任何一个不满足 → return false（把它筛掉）；全过 → return true（留下）
  return tasks.filter(task => {
    if (status === 'done' && task.done === false) return false

    // 要"未完成"的，就把 done 已经是 true 的那批筛掉
    if (status === 'todo' && task.done === true) return false

    // includes：问"我里面包含这段文字吗"；两边都已经 toLowerCase()，所以大小写不影响匹配
    if (keyword !== '' && task.title.toLowerCase().includes(keyword) === false) return false

    return true
  })
}

// 统计：算出总数 / 完成数 / 未完成数
// 这三个数字叫"派生数据"——它们完全由 tasks 算出来，所以**不要存进 tasks.json**（讲义 3.5 节）
export function summarize(tasks) {
  const done = tasks.filter(task => task.done === true).length

  return {
    total: tasks.length,
    done,
    // 未完成数用上面已经算出来的数字推，不要再数一遍
    todo: tasks.length - done,
  }
}
