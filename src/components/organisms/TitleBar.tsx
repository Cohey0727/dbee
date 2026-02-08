import { LogOut, MessageSquare, RefreshCw } from 'lucide-react'

import { Button } from '../atoms/Button'
import { useAiStore } from '../../features/ai/stores/aiStore'
import { useSchema } from '../../features/schema/hooks/useSchema'
import * as styles from './TitleBar.css'

export function TitleBar() {
  const { connection, isLoading, disconnectFromDatabase, refreshSchema } = useSchema()
  const { isPanelOpen, togglePanel } = useAiStore()

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img src="/logo_white.png" alt="DBee" className={styles.logo} />
        <span>DBee</span>
        {connection && <span className={styles.connectionName}>- {connection.name}</span>}
      </div>

      <div className={styles.actions}>
        {connection && (
          <>
            <Button variant="ghost" size="sm" onClick={refreshSchema} disabled={isLoading}>
              <RefreshCw size={14} className={isLoading ? styles.spinning : undefined} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePanel}
              className={isPanelOpen ? styles.activeToggle : undefined}
            >
              <MessageSquare size={14} />
              AI
            </Button>
            <Button variant="ghost" size="sm" onClick={disconnectFromDatabase} disabled={isLoading}>
              <LogOut size={14} />
              Disconnect
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
