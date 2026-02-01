import { z } from 'zod'

export const columnSchemaSchema = z.object({
  name: z.string(),
  dataType: z.string(),
  nullable: z.boolean(),
  isPrimaryKey: z.boolean(),
})

export const tableSchemaSchema = z.object({
  name: z.string(),
  columns: z.array(columnSchemaSchema),
})

export const databaseSchemaSchema = z.object({
  tables: z.array(tableSchemaSchema),
})

export const queryResultSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.array(z.unknown())),
  executionTimeMs: z.number(),
  rowsAffected: z.number().optional(),
})

export const connectionConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  host: z.string(),
  port: z.number(),
  user: z.string(),
  password: z.string(),
  database: z.string(),
})

export const connectionInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  host: z.string(),
  port: z.number(),
  database: z.string(),
  isConnected: z.boolean(),
})

export const savedConnectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  host: z.string(),
  port: z.number(),
  user: z.string(),
  password: z.string(),
  database: z.string(),
})

export type ColumnSchema = z.infer<typeof columnSchemaSchema>
export type TableSchema = z.infer<typeof tableSchemaSchema>
export type DatabaseSchema = z.infer<typeof databaseSchemaSchema>
export type QueryResult = z.infer<typeof queryResultSchema>
export type ConnectionConfig = z.infer<typeof connectionConfigSchema>
export type ConnectionInfo = z.infer<typeof connectionInfoSchema>
export type SavedConnection = z.infer<typeof savedConnectionSchema>

export interface Tab {
  id: string
  name: string
  content: string
  isDirty: boolean
}

export interface EditorState {
  tabs: Tab[]
  activeTabId: string | null
}

export interface QueryError {
  message: string
  code?: string
}
