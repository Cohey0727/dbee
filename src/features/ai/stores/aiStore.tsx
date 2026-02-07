import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

import type { AiSettingsPublic, ChatMessage } from '../../../types/ai'

interface AiContextValue {
  messages: ChatMessage[]
  isLoading: boolean
  isPanelOpen: boolean
  settings: AiSettingsPublic | null
  error: string | null
  addMessage: (message: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void
  setLoading: (isLoading: boolean) => void
  togglePanel: () => void
  setSettings: (settings: AiSettingsPublic | null) => void
  setError: (error: string | null) => void
  clearMessages: () => void
}

const AiContext = createContext<AiContextValue | null>(null)

export function AiProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setLoading] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [settings, setSettings] = useState<AiSettingsPublic | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => !prev)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const value = useMemo(
    () => ({
      messages,
      isLoading,
      isPanelOpen,
      settings,
      error,
      addMessage,
      setMessages,
      setLoading,
      togglePanel,
      setSettings,
      setError,
      clearMessages,
    }),
    [messages, isLoading, isPanelOpen, settings, error, addMessage, togglePanel, clearMessages]
  )

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>
}

export function useAiStore(): AiContextValue {
  const context = useContext(AiContext)
  if (!context) {
    throw new Error('useAiStore must be used within AiProvider')
  }
  return context
}
