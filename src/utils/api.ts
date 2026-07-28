// Apex Legends Status 非公式API (https://apexlegendsstatus.com/api)
// APIキーはユーザーが設定画面で登録し、localStorageに保存する

const API_BASE = 'https://api.mozambiquehe.re'

export const API_KEY_STORAGE = 'apex-tool:api-key'

export interface MapInfo {
  map: string
  asset?: string
  remainingSecs?: number
  DurationInMinutes?: number
}

export interface RotationEntry {
  current: MapInfo
  next: MapInfo
}

export interface MapRotationData {
  battle_royale?: RotationEntry
  ranked?: RotationEntry
  ltm?: RotationEntry
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  const body = await res.json().catch(() => null)
  if (!res.ok || body == null) {
    // APIはエラー時 {Error: "..."} を返す
    const message =
      body && typeof body === 'object' && 'Error' in body
        ? String(body.Error)
        : `APIエラー (HTTP ${res.status})`
    throw new Error(message)
  }
  if (typeof body === 'object' && 'Error' in body) {
    throw new Error(String(body.Error))
  }
  return body as T
}

export function fetchMapRotation(apiKey: string): Promise<MapRotationData> {
  return apiGet<MapRotationData>(
    `/maprotation?auth=${encodeURIComponent(apiKey)}&version=2`,
  )
}

// マップ名の日本語表記
const MAP_NAMES_JA: Record<string, string> = {
  'Kings Canyon': 'キングスキャニオン',
  "World's Edge": 'ワールズエッジ',
  Olympus: 'オリンパス',
  'Storm Point': 'ストームポイント',
  'Broken Moon': 'ブロークンムーン',
  'E-District': 'Eディストリクト',
}

export function mapNameJa(name: string): string {
  return MAP_NAMES_JA[name] ?? name
}
