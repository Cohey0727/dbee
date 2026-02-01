import { useCallback, useRef } from 'react'

import { useResultsStore } from '../stores/resultsStore'
import * as styles from './ResultsTable.css'

interface ResultsTableProps {
  onAddWhereClause?: (column: string, value: unknown) => void
}

export function ResultsTable({ onAddWhereClause }: ResultsTableProps) {
  const { results, isExecuting, error } = useResultsStore()
  const tableRef = useRef<HTMLTableElement>(null)

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLTableCellElement>,
      rowIndex: number,
      cellIndex: number,
      column: string,
      value: unknown
    ) => {
      if (e.key === ';' && e.metaKey && onAddWhereClause) {
        e.preventDefault()
        onAddWhereClause(column, value)
        return
      }

      if (!results) return

      let nextRow = rowIndex
      let nextCell = cellIndex

      switch (e.key) {
        case 'ArrowUp':
          nextRow = Math.max(0, rowIndex - 1)
          break
        case 'ArrowDown':
          nextRow = Math.min(results.rows.length - 1, rowIndex + 1)
          break
        case 'ArrowLeft':
          nextCell = Math.max(0, cellIndex - 1)
          break
        case 'ArrowRight':
          nextCell = Math.min(results.columns.length - 1, cellIndex + 1)
          break
        default:
          return
      }

      e.preventDefault()
      const nextElement = tableRef.current?.querySelector(
        `[data-row="${nextRow}"][data-cell="${nextCell}"]`
      ) as HTMLElement | null
      nextElement?.focus()
    },
    [onAddWhereClause, results]
  )

  if (isExecuting) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>Executing query...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>Run a query to see results (Cmd+Enter)</div>
      </div>
    )
  }

  if (results.rowsAffected != null) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          Query executed successfully. {results.rowsAffected} row(s) affected.
          <br />
          <span className={styles.executionTime}>{results.executionTimeMs}ms</span>
        </div>
      </div>
    )
  }

  if (results.columns.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.message}>
          No results returned.
          <br />
          <span className={styles.executionTime}>{results.executionTimeMs}ms</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table ref={tableRef} className={styles.table}>
          <thead>
            <tr>
              {results.columns.map((column, i) => (
                <th key={i} className={styles.th}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.tr}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    data-row={rowIndex}
                    data-cell={cellIndex}
                    className={onAddWhereClause ? styles.tdFocusable : styles.td}
                    tabIndex={onAddWhereClause ? 0 : undefined}
                    onKeyDown={
                      onAddWhereClause
                        ? (e) =>
                            handleKeyDown(e, rowIndex, cellIndex, results.columns[cellIndex], cell)
                        : undefined
                    }
                  >
                    {formatCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatCell(value: unknown): string {
  if (value === null) {
    return 'NULL'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}
