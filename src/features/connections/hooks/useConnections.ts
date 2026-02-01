import { useCallback, useEffect } from 'react'

import type { ConnectionConfig, SavedConnection } from '../../../types/database'
import { useSchemaStore } from '../../schema/stores/schemaStore'
import * as connectionsApi from '../api/connectionsApi'
import * as schemaApi from '../../schema/api/schemaApi'
import { useConnectionsStore } from '../stores/connectionsStore'

export function useConnections() {
  const {
    connections,
    isLoading,
    error,
    setConnections,
    addConnection,
    updateConnection,
    removeConnection,
    setLoading,
    setError,
  } = useConnectionsStore()

  const { setConnection, setSchema, setLoading: setSchemaLoading, setError: setSchemaError } = useSchemaStore()

  const loadConnections = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const savedConnections = await connectionsApi.listSavedConnections()
      setConnections(savedConnections)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [setConnections, setLoading, setError])

  const saveNewConnection = useCallback(
    async (connection: Omit<SavedConnection, 'id'>) => {
      setLoading(true)
      setError(null)

      try {
        const saved = await connectionsApi.saveConnection({
          ...connection,
          id: '',
        })
        addConnection(saved)
        return saved
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [addConnection, setLoading, setError]
  )

  const updateExistingConnection = useCallback(
    async (connection: SavedConnection) => {
      setLoading(true)
      setError(null)

      try {
        const updated = await connectionsApi.saveConnection(connection)
        updateConnection(updated)
        return updated
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [updateConnection, setLoading, setError]
  )

  const deleteConnectionById = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)

      try {
        await connectionsApi.deleteConnection(id)
        removeConnection(id)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [removeConnection, setLoading, setError]
  )

  const testConnectionById = useCallback(
    async (connection: SavedConnection) => {
      try {
        return await connectionsApi.testConnection(connection)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        throw new Error(errorMessage)
      }
    },
    []
  )

  const connectToDatabase = useCallback(
    async (connection: SavedConnection) => {
      setSchemaLoading(true)
      setSchemaError(null)

      try {
        const config: ConnectionConfig = {
          id: connection.id,
          name: connection.name,
          host: connection.host,
          port: connection.port,
          user: connection.user,
          password: connection.password,
          database: connection.database,
        }

        const connectionInfo = await connectionsApi.connect(config)
        setConnection(connectionInfo)

        const schemaData = await schemaApi.getSchema()
        setSchema(schemaData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setSchemaError(errorMessage)
        throw err
      } finally {
        setSchemaLoading(false)
      }
    },
    [setConnection, setSchema, setSchemaLoading, setSchemaError]
  )

  useEffect(() => {
    loadConnections()
  }, [loadConnections])

  return {
    connections,
    isLoading,
    error,
    loadConnections,
    saveNewConnection,
    updateExistingConnection,
    deleteConnectionById,
    testConnectionById,
    connectToDatabase,
  }
}
