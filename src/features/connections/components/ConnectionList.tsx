import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'

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
        <div className={styles.loadingState}>
          <Loader2 size={24} className={styles.loadingSpinner} />
          <span>Loading connections...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.logoContainer}>
          <img src="/logo_white.png" alt="DBee" className={styles.logoImage} />
        </div>
        <h1 className={styles.appName}>DBee</h1>
        <p className={styles.tagline}>PostgreSQL Database Client</p>
      </div>

      <div className={styles.main}>
        {error && <div className={styles.errorState}>{error}</div>}

        {connections.length === 0 ? (
          <>
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No saved connections yet</p>
              <p className={styles.emptyHint}>Create your first connection to get started</p>
            </div>
            <div className={styles.connectionGrid}>
              <button className={styles.newConnectionCard} onClick={handleNewConnection} type="button">
                <Plus size={24} />
                <span>New Connection</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Connections</span>
            </div>
            <div className={styles.connectionGrid}>
              {connections.map((connection) => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onConnect={handleConnect}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              <button className={styles.newConnectionCard} onClick={handleNewConnection} type="button">
                <Plus size={24} />
                <span>New Connection</span>
              </button>
            </div>
          </>
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
