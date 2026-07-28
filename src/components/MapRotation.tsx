import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  API_KEY_STORAGE,
  fetchMapRotation,
  mapNameJa,
  type MapRotationData,
  type RotationEntry,
} from '../utils/api'

const MODE_LABELS: [keyof MapRotationData, string][] = [
  ['battle_royale', 'カジュアル'],
  ['ranked', 'ランク'],
  ['ltm', 'ミックステープ'],
]

function formatRemaining(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function MapRotation() {
  const [apiKey] = useLocalStorage<string>(API_KEY_STORAGE, '')
  const [data, setData] = useState<MapRotationData | null>(null)
  const [fetchedAt, setFetchedAt] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const autoRefreshedRef = useRef(false)

  const load = useCallback(async () => {
    if (!apiKey) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchMapRotation(apiKey)
      setData(result)
      setFetchedAt(Date.now())
      autoRefreshedRef.current = false
    } catch (e) {
      setError(e instanceof Error ? e.message : '取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [apiKey])

  useEffect(() => {
    load()
  }, [load])

  // 残り時間のカウントダウン用に1秒ごとに再描画
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const elapsed = Math.floor((now - fetchedAt) / 1000)

  const remainingOf = (entry: RotationEntry): number => {
    return Math.max(0, (entry.current.remainingSecs ?? 0) - elapsed)
  }

  // ローテーションが切り替わったら1回だけ自動再取得
  useEffect(() => {
    if (!data || loading || autoRefreshedRef.current) return
    const anyExpired = MODE_LABELS.some(([key]) => {
      const entry = data[key]
      return entry && remainingOf(entry) === 0
    })
    if (anyExpired) {
      autoRefreshedRef.current = true
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now])

  if (!apiKey) {
    return (
      <section>
        <div className="notice-panel">
          <h2 className="notice-title">APIキーが必要です</h2>
          <p>
            マップローテーションの取得には Apex Legends Status の無料APIキーが必要です。
          </p>
          <ol className="notice-steps">
            <li>
              <a
                href="https://apexlegendsstatus.com/api"
                target="_blank"
                rel="noreferrer"
              >
                apexlegendsstatus.com/api
              </a>
              でAPIキーを取得（無料）
            </li>
            <li>「設定」タブのAPIキー欄に貼り付け</li>
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="tool-header">
        <h2 className="config-title">マップローテーション</h2>
        <button className="reset-button" onClick={load} disabled={loading}>
          {loading ? '更新中…' : '更新'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {data && (
        <div className="map-cards">
          {MODE_LABELS.map(([key, label]) => {
            const entry = data[key]
            if (!entry?.current) return null
            const remaining = remainingOf(entry)
            return (
              <div key={key} className="map-card">
                {entry.current.asset && (
                  <div
                    className="map-card-image"
                    style={{ backgroundImage: `url(${entry.current.asset})` }}
                  />
                )}
                <div className="map-card-body">
                  <span className="map-card-mode">{label}</span>
                  <span className="map-card-name">
                    {mapNameJa(entry.current.map)}
                  </span>
                  <span className="map-card-timer">
                    残り {formatRemaining(remaining)}
                  </span>
                  <span className="map-card-next">
                    次: {mapNameJa(entry.next?.map ?? '-')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
