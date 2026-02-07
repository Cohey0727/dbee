import { ChevronRight, Columns, Eye, Key, Table2 } from 'lucide-react'
import { useRef, useState } from 'react'

import type { TableSchema } from '../../../types/database'
import { useSchemaStore } from '../stores/schemaStore'
import * as styles from './SchemaSidebar.css'

interface RelationItemProps {
  relation: TableSchema
  isExpanded: boolean
  isView?: boolean
  onToggle: () => void
  onDoubleClick: (name: string) => void
}

function RelationItem({ relation, isExpanded, isView, onToggle, onDoubleClick }: RelationItemProps) {
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
      onDoubleClick(relation.name)
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
            onDoubleClick(relation.name)
          } else if (e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <ChevronRight size={14} className={isExpanded ? styles.chevronOpen : styles.chevron} />
        {isView ? (
          <Eye size={14} className={styles.viewIcon} />
        ) : (
          <Table2 size={14} className={styles.tableIcon} />
        )}
        <span className={styles.tableName}>{relation.name}</span>
      </div>

      {isExpanded && (
        <div className={styles.columnList}>
          {relation.columns.map((column) => (
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  const toggleItem = (name: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const handleDoubleClick = (name: string) => {
    onTableDoubleClick?.(name)
  }

  if (isLoading) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Schema</span>
        </div>
        <div className={styles.loadingState}>Loading schema...</div>
      </div>
    )
  }

  const tables = schema?.tables ?? []
  const views = schema?.views ?? []

  if (tables.length === 0 && views.length === 0) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>Schema</span>
        </div>
        <div className={styles.emptyState}>No tables found</div>
      </div>
    )
  }

  const isTablesCollapsed = collapsedSections.has('tables')
  const isViewsCollapsed = collapsedSections.has('views')

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Schema</span>
      </div>
      <div className={styles.content}>
        {tables.length > 0 && (
          <div className={styles.section}>
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection('tables')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleSection('tables')
                }
              }}
            >
              <ChevronRight
                size={12}
                className={isTablesCollapsed ? styles.sectionChevron : styles.sectionChevronOpen}
              />
              <span>Tables</span>
              <span className={styles.sectionCount}>{tables.length}</span>
            </div>
            {!isTablesCollapsed && (
              <div className={styles.sectionContent}>
                {tables.map((table) => (
                  <RelationItem
                    key={table.name}
                    relation={table}
                    isExpanded={expandedItems.has(table.name)}
                    onToggle={() => toggleItem(table.name)}
                    onDoubleClick={handleDoubleClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection('views')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleSection('views')
              }
            }}
          >
            <ChevronRight
              size={12}
              className={isViewsCollapsed ? styles.sectionChevron : styles.sectionChevronOpen}
            />
            <span>Views</span>
            <span className={styles.sectionCount}>{views.length}</span>
          </div>
          {!isViewsCollapsed && views.length > 0 && (
            <div className={styles.sectionContent}>
              {views.map((view) => (
                <RelationItem
                  key={view.name}
                  relation={view}
                  isView
                  isExpanded={expandedItems.has(view.name)}
                  onToggle={() => toggleItem(view.name)}
                  onDoubleClick={handleDoubleClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
