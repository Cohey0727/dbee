import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

import type { QueryResult } from '../../../types/database'

interface ResultsContextValue {
  results: QueryResult | null
  isExecuting: boolean
  error: string | null
  setResults: (results: QueryResult | null) => void
  setExecuting: (isExecuting: boolean) => void
  setError: (error: string | null) => void
  clear: () => void
}

const ResultsContext = createContext<ResultsContextValue | null>(null)

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [results, setResultsState] = useState<QueryResult | null>(null)
  const [isExecuting, setExecuting] = useState(false)
  const [error, setErrorState] = useState<string | null>(null)

  const setResults = useCallback((results: QueryResult | null) => {
    setResultsState(results)
    setErrorState(null)
  }, [])

  const setError = useCallback((error: string | null) => {
    setErrorState(error)
    setResultsState(null)
  }, [])

  const clear = useCallback(() => {
    setResultsState(null)
    setExecuting(false)
    setErrorState(null)
  }, [])

  return (
    <ResultsContext.Provider
      value={{
        results,
        isExecuting,
        error,
        setResults,
        setExecuting,
        setError,
        clear,
      }}
    >
      {children}
    </ResultsContext.Provider>
  )
}

export function useResultsStore(): ResultsContextValue {
  const context = useContext(ResultsContext)
  if (!context) {
    throw new Error('useResultsStore must be used within ResultsProvider')
  }
  return context
}
