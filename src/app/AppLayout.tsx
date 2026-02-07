import { useCallback, useRef } from 'react'

import { Tabs } from '../components/molecules/Tabs'
import { SplitPane } from '../components/molecules/SplitPane'
import { TitleBar } from '../components/organisms/TitleBar'
import { StatusBar } from '../components/organisms/StatusBar'
import { AiPanel } from '../features/ai/components/AiPanel'
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

  const editorRef = useRef<SqlEditorHandle>(null)

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
        <SchemaSidebar onTableDoubleClick={handleTableDoubleClick} />

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

        <AiPanel />
      </div>

      <StatusBar />
    </div>
  )
}
