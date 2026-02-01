import { Database, Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../../components/atoms/Button'
import type { SavedConnection } from '../../../types/database'
import { useConnections } from '../hooks/useConnections'
import { ConnectionCard } from './ConnectionCard'
import { ConnectionForm } from './ConnectionForm'
import * as styles from './ConnectionList.css'

export function ConnectionList() {
  const {
    connections,
    isLoading,
    error,
    saveNewConnection,
    updateExistingConnection,
    deleteConnectionById,
    testConnectionById,
    connectToDatabase,
  } = useConnections()

  const [showForm, setShowForm] = useState(false)
  const [editingConnection, setEditingConnection] = useState<SavedConnection | undefined>()

  const handleNewConnection = () => {
    setEditingConnection(undefined)
    setShowForm(true)
  }

  const handleEdit = (connection: SavedConnection) => {
    setEditingConnection(connection)
    setShowForm(true)
  }

  const handleDelete = async (connection: SavedConnection) => {
    if (window.confirm(`Delete connection "${connection.name}"?`)) {
      await deleteConnectionById(connection.id)
    }
  }

  const handleConnect = async (connection: SavedConnection) => {
    try {
      await connectToDatabase(connection)
    } catch {
      // Error is handled in useConnections
    }
  }

  const handleSave = async (connection: Omit<SavedConnection, 'id'> | SavedConnection) => {
    if ('id' in connection && connection.id) {
      await updateExistingConnection(connection as SavedConnection)
    } else {
      const saved = await saveNewConnection(connection)
      await connectToDatabase(saved)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingConnection(undefined)
  }

  if (isLoading && connections.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading connections...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Connections</h1>
        <Button variant="primary" onClick={handleNewConnection}>
          <Plus size={16} />
          New Connection
        </Button>
      </div>

      <div className={styles.content}>
        {error && <div className={styles.errorState}>{error}</div>}

        {connections.length === 0 ? (
          <div className={styles.emptyState}>
            <Database size={48} strokeWidth={1} />
            <p className={styles.emptyText}>No saved connections yet</p>
            <Button variant="primary" onClick={handleNewConnection}>
              <Plus size={16} />
              Add Connection
            </Button>
          </div>
        ) : (
          <div className={styles.connectionsList}>
            {connections.map((connection) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                onConnect={handleConnect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ConnectionForm
          connection={editingConnection}
          onSave={handleSave}
          onTest={testConnectionById}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
