import { useCallback } from 'react'

import { useSchemaStore } from '../stores/schemaStore'
import * as schemaApi from '../api/schemaApi'

export function useSchema() {
  const { connection, schema, isLoading, error, setSchema, setLoading, setError, reset } =
    useSchemaStore()

  const disconnectFromDatabase = useCallback(async () => {
    try {
      await schemaApi.disconnect()
      reset()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
    }
  }, [reset, setError])

  const refreshSchema = useCallback(async () => {
    if (!connection) return

    setLoading(true)
    try {
      const schemaData = await schemaApi.getSchema()
      setSchema(schemaData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [connection, setSchema, setLoading, setError])

  return {
    connection,
    schema,
    isLoading,
    error,
    disconnectFromDatabase,
    refreshSchema,
  }
}
