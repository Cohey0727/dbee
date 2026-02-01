import { invoke } from '@tauri-apps/api/core'

import type { QueryResult } from '../../../types/database'

export async function executeQuery(query: string): Promise<QueryResult> {
  return invoke<QueryResult>('execute_query', { query })
}
