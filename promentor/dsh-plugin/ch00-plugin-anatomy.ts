/**
 * 插件课 Ch 0 Lab —— 把 package.json 的「半边声明」规范化成冻结的插件描述符
 *
 * 类型与函数签名由课程脚手架给定（脚手架刻意不提供实现），逻辑由我完成。
 *   · 规格：.promentor/chapters/ch00-plugin-anatomy/lab.json（notes.rules 逐条编号）
 *   · 讲义：同目录 lecture.md　·　测试：node .promentor/chapters/ch00-plugin-anatomy/lab_test.ts
 *
 * 归档说明：本文件从课程目录复制留档，内容就是通过 11/11 测试的那一版。
 * 下面把课程给的行为要求改写成说明性注释。
 *
 * 这一章收敛成一句话：**校验 → 取半边 → 冻结**。
 *   1) name / rowId 必须是非空字符串（trim 后非空），否则抛 Error，且 message 里出现对应字段名；
 *   2) 整个 dsh 缺失、或 dsh 在但 client 缺失 → client 为 null（"没有"是正常结果，不是错误）；
 *   3) dsh.client 存在 → platform 必须严格等于 'web'，否则抛 Error；
 *   4) 去重 inject：服务级与包级各做一次，保留「首次出现」的顺序（new Set 天然保序）；
 *   5) Object.freeze 是浅冻结 —— 返回值里有 4 处要冻：两个数组、client 对象、最外层对象。
 */

export interface PackageJsonLike {
  readonly name?: string
  readonly inject?: readonly string[]
  readonly dsh?: {
    readonly client?: {
      readonly inject?: readonly string[]
      readonly platform?: string
    }
  }
}

export interface ClientHalf {
  readonly platform: 'web'
  readonly inject: readonly string[]
}

export interface PluginDescriptor {
  readonly rowId: string
  readonly name: string
  readonly inject: readonly string[]
  readonly client: ClientHalf | null
}

function freezeList(value: readonly string[] | undefined): readonly string[] {
  return Object.freeze([...new Set(value ?? [])])
}

export function describePlugin(pkg: PackageJsonLike, rowId: string): PluginDescriptor {
  const name = pkg?.name
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('package.json 缺少合法的 name')
  }
  if (typeof rowId !== 'string' || rowId.trim() === '') {
    throw new Error('注册行缺少合法的 rowId')
  }
  const raw = pkg.dsh?.client
  let client: ClientHalf | null = null
  if (raw !== undefined) {
    if (raw.platform !== 'web') {
      throw new Error(`dsh.client.platform 必须是 'web'，当前为 ${String(raw.platform)}`)
    }
    client = Object.freeze({ platform: 'web' as const, inject: freezeList(raw.inject) })
  }
  return Object.freeze({ rowId, name, inject: freezeList(pkg.inject), client })
}
