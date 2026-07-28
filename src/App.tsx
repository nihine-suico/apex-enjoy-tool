import { useLocalStorage } from './hooks/useLocalStorage'
import { Randomizer } from './components/Randomizer'
import { ConfigPanel } from './components/ConfigPanel'

type Tab = 'spin' | 'config'

function DiceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M16 8h.01" />
      <path d="M8 8h.01" />
      <path d="M8 16h.01" />
      <path d="M16 16h.01" />
      <path d="M12 12h.01" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function App() {
  const [storedTab, setTab] = useLocalStorage<Tab>('apex-tool:tab', 'spin')
  // 旧バージョンの保存値（'legend'など）は抽選タブにフォールバック
  const tab: Tab = storedTab === 'config' ? 'config' : 'spin'

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="nav-brand">
          APEX <span className="accent">ENJOY</span> TOOL
        </div>
        <button
          className={`nav-item ${tab === 'spin' ? 'active' : ''}`}
          onClick={() => setTab('spin')}
          aria-current={tab === 'spin'}
        >
          <DiceIcon />
          <span>抽選</span>
        </button>
        <button
          className={`nav-item ${tab === 'config' ? 'active' : ''}`}
          onClick={() => setTab('config')}
          aria-current={tab === 'config'}
        >
          <GearIcon />
          <span>設定</span>
        </button>
      </nav>
      <div className="app-main">
        <main>{tab === 'config' ? <ConfigPanel /> : <Randomizer />}</main>
        <footer className="app-footer">
          シーズン29 スプリット2 時点のデータ / 設定はブラウザに自動保存されます
        </footer>
      </div>
    </div>
  )
}
