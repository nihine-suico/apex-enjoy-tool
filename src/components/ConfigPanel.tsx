import {
  LEGENDS,
  LEGEND_CLASS_LABELS,
  type LegendClass,
} from '../data/legends'
import {
  WEAPONS,
  WEAPON_CATEGORY_LABELS,
  type WeaponCategory,
} from '../data/weapons'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { legendImage, weaponImage } from '../utils/images'
import { cycleStatus, type StatusMap } from '../utils/status'

const CLASS_ORDER: LegendClass[] = [
  'assault',
  'skirmisher',
  'recon',
  'support',
  'controller',
]

const CATEGORY_ORDER: WeaponCategory[] = [
  'ar',
  'smg',
  'lmg',
  'marksman',
  'sniper',
  'shotgun',
  'pistol',
]

export function ConfigPanel() {
  const [legendStatuses, setLegendStatuses] = useLocalStorage<StatusMap>(
    'apex-tool:legend-statuses',
    {},
  )
  const [weaponStatuses, setWeaponStatuses] = useLocalStorage<StatusMap>(
    'apex-tool:weapon-statuses',
    {},
  )

  const toggleLegend = (id: string) => {
    setLegendStatuses((prev) => ({ ...prev, [id]: cycleStatus(prev[id]) }))
  }

  const toggleWeapon = (id: string) => {
    setWeaponStatuses((prev) => ({ ...prev, [id]: cycleStatus(prev[id]) }))
  }

  return (
    <section>
      <p className="hint">
        クリックで切り替え：通常 → ★お気に入り（3倍出やすい） → 除外
      </p>

      <div className="config-section">
        <div className="config-header">
          <h2 className="config-title">レジェンド</h2>
          <button
            className="reset-button"
            onClick={() => setLegendStatuses({})}
          >
            リセット
          </button>
        </div>
        {CLASS_ORDER.map((cls) => (
          <div key={cls} className="item-group">
            <h3 className={`group-title class-text-${cls}`}>
              {LEGEND_CLASS_LABELS[cls]}
            </h3>
            <div className="chip-grid">
              {LEGENDS.filter((l) => l.legendClass === cls).map((legend) => {
                const status = legendStatuses[legend.id] ?? 'normal'
                return (
                  <button
                    key={legend.id}
                    className={`chip status-${status} class-${legend.legendClass}`}
                    onClick={() => toggleLegend(legend.id)}
                  >
                    <img
                      className="chip-avatar"
                      src={legendImage(legend.id)}
                      alt=""
                    />
                    {status === 'favorite' && <span className="star">★</span>}
                    {legend.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="config-section">
        <div className="config-header">
          <h2 className="config-title">武器</h2>
          <button
            className="reset-button"
            onClick={() => setWeaponStatuses({})}
          >
            リセット
          </button>
        </div>
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className="item-group">
            <h3 className="group-title">{WEAPON_CATEGORY_LABELS[cat]}</h3>
            <div className="chip-grid">
              {WEAPONS.filter((w) => w.category === cat).map((weapon) => {
                const status = weaponStatuses[weapon.id] ?? 'normal'
                return (
                  <button
                    key={weapon.id}
                    className={`chip status-${status}`}
                    onClick={() => toggleWeapon(weapon.id)}
                    title={
                      weapon.carePackage ? 'ケアパッケージ武器' : undefined
                    }
                  >
                    <img
                      className="chip-weapon-image"
                      src={weaponImage(weapon.id)}
                      alt=""
                    />
                    {status === 'favorite' && <span className="star">★</span>}
                    {weapon.name}
                    {weapon.carePackage && (
                      <span className="care-badge">CP</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
