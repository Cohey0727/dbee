import { Database, Clock, Rows3 } from 'lucide-react'

import { useSchemaStore } from '../../features/schema/stores/schemaStore'
import { useResultsStore } from '../../features/results/stores/resultsStore'
import * as styles from './StatusBar.css'

export function StatusBar() {
  const { connection } = useSchemaStore()
  const { results, isExecuting } = useResultsStore()

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Database size={12} />
        <span>{connection ? connection.name : 'Not connected'}</span>
      </div>

      {results && (
        <>
          <div className={styles.section}>
            <Rows3 size={12} />
            <span>
              {results.rowsAffected !== undefined
                ? `${results.rowsAffected} affected`
                : `${results.rows.length} rows`}
            </span>
          </div>

          <div className={styles.section}>
            <Clock size={12} />
            <span>{results.executionTimeMs}ms</span>
          </div>
        </>
      )}

      {isExecuting && (
        <div className={styles.section}>
          <span className={styles.executing}>Executing...</span>
        </div>
      )}

      <div className={styles.spacer} />

      <div className={styles.section}>
        <span className={styles.shortcut}>Cmd+Enter to run</span>
      </div>
    </div>
  )
}
