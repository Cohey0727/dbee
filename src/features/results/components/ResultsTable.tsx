import { useCallback, useRef, useState } from 'react'

import { useResultsStore } from '../stores/resultsStore'
import * as styles from './ResultsTable.css'

interface CellEdit {
  rowIndex: number
  cellIndex: number
  originalValue: unknown
  newValue: string
}

interface EditingCell {
  rowIndex: number
  cellIndex: number
  value: string
}

interface ResultsTableProps {
  onAddWhereClause?: (column: string, value: unknown) => void
}

export function ResultsTable({ onAddWhereClause }: ResultsTableProps) {
  const { results, isExecuting, error } = useResultsStore()
  const tableRef = useRef<HTMLTableElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [modifications, setModifications] = useState<Map<string, CellEdit>>(new Map())

  const getCellKey = (rowIndex: number, cellIndex: number) => `${rowIndex}-${cellIndex}`

  const startEditing = useCallback(
    (rowIndex: number, cellIndex: number, currentValue: unknown) => {
      const key = getCellKey(rowIndex, cellIndex)
      const existingMod = modifications.get(key)
      const value = existingMod ? existingMod.newValue : formatCell(currentValue)

      setEditingCell({
        rowIndex,
        cellIndex,
        value,
      })

      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    },
    [modifications]
  )

  const commitEdit = useCallback(() => {
    if (!editingCell || !results) return

    const { rowIndex, cellIndex, value } = editingCell
    const key = getCellKey(rowIndex, cellIndex)
    const originalValue = results.rows[rowIndex][cellIndex]
    const originalFormatted = formatCell(originalValue)

    if (value !== originalFormatted) {
      setModifications((prev) => {
        const next = new Map(prev)
        next.set(key, {
          rowIndex,
          cellIndex,
          originalValue,
          newValue: value,
        })
        return next
      })
    } else {
      setModifications((prev) => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
    }

    setEditingCell(null)
  }, [editingCell, results])

  const cancelEdit = useCallback(() => {
    setEditingCell(null)
  }, [])

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        commitEdit()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cancelEdit()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        commitEdit()

        if (!results || !editingCell) return

        const nextCell = e.shiftKey
          ? Math.max(0, editingCell.cellIndex - 1)
          : Math.min(results.columns.length - 1, editingCell.cellIndex + 1)

        if (nextCell !== editingCell.cellIndex) {
          const currentValue = results.rows[editingCell.rowIndex][nextCell]
          startEditing(editingCell.rowIndex, nextCell, currentValue)
        }
      }
    },
    [commitEdit, cancelEdit, results, editingCell, startEditing]
  )

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

      if (e.key === 'Enter' || e.key === 'F2') {
        e.preventDefault()
        startEditing(rowIndex, cellIndex, value)
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
    [onAddWhereClause, results, startEditing]
  )

  const handleDoubleClick = useCallback(
    (rowIndex: number, cellIndex: number, value: unknown) => {
      startEditing(rowIndex, cellIndex, value)
    },
    [startEditing]
  )

  const getCellValue = (rowIndex: number, cellIndex: number, originalValue: unknown): string => {
    const key = getCellKey(rowIndex, cellIndex)
    const mod = modifications.get(key)
    return mod ? mod.newValue : formatCell(originalValue)
  }

  const isCellModified = (rowIndex: number, cellIndex: number): boolean => {
    const key = getCellKey(rowIndex, cellIndex)
    return modifications.has(key)
  }

  const isEditing = (rowIndex: number, cellIndex: number): boolean => {
    return editingCell?.rowIndex === rowIndex && editingCell?.cellIndex === cellIndex
  }

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
                {row.map((cell, cellIndex) => {
                  if (isEditing(rowIndex, cellIndex)) {
                    return (
                      <td key={cellIndex} className={styles.tdEditing}>
                        <input
                          ref={inputRef}
                          type="text"
                          className={styles.cellInput}
                          value={editingCell?.value ?? ''}
                          onChange={(e) =>
                            setEditingCell((prev) =>
                              prev ? { ...prev, value: e.target.value } : null
                            )
                          }
                          onKeyDown={handleInputKeyDown}
                          onBlur={commitEdit}
                        />
                      </td>
                    )
                  }

                  const modified = isCellModified(rowIndex, cellIndex)
                  const cellStyle = modified
                    ? styles.tdModified
                    : onAddWhereClause
                      ? styles.tdFocusable
                      : styles.td

                  return (
                    <td
                      key={cellIndex}
                      data-row={rowIndex}
                      data-cell={cellIndex}
                      className={cellStyle}
                      tabIndex={0}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, cellIndex, results.columns[cellIndex], cell)
                      }
                      onDoubleClick={() => handleDoubleClick(rowIndex, cellIndex, cell)}
                    >
                      {getCellValue(rowIndex, cellIndex, cell)}
                    </td>
                  )
                })}
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
