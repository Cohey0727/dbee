import { X } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '../../../components/atoms/Button'
import type { AiProvider, AiSettings as AiSettingsType, AiSettingsPublic } from '../../../types/ai'
import * as styles from './AiSettings.css'

interface AiSettingsProps {
  settings: AiSettingsPublic | null
  defaultModels: Record<string, string>
  onSave: (settings: AiSettingsType) => Promise<void>
  onClose: () => void
}

export function AiSettings({ settings, defaultModels, onSave, onClose }: AiSettingsProps) {
  const [provider, setProvider] = useState<AiProvider>(settings?.provider ?? 'openai')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState(settings?.model ?? defaultModels['openai'] ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleProviderChange = (newProvider: AiProvider) => {
    setProvider(newProvider)
    if (!model || model === defaultModels[provider]) {
      setModel(defaultModels[newProvider] ?? '')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)

    try {
      await onSave({ provider, apiKey, model })
      onClose()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSaving(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>AI Settings</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <X size={16} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Provider</label>
            <select
              className={styles.select}
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as AiProvider)}
            >
              <option value="openai">OpenAI</option>
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>API Key</label>
            <input
              className={styles.input}
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={settings?.hasApiKey ? '••••••••  (enter new key to update)' : 'sk-...'}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Model</label>
            <input
              className={styles.input}
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={defaultModels[provider] ?? ''}
            />
          </div>

          {saveError && <div className={styles.errorText}>{saveError}</div>}

          <div className={styles.footer}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving || !apiKey.trim()}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
