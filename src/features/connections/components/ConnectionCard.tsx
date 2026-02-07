import { Database, Pencil, Trash2 } from 'lucide-react'
import type { KeyboardEvent, MouseEvent } from 'react'

import type { SavedConnection } from '../../../types/database'
import * as styles from './ConnectionCard.css'

interface ConnectionCardProps {
  connection: SavedConnection
  onConnect: (connection: SavedConnection) => void
  onEdit: (connection: SavedConnection) => void
  onDelete: (connection: SavedConnection) => void
}

export function ConnectionCard({ connection, onConnect, onEdit, onDelete }: ConnectionCardProps) {
  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation()
    onEdit(connection)
  }

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    onDelete(connection)
  }

  const handleConnect = () => {
    onConnect(connection)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onConnect(connection)
    }
  }

  return (
    <div
      className={styles.card}
      onClick={handleConnect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.cardHeader}>
        <div className={styles.icon}>
          <Database size={18} />
        </div>
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleEdit} title="Edit connection">
            <Pencil size={13} />
          </button>
          <button className={styles.deleteButton} onClick={handleDelete} title="Delete connection">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{connection.name}</div>
        <div className={styles.details}>
          {connection.host}:{connection.port}/{connection.database}
        </div>
      </div>
    </div>
  )
}
