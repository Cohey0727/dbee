import { invoke } from '@tauri-apps/api/core'

import type { AiSettings, AiSettingsPublic, ChatMessage } from '../../../types/ai'

export async function getAiSettings(): Promise<AiSettingsPublic | null> {
  return invoke<AiSettingsPublic | null>('get_ai_settings')
}

export async function saveAiSettings(settings: AiSettings): Promise<void> {
  return invoke<void>('save_ai_settings', { settings })
}

export async function sendAiMessage(messages: ChatMessage[]): Promise<string> {
  return invoke<string>('send_ai_message', { messages })
}
