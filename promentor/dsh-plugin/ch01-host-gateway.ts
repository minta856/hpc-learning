/**
 * 插件课 Ch 1 Lab —— Host 数据网关与路径安全
 *
 * 规格：.promentor/chapters/ch01-host-gateway/lab.json　·　讲义：同目录 lecture.md
 * 测试：node .promentor/chapters/ch01-host-gateway/lab_test.ts（18/18 通过）
 *
 * 本文件把网关里的路径安全判定摘成三个可独立测试的纯函数。
 * 关键设计：用【返回值】表达拒绝（400/403/404），异常只留给真正的意外（EACCES/IO）。
 *
 * 归档说明：本文件从课程目录复制留档，内容就是通过 18/18 测试的那一版。
 */

import { realpath, stat } from 'node:fs/promises'
import { isAbsolute, join, normalize, relative, resolve, sep } from 'node:path'

export interface ResolveOk {
  readonly ok: true
  readonly path: string
}

export interface ResolveFail {
  readonly ok: false
  readonly status: 400 | 403 | 404
}

export type ResolveResult = ResolveOk | ResolveFail

/** 扩展名 → MIME。未命中一律回退 application/octet-stream（讲义 1.7）。 */
const CONTENT_TYPES: Record<string, string> = {
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.yml': 'text/yaml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.go': 'text/plain; charset=utf-8',
  '.py': 'text/plain; charset=utf-8',
  '.ts': 'text/plain; charset=utf-8',
  '.js': 'text/plain; charset=utf-8',
  '.rs': 'text/plain; charset=utf-8',
  '.java': 'text/plain; charset=utf-8',
  '.c': 'text/plain; charset=utf-8',
  '.h': 'text/plain; charset=utf-8',
  '.sh': 'text/plain; charset=utf-8',
  '.mod': 'text/plain; charset=utf-8',
  '.sum': 'text/plain; charset=utf-8',
}

/**
 * 「这个相对路径是不是在往上爬（试图跑到父目录）」。
 *
 * ⚠️ 全章最容易写错的一处：不能写成宽泛的 value.startsWith('..')，
 * 因为 '..notes.md' 是一个【合法的文件名】。只有下面两种才算上级：
 *   · 恰好是 '..'
 *   · 以 '..' + 路径分隔符 开头（sep 在 Windows 是 \，POSIX 是 / → 跨平台）
 */
function isEscapingToParent(value: string): boolean {
  return value === '..' || value.startsWith('..' + sep)
}

/** 取最后一个点之后的扩展名；没有点则视为无扩展名。 */
export function contentTypeFor(filePath: string): string {
  const dot = filePath.lastIndexOf('.')
  const ext = dot === -1 ? '' : filePath.slice(dot)
  return CONTENT_TYPES[ext] ?? 'application/octet-stream'
}

/** 方法白名单：只有 GET / HEAD 可读（undefined 与大小写变体都不算）。 */
export function isReadableMethod(method: string | undefined): boolean {
  return method === 'GET' || method === 'HEAD'
}

