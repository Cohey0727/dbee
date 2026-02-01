import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

import type { Tab } from '../../../types/database'

interface EditorContextValue {
  tabs: Tab[]
  activeTabId: string | null
  addTab: () => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTabContent: (id: string, content: string) => void
  updateTabName: (id: string, name: string) => void
}

const EditorContext = createContext<EditorContextValue | null>(null)

function generateId(): string {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createNewTab(index: number): Tab {
  return {
    id: generateId(),
    name: `Query ${index}`,
    content: '',
    isDirty: false,
  }
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([createNewTab(1)])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

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
