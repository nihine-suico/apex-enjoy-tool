import { useCallback, useEffect, useRef, useState } from 'react'
import ringData from '../data/rings.json'
import { useLocalStorage } from '../hooks/useLocalStorage'

// リングデータ: マップごとに [ゲーム][ステージ0-5][x, y, 半径]（座標系は0..16384）
type Stage = number[]
type Game = Stage[]
type MapId = 'we' | 'sp'
const RING_GAMES = ringData as Record<MapId, Game[]>

const COORD_MAX = 16384
const CANVAS_SIZE = 1024
// 「リング1がこの付近」とみなす距離（座標単位。マップ幅の約12%）
const NEARBY_THRESHOLD = 2000

const MAPS: { id: MapId; name: string; image: string }[] = [
  { id: 'we', name: 'ワールズエッジ', image: 'images/maps/we_map.png' },
  { id: 'sp', name: 'ストームポイント', image: 'images/maps/sp_map.png' },
]

type Mode = 'replay' | 'conditional' | 'heatmap'

// ステージ描画色（リング1 → 最終にかけて白 → 赤へ）
const STAGE_COLORS = [
  'rgba(255,255,255,0.9)',
  'rgba(255,240,150,0.85)',
  'rgba(255,200,90,0.85)',
  'rgba(255,150,60,0.9)',
  'rgba(255,90,50,0.9)',
  'rgba(255,40,64,1)',
]

const STAGE_LABELS = ['1', '2', '3', '4', '5', '最終']

