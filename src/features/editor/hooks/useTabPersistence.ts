import { useEffect, useRef } from 'react'

import { useSchemaStore } from '../../schema/stores/schemaStore'
import { useEditorStore } from '../stores/editorStore'

export function useTabPersistence(): void {
  const { connection } = useSchemaStore()
  const { loadTabs, reset } = useEditorStore()
  const prevConnectionIdRef = useRef<string | null>(null)

  useEffect(() => {
    const currentId = connection?.id ?? null

    if (currentId === prevConnectionIdRef.current) {
      return
    }

    const prevId = prevConnectionIdRef.current
    prevConnectionIdRef.current = currentId

    if (prevId && !currentId) {
      reset()
      return
    }

    if (currentId) {
      loadTabs(currentId)
    }
  }, [connection, loadTabs, reset])
}
