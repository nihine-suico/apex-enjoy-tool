// レジェンドデータ（シーズン29スプリット2時点・全28キャラ）
// 新レジェンドが追加されたらここに1行足すだけでOK

export type LegendClass =
  | 'assault'
  | 'skirmisher'
  | 'recon'
  | 'support'
  | 'controller'

export interface Legend {
  id: string
  name: string
  legendClass: LegendClass
}

export const LEGEND_CLASS_LABELS: Record<LegendClass, string> = {
  assault: 'アサルト',
  skirmisher: 'スカーミッシャー',
  recon: 'リコン',
  support: 'サポート',
  controller: 'コントローラー',
}

export const LEGENDS: Legend[] = [
  { id: 'wraith', name: 'レイス', legendClass: 'skirmisher' },
  { id: 'pathfinder', name: 'パスファインダー', legendClass: 'skirmisher' },
  { id: 'octane', name: 'オクタン', legendClass: 'skirmisher' },
  { id: 'horizon', name: 'ホライゾン', legendClass: 'skirmisher' },
  { id: 'revenant', name: 'レヴナント', legendClass: 'skirmisher' },
  { id: 'alter', name: 'オルター', legendClass: 'skirmisher' },
  { id: 'accel', name: 'アクセル', legendClass: 'skirmisher' },
  { id: 'bangalore', name: 'バンガロール', legendClass: 'assault' },
  { id: 'fuse', name: 'ヒューズ', legendClass: 'assault' },
  { id: 'ash', name: 'アッシュ', legendClass: 'assault' },
  { id: 'madmaggie', name: 'マッドマギー', legendClass: 'assault' },
  { id: 'ballistic', name: 'バリスティック', legendClass: 'assault' },
  { id: 'bloodhound', name: 'ブラッドハウンド', legendClass: 'recon' },
  { id: 'crypto', name: 'クリプト', legendClass: 'recon' },
  { id: 'seer', name: 'シア', legendClass: 'recon' },
  { id: 'vantage', name: 'ヴァンテージ', legendClass: 'recon' },
  { id: 'valkyrie', name: 'ヴァルキリー', legendClass: 'recon' },
  { id: 'sparrow', name: 'スパロー', legendClass: 'recon' },
  { id: 'gibraltar', name: 'ジブラルタル', legendClass: 'support' },
  { id: 'lifeline', name: 'ライフライン', legendClass: 'support' },
  { id: 'mirage', name: 'ミラージュ', legendClass: 'support' },
  { id: 'loba', name: 'ローバ', legendClass: 'support' },
  { id: 'newcastle', name: 'ニューキャッスル', legendClass: 'support' },
  { id: 'conduit', name: 'コンジット', legendClass: 'support' },
  { id: 'caustic', name: 'コースティック', legendClass: 'controller' },
  { id: 'wattson', name: 'ワットソン', legendClass: 'controller' },
  { id: 'rampart', name: 'ランパート', legendClass: 'controller' },
  { id: 'catalyst', name: 'カタリスト', legendClass: 'controller' },
]
