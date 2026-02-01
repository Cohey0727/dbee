import { ChevronRight, Columns, Key, Table2 } from 'lucide-react'
import { useRef, useState } from 'react'

import type { TableSchema } from '../../../types/database'
import { useSchemaStore } from '../stores/schemaStore'
import * as styles from './SchemaSidebar.css'

interface TableItemProps {
  table: TableSchema
  isExpanded: boolean
  onToggle: () => void
  onDoubleClick: (tableName: string) => void
}

function TableItem({ table, isExpanded, onToggle, onDoubleClick }: TableItemProps) {
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCountRef = useRef(0)

  const handleClick = () => {
    clickCountRef.current += 1

    if (clickCountRef.current === 1) {
      clickTimerRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          onToggle()
        }
        clickCountRef.current = 0
      }, 250)
    } else if (clickCountRef.current === 2) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
      }
      clickCountRef.current = 0
      onDoubleClick(table.name)
    }
  }

  return (
    <div className={styles.tableItem}>
      <div
        className={isExpanded ? styles.tableHeaderActive : styles.tableHeader}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onDoubleClick(table.name)
          } else if (e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <ChevronRight size={14} className={isExpanded ? styles.chevronOpen : styles.chevron} />
        <Table2 size={14} className={styles.tableIcon} />
        <span className={styles.tableName}>{table.name}</span>
      </div>

      {isExpanded && (
        <div className={styles.columnList}>
          {table.columns.map((column) => (
            <div key={column.name} className={styles.columnItem}>
              {column.isPrimaryKey ? (
                <Key size={12} className={styles.columnIconPrimary} />
              ) : (
                <Columns size={12} className={styles.columnIcon} />
              )}
              <span className={styles.columnName}>{column.name}</span>
              <span className={styles.columnType}>{column.dataType}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface SchemaSidebarProps {
  onTableDoubleClick?: (tableName: string) => void
}

export function SchemaSidebar({ onTableDoubleClick }: SchemaSidebarProps) {
  const { schema, isLoading } = useSchemaStore()
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set())

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev)
      if (next.has(tableName)) {
        next.delete(tableName)
      } else {
        next.add(tableName)
      }
      return next
    })
  }

  const handleTableDoubleClick = (tableName: string) => {
    onTableDoubleClick?.(tableName)
  }

  if (isLoading) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <span className={styles.title}>Tables</span>
        </div>
        <div className={styles.loadingState}>Loading schema...</div>
      </div>
    )
  }

  if (!schema || schema.tables.length === 0) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <span className={styles.title}>Tables</span>
        </div>
        <div className={styles.emptyState}>No tables found</div>
      </div>
    )
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>Tables ({schema.tables.length})</span>
      </div>
      <div className={styles.content}>
        {schema.tables.map((table) => (
          <TableItem
            key={table.name}
            table={table}
            isExpanded={expandedTables.has(table.name)}
            onToggle={() => toggleTable(table.name)}
            onDoubleClick={handleTableDoubleClick}
          />
        ))}
      </div>
    </div>
  )
}
