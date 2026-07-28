// アイテム（レジェンド・武器）の抽選ステータス
// 通常 → お気に入り（出やすくなる） → 除外 → 通常 … とクリックで循環する

export type ItemStatus = 'normal' | 'favorite' | 'excluded'

export type StatusMap = Record<string, ItemStatus>

/** お気に入り時の抽選重み（通常は1） */
export const FAVORITE_WEIGHT = 3

export function cycleStatus(status: ItemStatus | undefined): ItemStatus {
  switch (status) {
    case 'favorite':
      return 'excluded'
    case 'excluded':
      return 'normal'
    default:
      return 'favorite'
  }
}

export function statusWeight(status: ItemStatus | undefined): number {
  return status === 'favorite' ? FAVORITE_WEIGHT : 1
}