/**
 * ============ 判定流程图（Mermaid）============
 * 把下面 ```mermaid 代码块贴进任何支持 Mermaid 的查看器（GitHub、VS Code 预览、mermaid.live）即可渲染。
 *
 * ```mermaid
 * flowchart TD
 *     A["开始 resolveCourseFile(wsRoot, rel)"] --> B{"rel === null 或 rel === '' ?"}
 *     B -->|是| B1["400 输入缺失"]
 *     B -->|否| C["normalized = normalize(rel)"]
 *     C --> D{"normalized 为空 / 绝对路径 / 向上逃逸 ?"}
 *     D -->|是| D1["400 路径语法非法"]
 *     D -->|否| E["try: realpath(wsRoot)"]
 *     D -.->|"向上逃逸要精确判定"| N["恰好 '..' 或 '..'+sep 开头才算<br/>'..notes.md' 是合法文件名，必须放行"]
 *     E --> E1{"catch (error)"}
 *     E1 -->|"ENOENT / ENOTDIR"| E2["404 workspace 不存在"]
 *     E1 -->|"其它 IO 错误"| E3["throw error（真正的意外）"]
 *     E1 -->|"成功：realRoot"| F["dataRoot = resolve(join(realRoot, '.promentor'))"]
 *     F --> G["target = resolve(join(dataRoot, normalized))"]
 *     G --> H["inside = relative(dataRoot, target)"]
 *     H --> I{"向上逃逸 或 isAbsolute(inside) ?"}
 *     I -->|是| I1["403 请求合法但越权"]
 *     I -->|否| J["try: stat(target)"]
 *     J --> J1{"catch (error)"}
 *     J1 -->|"ENOENT / ENOTDIR"| J2["404 目标不存在"]
 *     J1 -->|"其它 IO 错误"| J3["throw error（磁盘异常）"]
 *     J1 -->|"成功拿到 info"| K{"info.isFile() ?"}
 *     K -->|"否（目录）"| K1["404 目录不是可读资源"]
 *     K -->|是| L["return { ok: true, path: target }"]
 *
 *     classDef bad400 fill:#fff2cc,stroke:#d6b656
 *     classDef bad403 fill:#ffcccc,stroke:#cc6666
 *     classDef bad404 fill:#e6edff,stroke:#7a8fd6
 *     classDef thrown fill:#ffe9d6,stroke:#d79b00
 *     classDef success fill:#d9f2d9,stroke:#6aa84f
 *     classDef note fill:#fafafa,stroke:#999,stroke-dasharray:4 3
 *
 *     class B1,D1 bad400
 *     class I1 bad403
 *     class E2,J2,K1 bad404
 *     class E3,J3 thrown
 *     class L success
 *     class N note
 * ```
 *
 * ============ 文字版：六个阶段，顺序即设计 ============
 *
 *   ① 输入缺失    rel === null || rel === ''                    → 400
 *   ② 归一        normalized = normalize(rel)                    ← 必须最先
 *   ③ 语法非法    空 / isAbsolute / 向上逃逸                      → 400
 *   ④ 真实根      await realpath(wsRoot)    ENOENT/ENOTDIR → 404；其它 → throw
 *   ⑤ 纵深防御    inside = relative(dataRoot, target) 再查一次    → 403
 *   ⑥ 目标校验    await stat(target) + isFile()                  → 404 / ok:true
 *
 * 唯一细节：向上逃逸 = value === '..' || value.startsWith('..' + sep)
 *           '..notes.md' 是合法文件名；宽泛的 startsWith('..') 会误杀它。
 */
/**
 * 把「workspace 根 + 相对 .promentor/ 的路径」解析成一个可读的真实文件路径。
 * 顺序不能换：先做零成本的字符串校验（①-③），再做 IO（④-⑥）。
 */
export async function resolveCourseFile(wsRoot: string, rel: string | null): Promise<ResolveResult> {
  // ① 输入本身就缺：请求不合法
  if (rel === null || rel === '') return { ok: false, status: 400 }

  // ② 必须先归一：'adir/../../outside.json' 的原始前缀并不是 '..'，归一后才露馅
  const normalized = normalize(rel)
  if (normalized === '' || isAbsolute(normalized) || isEscapingToParent(normalized)) {
    return { ok: false, status: 400 }
  }

  // ③ 真实根：realpath 会解开 junction / 符号链接。它可能失败，必须处理
  let realRoot: string
  try {
    realRoot = await realpath(wsRoot)
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'ENOENT' || code === 'ENOTDIR') return { ok: false, status: 404 }
    throw error
  }

  // ④ 用真实根拼出数据目录，再算目标路径
  const dataRoot = resolve(join(realRoot, '.promentor'))
  const target = resolve(join(dataRoot, normalized))

  // ⑤ 纵深防御：算完之后再问一次「它真的在 dataRoot 里面吗」
  const inside = relative(dataRoot, target)
  if (isEscapingToParent(inside) || isAbsolute(inside)) return { ok: false, status: 403 }

  // ⑥ 存在且必须是普通文件（目录也算 404，避免泄漏「这个目录存在吗」）
  try {
    const info = await stat(target)
    if (!info.isFile()) return { ok: false, status: 404 }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'ENOENT' || code === 'ENOTDIR') return { ok: false, status: 404 }
    throw error
  }

  return { ok: true, path: target }
}
