import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

import type { SavedConnection } from '../../../types/database'

interface ConnectionsContextValue {
  connections: SavedConnection[]
  isLoading: boolean
  error: string | null
  setConnections: (connections: SavedConnection[]) => void
  addConnection: (connection: SavedConnection) => void
  updateConnection: (connection: SavedConnection) => void
  removeConnection: (id: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

const ConnectionsContext = createContext<ConnectionsContextValue | null>(null)

export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<SavedConnection[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addConnection = useCallback((connection: SavedConnection) => {
    setConnections((prev) => [...prev, connection])
  }, [])

  const updateConnection = useCallback((connection: SavedConnection) => {
    setConnections((prev) => prev.map((c) => (c.id === connection.id ? connection : c)))
  }, [])

  const removeConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return (
    <ConnectionsContext.Provider
      value={{
        connections,
        isLoading,
        error,
        setConnections,
        addConnection,
        updateConnection,
        removeConnection,
        setLoading,
        setError,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  )
}

export function useConnectionsStore(): ConnectionsContextValue {
  const context = useContext(ConnectionsContext)
  if (!context) {
    throw new Error('useConnectionsStore must be used within ConnectionsProvider')
  }
  return context
}
