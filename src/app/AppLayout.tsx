import { useCallback, useRef, useState } from 'react'

import { Tabs } from '../components/molecules/Tabs'
import { SplitPane } from '../components/molecules/SplitPane'
import { TitleBar } from '../components/organisms/TitleBar'
import { StatusBar } from '../components/organisms/StatusBar'
import { AiPanel } from '../features/ai/components/AiPanel'
import { useAiStore } from '../features/ai/stores/aiStore'
import { SqlEditor, type SqlEditorHandle } from '../features/editor/components/SqlEditor'
import { ResultsTable } from '../features/results/components/ResultsTable'
import { SchemaSidebar } from '../features/schema/components/SchemaSidebar'
import { useEditor } from '../features/editor/hooks/useEditor'
import * as styles from './AppLayout.css'

export function AppLayout() {
  const {
    tabs,
    activeTab,
    activeTabId,
    addTab,
    closeTab,
    setActiveTab,
    updateTabContent,
    runQuery,
    runQueryWithContent,
    appendWhereClause,
  } = useEditor()

  const { isPanelOpen } = useAiStore()

  const editorRef = useRef<SqlEditorHandle>(null)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [aiPanelWidth, setAiPanelWidth] = useState(320)

  const handleDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = sidebarWidth

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX
        const newWidth = Math.min(400, Math.max(180, startWidth + delta))
        setSidebarWidth(newWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [sidebarWidth]
  )

  const handleAiDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = aiPanelWidth

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = startX - moveEvent.clientX
        const newWidth = Math.min(560, Math.max(240, startWidth + delta))
        setAiPanelWidth(newWidth)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [aiPanelWidth]
  )

  const handleTableDoubleClick = useCallback(
    (tableName: string) => {
      const query = `SELECT * FROM ${tableName};`
      runQueryWithContent(query)
    },
    [runQueryWithContent]
  )

  const handleAddWhereClause = useCallback(
    (column: string, value: unknown) => {
      appendWhereClause(column, value)
      requestAnimationFrame(() => {
        editorRef.current?.focusAtEnd()
      })
    },
    [appendWhereClause]
  )

  return (
    <div className={styles.container}>
      <TitleBar />

      <div className={styles.main}>
        <div className={styles.sidebarArea} style={{ width: sidebarWidth }}>
          <SchemaSidebar onTableDoubleClick={handleTableDoubleClick} />
        </div>
        <div
          className={styles.sidebarDivider}
          onMouseDown={handleDividerMouseDown}
        />

        <div className={styles.content}>
          <Tabs
            tabs={tabs.map((tab) => ({ id: tab.id, label: tab.name, isDirty: tab.isDirty }))}
            activeTabId={activeTabId ?? tabs[0]?.id ?? null}
            onTabSelect={setActiveTab}
            onTabClose={closeTab}
            onNewTab={addTab}
          >
            <SplitPane direction="vertical" defaultSize={50} minSize={20} maxSize={80}>
              <SqlEditor
                ref={editorRef}
                value={activeTab?.content ?? ''}
                onChange={updateTabContent}
                onExecute={runQuery}
              />
              <ResultsTable onAddWhereClause={handleAddWhereClause} />
            </SplitPane>
          </Tabs>
        </div>

        {isPanelOpen && (
          <>
            <div
              className={styles.aiPanelDivider}
              onMouseDown={handleAiDividerMouseDown}
            />
            <div className={styles.aiPanelArea} style={{ width: aiPanelWidth }}>
              <AiPanel />
            </div>
          </>
        )}
      </div>

      <StatusBar />
    </div>
  )
}
