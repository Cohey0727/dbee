import { useCallback } from 'react'

import { useEditorStore } from '../stores/editorStore'
import { useResultsStore } from '../../results/stores/resultsStore'
import { executeQuery } from '../api/queryApi'

export function useEditor() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab, updateTabContent } = useEditorStore()

  const { setResults, setExecuting, setError } = useResultsStore()

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]

  const runQuery = useCallback(async () => {
    if (!activeTab?.content.trim()) return

    setExecuting(true)
    setError(null)

    try {
      const results = await executeQuery(activeTab.content)
      setResults(results)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
    } finally {
      setExecuting(false)
    }
  }, [activeTab, setResults, setExecuting, setError])

  const runQueryWithContent = useCallback(
    async (query: string) => {
      if (!activeTab) return

      updateTabContent(activeTab.id, query)

      setExecuting(true)
      setError(null)

      try {
        const results = await executeQuery(query)
        setResults(results)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        setError(errorMessage)
      } finally {
        setExecuting(false)
      }
    },
    [activeTab, updateTabContent, setResults, setExecuting, setError]
  )

  const handleContentChange = useCallback(
    (content: string) => {
      if (activeTab) {
        updateTabContent(activeTab.id, content)
      }
    },
    [activeTab, updateTabContent]
  )

  const appendWhereClause = useCallback(
    (column: string, value: unknown) => {
      if (!activeTab) return

      const currentQuery = activeTab.content.trim().replace(/;$/, '')
      const formattedValue = formatValueForSql(value)
      const whereClause = value === null ? `${column} IS NULL` : `${column} = ${formattedValue}`

      const hasWhere = /\bWHERE\b/i.test(currentQuery)
      const newQuery = hasWhere
        ? `${currentQuery} AND ${whereClause};`
        : `${currentQuery} WHERE ${whereClause};`

      updateTabContent(activeTab.id, newQuery)
    },
    [activeTab, updateTabContent]
  )

  return {
    tabs,
    activeTab,
    activeTabId,
    addTab,
    closeTab,
    setActiveTab,
    updateTabContent: handleContentChange,
    runQuery,
    runQueryWithContent,
    appendWhereClause,
  }
}

function formatValueForSql(value: unknown): string {
  if (value === null) {
    return 'NULL'
  }
  if (typeof value === 'number') {
    return String(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`
  }
  return `'${String(value).replace(/'/g, "''")}'`
}
