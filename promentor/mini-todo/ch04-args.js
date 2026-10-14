/**
 * mini-todo 课程 · Ch 4 Lab（二）—— parseArgs
 *
 * 课程脚手架把本文件清空、要求"自己打一遍"，所以下面这些是我照着讲义逐行敲出来的。
 *   · 规则清单：.promentor/chapters/ch04-render-and-args/lab.json（notes.rules 第 6-12 条）
 *   · 测试：node .promentor/chapters/ch04-render-and-args/lab_test.js
 *
 * 记下来的两点：
 *   1) 命令表做成常量 COMMANDS，校验和报错都引用它，以后加命令只用改一处；
 *   2) 报错信息后面都接上 usage() —— 用户敲错的时候顺手告诉他怎么用。
 */

const COMMANDS = ['add', 'list', 'done', 'remove']

export function usage() {
  return '用法：node src/cli.js <add|list|done|remove> [参数...]'
}

export function parseArgs(argv) {
  const [command, ...args] = argv

  if (command === undefined) {
    throw new Error(`还没输入命令。${usage()}`)
  }

  if (COMMANDS.includes(command) === false) {
    throw new Error(`不认识命令 "${command}"。${usage()}`)
  }

  return { command, args }
}
