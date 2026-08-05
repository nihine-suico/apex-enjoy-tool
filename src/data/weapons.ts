// 武器データ（シーズン30「Marked」時点）
// ケアパッケージ武器はシーズンごとに入れ替わるので carePackage フラグを更新する

export type WeaponCategory =
  | 'ar'
  | 'smg'
  | 'lmg'
  | 'marksman'
  | 'sniper'
  | 'shotgun'
  | 'pistol'

export interface Weapon {
  id: string
  name: string
  category: WeaponCategory
  /** ケアパッケージ（サプライドロップ）武器かどうか */
  carePackage?: boolean
}

export const WEAPON_CATEGORY_LABELS: Record<WeaponCategory, string> = {
  ar: 'アサルトライフル',
  smg: 'SMG',
  lmg: 'LMG',
  marksman: 'マークスマン',
  sniper: 'スナイパー',
  shotgun: 'ショットガン',
  pistol: 'ピストル',
}

// 近距離武器としてカウントするカテゴリ（バランス抽選用）
export const CLOSE_RANGE_CATEGORIES: WeaponCategory[] = [
  'smg',
  'shotgun',
  'pistol',
]

export const WEAPONS: Weapon[] = [
  // アサルトライフル
  { id: 'flatline', name: 'フラットライン', category: 'ar' },
  { id: 'hemlok', name: 'ヘムロック', category: 'ar' },
  { id: 'havoc', name: 'HAVOC', category: 'ar' },
  { id: 'r301', name: 'R-301', category: 'ar' },
  { id: 'nemesis', name: 'ネメシス', category: 'ar' },
  // SMG
  { id: 'alternator', name: 'オルタネーター', category: 'smg' },
  { id: 'prowler', name: 'プラウラー', category: 'smg' },
  { id: 'r99', name: 'R-99', category: 'smg' },
  { id: 'volt', name: 'ボルト', category: 'smg' },
  { id: 'car', name: 'C.A.R.', category: 'smg' },
  // LMG
  { id: 'devotion', name: 'ディヴォーション', category: 'lmg' },
  { id: 'spitfire', name: 'スピットファイア', category: 'lmg' },
  { id: 'rampage', name: 'ランページ', category: 'lmg' },
  { id: 'lstar', name: 'Lスター', category: 'lmg', carePackage: true },
  // マークスマン
  { id: 'g7', name: 'G7スカウト', category: 'marksman' },
  { id: 'tripletake', name: 'トリプルテイク', category: 'marksman' },
  { id: '3030', name: '30-30リピーター', category: 'marksman', carePackage: true },
  { id: 'bocek', name: 'ボセック', category: 'marksman' },
  // スナイパー
  { id: 'chargerifle', name: 'チャージライフル', category: 'sniper' },
  { id: 'longbow', name: 'ロングボウ', category: 'sniper' },
  { id: 'kraber', name: 'クレーバー', category: 'sniper', carePackage: true },
  { id: 'sentinel', name: 'センチネル', category: 'sniper' },
  // ショットガン
  { id: 'eva8', name: 'EVA-8', category: 'shotgun' },
  { id: 'mastiff', name: 'マスティフ', category: 'shotgun' },
  { id: 'mozambique', name: 'モザンビーク', category: 'shotgun' },
  { id: 'peacekeeper', name: 'ピースキーパー', category: 'shotgun' },
  // ピストル
  { id: 'p2020', name: 'P2020', category: 'pistol' },
  { id: 're45', name: 'RE-45', category: 'pistol' },
  { id: 'wingman', name: 'ウィングマン', category: 'pistol' },
]
