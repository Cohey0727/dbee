import { invoke } from '@tauri-apps/api/core'

import type { PersistedEditorState } from '../../../types/database'

export async function loadEditorTabs(connectionId: string): Promise<PersistedEditorState | null> {
  return invoke<PersistedEditorState | null>('load_editor_tabs', { connectionId })
}

export async function saveEditorTabs(
  connectionId: string,
  state: PersistedEditorState
): Promise<void> {
  return invoke<void>('save_editor_tabs', { connectionId, state })
}
