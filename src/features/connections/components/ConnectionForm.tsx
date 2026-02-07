import { CheckCircle, Loader2, X, XCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '../../../components/atoms/Button'
import type { SavedConnection } from '../../../types/database'
import * as styles from './ConnectionForm.css'

const DEFAULT_POSTGRES_PORT = 5432

interface ConnectionFormProps {
  connection?: SavedConnection
  onSave: (connection: Omit<SavedConnection, 'id'> | SavedConnection) => Promise<void>
  onTest: (connection: SavedConnection) => Promise<boolean>
  onClose: () => void
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error'

export function ConnectionForm({ connection, onSave, onTest, onClose }: ConnectionFormProps) {
  const [name, setName] = useState(connection?.name ?? '')
  const [host, setHost] = useState(connection?.host ?? 'localhost')
  const [port, setPort] = useState(connection?.port ?? DEFAULT_POSTGRES_PORT)
  const [user, setUser] = useState(connection?.user ?? 'postgres')
  const [password, setPassword] = useState(connection?.password ?? '')
  const [database, setDatabase] = useState(connection?.database ?? '')
  const [testStatus, setTestStatus] = useState<TestStatus>('idle')
  const [testError, setTestError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const isEditing = Boolean(connection?.id)

  const buildConnection = (): SavedConnection => ({
    id: connection?.id ?? '',
    name: name || `${host}:${port}/${database}`,
    host,
    port,
    user,
    password,
    database,
  })

  const handleTest = async () => {
    setTestStatus('testing')
    setTestError(null)

    try {
      await onTest(buildConnection())
      setTestStatus('success')
    } catch (err) {
      setTestStatus('error')
      setTestError(err instanceof Error ? err.message : String(err))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const connectionData = buildConnection()
      await onSave(connectionData)
      onClose()
    } catch {
      // Error handled by parent
    } finally {
      setIsSaving(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{isEditing ? 'Edit Connection' : 'New Connection'}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <X size={16} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Connection Name</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Database"
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Host</label>
              <input
                className={styles.input}
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Port</label>
              <input
                className={styles.input}
                type="number"
                value={port}
                onChange={(e) => setPort(parseInt(e.target.value, 10) || DEFAULT_POSTGRES_PORT)}
                placeholder="5432"
                required
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>User</label>
              <input
                className={styles.input}
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="postgres"
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Database</label>
            <input
              className={styles.input}
              type="text"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              placeholder="postgres"
              required
            />
          </div>

          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <Button
                type="button"
                variant="secondary"
                onClick={handleTest}
                disabled={testStatus === 'testing'}
              >
                {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
              </Button>
              {testStatus === 'success' && (
                <span className={styles.testSuccess}>
                  <CheckCircle size={14} />
                  Connected
                </span>
              )}
              {testStatus === 'error' && (
                <span className={styles.testError}>
                  <XCircle size={14} />
                  {testError || 'Failed'}
                </span>
              )}
              {testStatus === 'testing' && (
                <span className={styles.testLoading}>
                  <Loader2 size={14} className={styles.spinAnimation} />
                </span>
              )}
            </div>
            <div className={styles.footerRight}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Save & Connect'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
