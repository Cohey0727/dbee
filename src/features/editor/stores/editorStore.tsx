import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

import type { Tab, PersistedEditorState } from '../../../types/database'
import { loadEditorTabs, saveEditorTabs } from '../api/editorTabsApi'

interface EditorContextValue {
  tabs: Tab[]
  activeTabId: string | null
  addTab: () => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTabContent: (id: string, content: string) => void
  updateTabName: (id: string, name: string) => void
  loadTabs: (connectionId: string) => Promise<void>
  reset: () => void
}

const EditorContext = createContext<EditorContextValue | null>(null)

const SAVE_DEBOUNCE_MS = 1000

function generateId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createDefaultTab(): Tab {
  return {
    id: generateId(),
    name: 'Query 1',
    content: '',
    isDirty: false,
  }
}

function createNewTab(index: number): Tab {
  return {
    id: generateId(),
    name: `Query ${index}`,
    content: '',
    isDirty: false,
  }
}

function toPersistedState(tabs: Tab[], activeTabId: string | null): PersistedEditorState {
  return {
    tabs: tabs.map(({ id, name, content }) => ({ id, name, content })),
    activeTabId,
  }
}

function fromPersistedState(state: PersistedEditorState): {
  tabs: Tab[]
  activeTabId: string | null
} {
  return {
    tabs: state.tabs.map((t) => ({ ...t, isDirty: false })),
    activeTabId: state.activeTabId,
  }
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([createDefaultTab()])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const connectionIdRef = useRef<string | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNextSaveRef = useRef(false)

  const scheduleSave = useCallback((currentTabs: Tab[], currentActiveTabId: string | null) => {
    const connId = connectionIdRef.current
    if (!connId) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      const persisted = toPersistedState(currentTabs, currentActiveTabId)
      saveEditorTabs(connId, persisted).catch(() => {})
    }, SAVE_DEBOUNCE_MS)
  }, [])

  useEffect(() => {
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }
    scheduleSave(tabs, activeTabId)
  }, [tabs, activeTabId, scheduleSave])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const loadTabs = useCallback(async (connectionId: string) => {
    connectionIdRef.current = connectionId
    skipNextSaveRef.current = true

    try {
      const saved = await loadEditorTabs(connectionId)
      if (saved && saved.tabs.length > 0) {
        const restored = fromPersistedState(saved)
        setTabs(restored.tabs)
        setActiveTabId(restored.activeTabId)
        return
      }
    } catch {
      // Fall through to default
    }

    const defaultTab = createDefaultTab()
    setTabs([defaultTab])
    setActiveTabId(null)
  }, [])

  const reset = useCallback(() => {
    const connId = connectionIdRef.current
    if (connId) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
      saveEditorTabs(connId, toPersistedState(tabs, activeTabId)).catch(() => {})
    }

    connectionIdRef.current = null
    skipNextSaveRef.current = true

    const defaultTab = createDefaultTab()
    setTabs([defaultTab])
    setActiveTabId(null)
  }, [tabs, activeTabId])

  const addTab = useCallback(() => {
    const newTab = createNewTab(tabs.length + 1)
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newTab.id)
  }, [tabs.length])

  const closeTab = useCallback(
    (id: string) => {
      if (tabs.length === 1) {
        return
      }

      const index = tabs.findIndex((t) => t.id === id)
      const newTabs = tabs.filter((t) => t.id !== id)

      setTabs(newTabs)

      if (activeTabId === id) {
        const newActiveId = newTabs[Math.min(index, newTabs.length - 1)]?.id ?? null
        setActiveTabId(newActiveId)
      }
    },
    [tabs, activeTabId]
  )

  const setActiveTab = useCallback((id: string) => {
    setActiveTabId(id)
  }, [])

  const updateTabContent = useCallback((id: string, content: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id
          ? {
              ...tab,
              content,
              isDirty: true,
            }
          : tab
      )
    )
  }, [])

  const updateTabName = useCallback((id: string, name: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id
          ? {
              ...tab,
              name,
            }
          : tab
      )
    )
  }, [])

  return (
    <EditorContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        closeTab,
        setActiveTab,
        updateTabContent,
        updateTabName,
        loadTabs,
        reset,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorStore(): EditorContextValue {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorStore must be used within EditorProvider')
  }
  return context
}
