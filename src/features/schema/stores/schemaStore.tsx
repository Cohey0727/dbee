import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

import type { ConnectionInfo, DatabaseSchema } from '../../../types/database'

interface SchemaContextValue {
  connection: ConnectionInfo | null
  schema: DatabaseSchema | null
  isLoading: boolean
  error: string | null
  setConnection: (connection: ConnectionInfo | null) => void
  setSchema: (schema: DatabaseSchema | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const SchemaContext = createContext<SchemaContextValue | null>(null)

export function SchemaProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<ConnectionInfo | null>(null)
  const [schema, setSchema] = useState<DatabaseSchema | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setConnection(null)
    setSchema(null)
    setLoading(false)
    setError(null)
  }, [])

  return (
    <SchemaContext.Provider
      value={{
        connection,
        schema,
        isLoading,
        error,
        setConnection,
        setSchema,
        setLoading,
        setError,
        reset,
      }}
    >
      {children}
    </SchemaContext.Provider>
  )
}

export function useSchemaStore(): SchemaContextValue {
  const context = useContext(SchemaContext)
  if (!context) {
    throw new Error('useSchemaStore must be used within SchemaProvider')
  }
  return context
}
