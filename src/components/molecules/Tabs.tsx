import { X, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

import * as styles from './Tabs.css'

interface Tab {
  id: string
  label: string
  isDirty?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTabId: string | null
  onTabSelect: (id: string) => void
  onTabClose: (id: string) => void
  onNewTab: () => void
  children?: ReactNode
}

export function Tabs({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  children,
}: TabsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${tab.id === activeTabId ? styles.tabActive : ''}`}
            onClick={() => onTabSelect(tab.id)}
          >
            <span className={styles.tabLabel}>
              {tab.isDirty && <span className={styles.dirtyIndicator} />}
              {tab.label}
            </span>
            <button
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(tab.id)
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button className={styles.newTabButton} onClick={onNewTab}>
          <Plus size={14} />
        </button>
      </div>
      {children && <div className={styles.content}>{children}</div>}
    </div>
  )
}
