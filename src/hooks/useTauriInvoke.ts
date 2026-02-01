import { invoke } from '@tauri-apps/api/core'
import { useCallback, useState } from 'react'

interface UseTauriInvokeResult<T> {
  data: T | null
  error: string | null
  isLoading: boolean
  execute: (...args: unknown[]) => Promise<T | null>
}

export function useTauriInvoke<T>(command: string): UseTauriInvokeResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await invoke<T>(command, args[0] as Record<string, unknown>)
        setData(result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [command]
  )

  return { data, error, isLoading, execute }
}
