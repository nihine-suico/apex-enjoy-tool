import { useState } from 'react'
import {
  LEGENDS,
  LEGEND_CLASS_LABELS,
  type Legend,
} from '../data/legends'
import {
  CLOSE_RANGE_CATEGORIES,
  WEAPONS,
  WEAPON_CATEGORY_LABELS,
  type Weapon,
} from '../data/weapons'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useRoulette } from '../hooks/useRoulette'
import { legendImage, weaponImage } from '../utils/images'
import { randomPick, weightedSample } from '../utils/random'
import { statusWeight, type StatusMap } from '../utils/status'

// 1人分の抽選結果（レジェンド + 武器2枠）
interface PlayerResult {
  legend: Legend
  weapons: Weapon[]
}

const PLAYER_COUNT_LABELS: Record<number, string> = {
  1: 'ソロ',
  2: 'デュオ',
  3: 'トリオ',
}

const WEAPON_SLOT_LABELS = ['メイン', 'サブ']

export function Randomizer() {
  const [legendStatuses] = useLocalStorage<StatusMap>(
    'apex-tool:legend-statuses',
    {},
  )
  const [weaponStatuses] = useLocalStorage<StatusMap>(
    'apex-tool:weapon-statuses',
    {},
  )
  const [playerCount, setPlayerCount] = useLocalStorage<number>(
    'apex-tool:player-count',
    3,
  )
  const [drawWeapons, setDrawWeapons] = useLocalStorage<boolean>(
    'apex-tool:draw-weapons',
    true,
  )
  const [balanceMode, setBalanceMode] = useLocalStorage<boolean>(
    'apex-tool:weapon-balance',
    false,
  )
  const [includeCarePackage, setIncludeCarePackage] = useLocalStorage<boolean>(
    'apex-tool:weapon-carepkg',
    false,
  )
  const [playerNames, setPlayerNames] = useLocalStorage<string[]>(
    'apex-tool:player-names',
    ['', '', ''],
  )
  const [error, setError] = useState<string | null>(null)
  const roulette = useRoulette<PlayerResult>()

  const setPlayerName = (index: number, name: string) => {
    setPlayerNames((prev) => {
      const next = [...prev]
      next[index] = name
      return next
    })
  }

  // 結果カードに表示するラベル（名前があれば名前、なければ 1P / YOU）
  const playerLabel = (index: number) => {
    const name = playerNames[index]?.trim()
    if (name) return name
    return playerCount > 1 ? `${index + 1}P` : 'YOU'
  }

  const legendCandidates = LEGENDS.filter(
    (l) => legendStatuses[l.id] !== 'excluded',
  )
  const weaponCandidates = WEAPONS.filter(
    (w) =>
      weaponStatuses[w.id] !== 'excluded' &&
      (includeCarePackage || !w.carePackage),
  )
  const closePool = weaponCandidates.filter((w) =>
    CLOSE_RANGE_CATEGORIES.includes(w.category),
  )
  const longPool = weaponCandidates.filter(
    (w) => !CLOSE_RANGE_CATEGORIES.includes(w.category),
  )

  const toWeighted = (list: Weapon[]) =>
    list.map((w) => ({ item: w, weight: statusWeight(weaponStatuses[w.id]) }))

  // 1人分の武器セットを抽選する
  const drawWeaponSet = (): Weapon[] => {
    if (balanceMode) {
      return [
        ...weightedSample(toWeighted(closePool), 1),
        ...weightedSample(toWeighted(longPool), 1),
      ]
    }
    return weightedSample(toWeighted(weaponCandidates), 2)
  }

  const spin = () => {
    if (legendCandidates.length < playerCount) {
      setError(
        `レジェンドの候補が${legendCandidates.length}人しかいません（${playerCount}人必要）。設定タブで除外を減らしてください。`,
      )
      return
    }
    if (drawWeapons) {
      if (balanceMode && (closePool.length === 0 || longPool.length === 0)) {
        setError(
          '近距離武器・中遠距離武器の両方に候補が必要です。設定タブで除外を見直してください。',
        )
        return
      }
      if (!balanceMode && weaponCandidates.length < 2) {
        setError('武器の候補が2本未満です。設定タブで除外を見直してください。')
        return
      }
    }
    setError(null)

    const legends = weightedSample(
      legendCandidates.map((l) => ({
        item: l,
        weight: statusWeight(legendStatuses[l.id]),
      })),
      playerCount,
    )
    const results: PlayerResult[] = legends.map((legend) => ({
      legend,
      weapons: drawWeapons ? drawWeaponSet() : [],
    }))

    // 回転中に表示するダミー結果
    const randomResult = (): PlayerResult => ({
      legend: randomPick(legendCandidates),
      weapons: drawWeapons
        ? [randomPick(weaponCandidates), randomPick(weaponCandidates)]
        : [],
    })
    roulette.start(results, randomResult)
  }

  return (
    <section>
      <div className="controls">
        <div className="control-row">
          <div className="segmented">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={playerCount === n ? 'active' : ''}
                onClick={() => setPlayerCount(n)}
                disabled={roulette.spinning}
              >
                {PLAYER_COUNT_LABELS[n]}
              </button>
            ))}
          </div>
        </div>
        <div className="control-row">
          {Array.from({ length: playerCount }, (_, i) => (
            <input
              key={i}
              className="player-name-input"
              type="text"
              value={playerNames[i] ?? ''}
              onChange={(e) => setPlayerName(i, e.target.value)}
              placeholder={`プレイヤー${i + 1}の名前`}
              aria-label={`プレイヤー${i + 1}の名前`}
              maxLength={12}
              disabled={roulette.spinning}
            />
          ))}
        </div>
        <div className="control-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={drawWeapons}
              onChange={(e) => setDrawWeapons(e.target.checked)}
              disabled={roulette.spinning}
            />
            武器も抽選する
          </label>
          <label className={`toggle ${drawWeapons ? '' : 'toggle-disabled'}`}>
            <input
              type="checkbox"
              checked={balanceMode}
              onChange={(e) => setBalanceMode(e.target.checked)}
              disabled={roulette.spinning || !drawWeapons}
            />
            バランス重視（近 + 中遠）
          </label>
          <label className={`toggle ${drawWeapons ? '' : 'toggle-disabled'}`}>
            <input
              type="checkbox"
              checked={includeCarePackage}
              onChange={(e) => setIncludeCarePackage(e.target.checked)}
              disabled={roulette.spinning || !drawWeapons}
            />
            ケアパケ武器を含める
          </label>
        </div>
        <button
          className="spin-button"
          onClick={spin}
          disabled={roulette.spinning}
        >
          {roulette.spinning ? '抽選中…' : '抽選スタート！'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {roulette.display.length > 0 && (
        <div className="results">
          {roulette.display.map((result, i) => (
            <div
              key={i}
              className={`result-card class-${result.legend.legendClass} ${
                i < roulette.settledCount ? 'settled' : 'rolling'
              }`}
            >
              <span className="result-label">{playerLabel(i)}</span>
              <img
                className="result-portrait"
                src={legendImage(result.legend.id)}
                alt={result.legend.name}
              />
              <span className="result-name">{result.legend.name}</span>
              <span className="result-sub">
                {LEGEND_CLASS_LABELS[result.legend.legendClass]}
              </span>
              {result.weapons.length > 0 && (
                <div className="result-weapons">
                  {result.weapons.map((weapon, wi) => (
                    <div key={wi} className="result-weapon-row">
                      <img src={weaponImage(weapon.id)} alt="" />
                      <div className="result-weapon-info">
                        <span className="result-weapon-slot">
                          {WEAPON_SLOT_LABELS[wi]}
                        </span>
                        <span className="result-weapon-name">
                          {weapon.name}
                        </span>
                        <span className="result-weapon-cat">
                          {WEAPON_CATEGORY_LABELS[weapon.category]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="hint">
        お気に入り・除外の設定は「設定」タブから変更できます
      </p>
    </section>
  )
}
