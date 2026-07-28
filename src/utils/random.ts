// 重み付き抽選ユーティリティ

export interface Weighted<T> {
  item: T
  weight: number
}

/** 重み付きで count 件を重複なしで抽選する */
export function weightedSample<T>(entries: Weighted<T>[], count: number): T[] {
  const pool = [...entries]
  const result: T[] = []
  while (result.length < count && pool.length > 0) {
    const total = pool.reduce((sum, e) => sum + e.weight, 0)
    let r = Math.random() * total
    let picked = pool.length - 1
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].weight
      if (r < 0) {
        picked = i
        break
      }
    }
    result.push(pool[picked].item)
    pool.splice(picked, 1)
  }
  return result
}

/** 配列からランダムに1件返す */
export function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
