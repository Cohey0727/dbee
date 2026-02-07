import { useCallback, useEffect, useRef } from 'react'

import type { AiSettings, AiSettingsPublic, ChatMessage } from '../../../types/ai'
import { useSchemaStore } from '../../schema/stores/schemaStore'
import * as aiApi from '../api/aiApi'
import { useAiStore } from '../stores/aiStore'

const DEFAULT_MODELS: Record<string, string> = {
  openai: 'gpt-4o',
  deepseek: 'deepseek-chat',
}

function buildSystemMessage(
  connection: { host: string; database: string } | null,
  schema: { tables: { name: string }[]; views: { name: string }[] } | null
): ChatMessage {
  const parts = [
    'You are a PostgreSQL assistant. Help the user write queries and understand their database.',
  ]

  if (connection) {
    parts.push(`Connected to: ${connection.host} / ${connection.database}`)
  }

  if (schema) {
    const tableNames = schema.tables.map((t) => t.name)
    const viewNames = schema.views.map((v) => v.name)

    if (tableNames.length > 0) {
      parts.push(`Tables: ${tableNames.join(', ')}`)
    }
    if (viewNames.length > 0) {
      parts.push(`Views: ${viewNames.join(', ')}`)
    }
  }

  return { role: 'system', content: parts.join('\n\n') }
}

export function useAiChat() {
  const {
    messages,
    isLoading,
    isPanelOpen,
    settings,
    error,
    addMessage,
    setLoading,
    togglePanel,
    setSettings,
    setError,
    clearMessages,
  } = useAiStore()

  const { connection, schema } = useSchemaStore()

  const messagesRef = useRef(messages)
  messagesRef.current = messages

  useEffect(() => {
    aiApi
      .getAiSettings()
      .then(setSettings)
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
      })
  }, [setSettings, setError])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!settings?.hasApiKey) {
        setError('AI settings not configured. Open settings to add your API key.')
        return
      }

      const userMessage: ChatMessage = { role: 'user', content }
      addMessage(userMessage)
      setLoading(true)
      setError(null)

      try {
        const systemMessage = buildSystemMessage(connection, schema)
        const allMessages = [systemMessage, ...messagesRef.current, userMessage]

        const responseContent = await aiApi.sendAiMessage(allMessages)
        const assistantMessage: ChatMessage = { role: 'assistant', content: responseContent }
        addMessage(assistantMessage)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    },
    [settings, connection, schema, addMessage, setLoading, setError]
  )

  const updateSettings = useCallback(
    async (newSettings: AiSettings) => {
      await aiApi.saveAiSettings(newSettings)
      const publicSettings: AiSettingsPublic = {
        provider: newSettings.provider,
        hasApiKey: newSettings.apiKey.length > 0,
        model: newSettings.model,
      }
      setSettings(publicSettings)
      setError(null)
    },
    [setSettings, setError]
  )

  return {
    messages,
    isLoading,
    isPanelOpen,
    settings,
    error,
    defaultModels: DEFAULT_MODELS,
    sendMessage,
    togglePanel,
    updateSettings,
    clearMessages,
  }
}
