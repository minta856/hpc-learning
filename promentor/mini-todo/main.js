/**
 * mini-todo 的命令行入口 —— 把七章里手写的函数接成一个能直接跑的程序。
 *
 * 用法（在本目录下）：
 *   node main.js add 买牛奶
 *   node main.js add 写作业
 *   node main.js list
 *   node main.js list todo 牛奶
 *   node main.js done t1
 *   node main.js remove t1
 *
 * 零依赖：只要有 Node 18+ 就能跑。
 * 数据默认存在同目录的 tasks.json（想换位置就设环境变量 TODOS_FILE）。
 *
 * 分工：main.js 只负责"接线"（拿命令行参数 → 调 run → 处理错误与退出码），
 *       真正的逻辑全在 ch01–ch06 那七个文件里。
 */

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { run } from './ch06-cli.js'

const here = dirname(fileURLToPath(import.meta.url))
const dataFile = process.env.TODOS_FILE ?? join(here, 'tasks.json')

try {
  // process.argv.slice(2) 就是用户在 node main.js 后面敲的那一段
  const exitCode = await run(process.argv.slice(2), dataFile)
  process.exitCode = exitCode
} catch (error) {
  // run() 里抛出来的都是"给人看"的错误（比如不认识的命令、找不到 id）
  console.error(`错误：${error.message}`)
  process.exitCode = 1
}
