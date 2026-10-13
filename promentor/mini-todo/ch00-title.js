/**
 * mini-todo 课程 · Ch 0 Lab —— 把用户输入的标题洗干净
 *
 * 函数名和参数由 ProMentor 生成的课程脚手架给定，函数体由我完成。
 *   · 规则清单：.promentor/chapters/ch00-first-function/lab.json（notes.rules 共 8 条）
 *   · 讲义：.promentor/chapters/ch00-first-function/lecture.md
 *   · 测试：node .promentor/chapters/ch00-first-function/lab_test.js  →  pass 9 / fail 0
 *
 * 记录下来的三个取舍（Review 时讨论过）：
 *   1) 先判 typeof 再加工 —— 不判的话 raw.trim() 会崩，而 "raw.trim is not a function"
 *      这种报错对调用方毫无帮助；
 *   2) trim 之后才判断"是否为空"—— 用户敲 add "   " 时 raw 不是空串，洗完才是；
 *   3) 坏输入用 throw 挡在门口，而不是返回空字符串让它悄悄流进数据文件。
 */

export function normalizeTitle(raw) {
  if (typeof raw !== 'string') {
    throw new Error('标题必须是文字')
  }
  const title = raw.trim().replace(/\s+/g, ' ')
  if (title === '') {
    throw new Error('标题不能是空的')
  }
  return title
}
