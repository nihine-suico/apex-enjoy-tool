import type { ReactElement } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { Randomizer } from './components/Randomizer'
import { ConfigPanel } from './components/ConfigPanel'
import { MapRotation } from './components/MapRotation'
import { RingAnalysis } from './components/RingAnalysis'

type Tab = 'spin' | 'map' | 'ring' | 'config'

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

function DiceIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M16 8h.01" />
      <path d="M8 8h.01" />
      <path d="M8 16h.01" />
      <path d="M16 16h.01" />
      <path d="M12 12h.01" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  )
}

function CrosshairIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="18" y1="12" y2="12" />
      <line x1="6" x2="2" y1="12" y2="12" />
      <line x1="12" x2="12" y1="6" y2="2" />
      <line x1="12" x2="12" y1="22" y2="18" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

const NAV_ITEMS: { id: Tab; label: string; icon: () => ReactElement }[] = [
  { id: 'spin', label: '抽選', icon: DiceIcon },
  { id: 'map', label: 'マップ', icon: MapIcon },
  { id: 'ring', label: 'アンチ', icon: CrosshairIcon },
  { id: 'config', label: '設定', icon: GearIcon },
]

const VALID_TABS: Tab[] = ['spin', 'map', 'ring', 'config']

export default function App() {
  const [storedTab, setTab] = useLocalStorage<Tab>('apex-tool:tab', 'spin')
  // 旧バージョンの保存値は抽選タブにフォールバック
  const tab: Tab = VALID_TABS.includes(storedTab) ? storedTab : 'spin'

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="nav-brand">
          APEX <span className="accent">ENJOY</span> TOOL
        </div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${tab === item.id ? 'active' : ''}`}
            onClick={() => setTab(item.id)}
            aria-current={tab === item.id}
          >
            <item.icon />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="app-main">
        <main>
          {tab === 'spin' && <Randomizer />}
          {tab === 'map' && <MapRotation />}
          {tab === 'ring' && <RingAnalysis />}
          {tab === 'config' && <ConfigPanel />}
        </main>
        <footer className="app-footer">
          シーズン29 スプリット2 時点のデータ / 設定はブラウザに自動保存されます
        </footer>
      </div>
    </div>
  )
}
