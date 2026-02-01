import { invoke } from '@tauri-apps/api/core'

import type { ConnectionConfig, ConnectionInfo, DatabaseSchema } from '../../../types/database'

export async function connect(config: ConnectionConfig): Promise<ConnectionInfo> {
  return invoke<ConnectionInfo>('connect', { config })
}

export async function disconnect(): Promise<void> {
  return invoke<void>('disconnect')
}

export async function getConnectionInfo(): Promise<ConnectionInfo | null> {
  return invoke<ConnectionInfo | null>('get_connection_info')
}

export async function getSchema(): Promise<DatabaseSchema> {
  return invoke<DatabaseSchema>('get_schema')
}
