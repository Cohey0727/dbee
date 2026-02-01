import { invoke } from '@tauri-apps/api/core'

import type { ConnectionConfig, ConnectionInfo, SavedConnection } from '../../../types/database'

export async function listSavedConnections(): Promise<SavedConnection[]> {
  return invoke<SavedConnection[]>('list_saved_connections')
}

export async function saveConnection(connection: SavedConnection): Promise<SavedConnection> {
  return invoke<SavedConnection>('save_connection', { connection })
}

export async function deleteConnection(id: string): Promise<void> {
  return invoke<void>('delete_connection', { id })
}

export async function testConnection(connection: SavedConnection): Promise<boolean> {
  return invoke<boolean>('test_connection', { connection })
}

export async function connect(config: ConnectionConfig): Promise<ConnectionInfo> {
  return invoke<ConnectionInfo>('connect', { config })
}
