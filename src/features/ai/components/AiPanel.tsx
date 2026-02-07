import { Send, Settings, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useAiChat } from '../hooks/useAiChat'
import { AiSettings } from './AiSettings'
import * as styles from './AiPanel.css'

export function AiPanel() {
  const {
    messages,
    isLoading,
    isPanelOpen,
    settings,
    error,
    defaultModels,
    sendMessage,
    togglePanel,
    updateSettings,
    clearMessages,
  } = useAiChat()

  const [inputValue, setInputValue] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const messageListRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return

    setInputValue('')
    await sendMessage(trimmed)
    inputRef.current?.focus()
  }, [inputValue, isLoading, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  if (!isPanelOpen) return null

  const hasApiKey = settings?.hasApiKey ?? false

  return (
    <>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>AI Chat</span>
          <div className={styles.headerActions}>
            <button
              className={styles.iconButton}
              onClick={clearMessages}
              type="button"
              title="Clear messages"
            >
              <Trash2 size={14} />
            </button>
            <button
              className={styles.iconButton}
              onClick={() => setIsSettingsOpen(true)}
              type="button"
              title="AI Settings"
            >
              <Settings size={14} />
            </button>
            <button className={styles.iconButton} onClick={togglePanel} type="button" title="Close">
              <X size={14} />
            </button>
          </div>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        <div className={styles.messageList} ref={messageListRef}>
          {messages.length === 0 && !isLoading && (
            <div className={styles.emptyState}>
              {hasApiKey
                ? 'Ask a question about your database'
                : 'Configure your API key in settings to start chatting'}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
            >
              {msg.content}
            </div>
          ))}

          {isLoading && (
            <div className={styles.loadingDots}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasApiKey ? 'Ask about your database...' : 'Configure API key first'}
            disabled={!hasApiKey || isLoading}
            rows={1}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={!inputValue.trim() || !hasApiKey || isLoading}
            type="button"
            title="Send"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {isSettingsOpen && (
        <AiSettings
          settings={settings}
          defaultModels={defaultModels}
          onSave={updateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  )
}