export function RingAnalysis() {
  const [mapId, setMapId] = useLocalStorage<MapId>('apex-tool:ring-map', 'we')
  const [mode, setMode] = useLocalStorage<Mode>(
    'apex-tool:ring-analysis-mode',
    'replay',
  )
  const [gameIndex, setGameIndex] = useState(0)
  const [visibleStage, setVisibleStage] = useState(5)
  const [anchor, setAnchor] = useState<[number, number] | null>(null)
  const [heatStage, setHeatStage] = useState(5)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  const games = RING_GAMES[mapId]
  const game = games[gameIndex % games.length]

  // リング1中心がanchor付近だった試合
  const nearbyGames = anchor
    ? games.filter(
        (g) => Math.hypot(g[0][0] - anchor[0], g[0][1] - anchor[1]) < NEARBY_THRESHOLD,
      )
    : []

  const changeMap = (id: MapId) => {
    setMapId(id)
    setAnchor(null)
    setGameIndex(Math.floor(Math.random() * RING_GAMES[id].length))
  }

  // マップ画像の読み込み
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      draw()
    }
    img.src = `${import.meta.env.BASE_URL}${MAPS.find((m) => m.id === mapId)!.image}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const S = CANVAS_SIZE / COORD_MAX
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
    ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

    const circle = (
      x: number,
      y: number,
      r: number,
      stroke: string,
      width: number,
      fill?: string,
    ) => {
      ctx.beginPath()
      ctx.arc(x * S, y * S, Math.max(r * S, 2), 0, Math.PI * 2)
      if (fill) {
        ctx.fillStyle = fill
        ctx.fill()
      }
      ctx.strokeStyle = stroke
      ctx.lineWidth = width
      ctx.stroke()
    }

    const dot = (x: number, y: number, r: number, fill: string) => {
      ctx.beginPath()
      ctx.arc(x * S, y * S, r, 0, Math.PI * 2)
      ctx.fillStyle = fill
      ctx.fill()
    }

    if (mode === 'replay') {
      for (let s = 0; s <= visibleStage; s++) {
        const [x, y, r] = game[s]
        const isLast = s === visibleStage
        circle(
          x,
          y,
          r,
          STAGE_COLORS[s],
          isLast ? 4 : 2,
          s === 5 ? 'rgba(255,40,64,0.2)' : undefined,
        )
        dot(x, y, isLast ? 5 : 3, STAGE_COLORS[s])
      }
      return
    }

    if (mode === 'conditional') {
      if (!anchor) return
      // 検索範囲
      circle(anchor[0], anchor[1], NEARBY_THRESHOLD, 'rgba(79,179,232,0.9)', 2, 'rgba(79,179,232,0.12)')
      // 該当試合: リング1中心（白） → 最終安置（赤）を線で結ぶ
      for (const g of nearbyGames) {
        const [x0, y0] = g[0]
        const [fx, fy] = g[5]
        ctx.beginPath()
        ctx.moveTo(x0 * S, y0 * S)
        ctx.lineTo(fx * S, fy * S)
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 1.5
        ctx.stroke()
        dot(x0, y0, 4, 'rgba(255,255,255,0.85)')
        dot(fx, fy, 5, 'rgba(255,40,64,0.9)')
      }
      return
    }

    // ヒートマップ: 指定ステージの中心分布
    for (const g of games) {
      const [x, y] = g[heatStage]
      dot(x, y, 4, heatStage === 5 ? 'rgba(255,40,64,0.65)' : 'rgba(255,200,90,0.6)')
    }
  }, [games, game, mode, visibleStage, anchor, nearbyGames, heatStage])

  useEffect(() => {
    draw()
  }, [draw])

  const handleTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'conditional') return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * COORD_MAX
    const y = ((e.clientY - rect.top) / rect.height) * COORD_MAX
    setAnchor([x, y])
  }

  const lead = (() => {
    if (mode === 'replay') {
      return `${gameIndex % games.length + 1}試合目 / ${games.length}試合 — リング${STAGE_LABELS[visibleStage]}まで表示中`
    }
    if (mode === 'conditional') {
      return anchor
        ? `リング1が青円内だった試合: ${nearbyGames.length}件（白=リング1中心 → 赤=最終安置）`
        : 'マップをタップすると「リング1がその付近だった試合」の最終安置を表示します'
    }
    return `全${games.length}試合のリング${STAGE_LABELS[heatStage]}の中心分布`
  })()

  return (
    <section>
      <div className="tool-header">
        <h2 className="config-title">アンチ傾向</h2>
      </div>
      <div className="controls">
        <div className="control-row">
          <div className="segmented">
            {MAPS.map((m) => (
              <button
                key={m.id}
                className={mapId === m.id ? 'active' : ''}
                onClick={() => changeMap(m.id)}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="segmented">
            <button
              className={mode === 'replay' ? 'active' : ''}
              onClick={() => setMode('replay')}
            >
              試合リプレイ
            </button>
            <button
              className={mode === 'conditional' ? 'active' : ''}
              onClick={() => setMode('conditional')}
            >
              リング1から傾向
            </button>
            <button
              className={mode === 'heatmap' ? 'active' : ''}
              onClick={() => setMode('heatmap')}
            >
              ヒートマップ
            </button>
          </div>
        </div>

        {mode === 'replay' && (
          <div className="control-row">
            <div className="segmented">
              {STAGE_LABELS.map((label, s) => (
                <button
                  key={s}
                  className={visibleStage === s ? 'active' : ''}
                  onClick={() => setVisibleStage(s)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              className="reset-button"
              onClick={() =>
                setGameIndex(Math.floor(Math.random() * games.length))
              }
            >
              別の試合
            </button>
          </div>
        )}

        {mode === 'heatmap' && (
          <div className="control-row">
            <div className="segmented">
              {STAGE_LABELS.map((label, s) => (
                <button
                  key={s}
                  className={heatStage === s ? 'active' : ''}
                  onClick={() => setHeatStage(s)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="ring-practice-lead">{lead}</p>

      <div className="ring-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onClick={handleTap}
          className={mode === 'conditional' ? 'ring-canvas-guessable' : ''}
        />
      </div>

      <p className="hint">
        データ: ALGS実試合{games.length}試合分（S16期のワールズエッジMU3 /
        ストームポイントMU1。現行マップと一部地形が異なります）
      </p>
    </section>
  )
}
