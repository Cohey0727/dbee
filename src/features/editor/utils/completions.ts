import type { Monaco } from '@monaco-editor/react'
import type { editor, languages, Position } from 'monaco-editor'

import type { DatabaseSchema } from '../../../types/database'

const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'NOT',
  'IN',
  'LIKE',
  'BETWEEN',
  'IS',
  'NULL',
  'ORDER BY',
  'GROUP BY',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'ON',
  'AS',
  'DISTINCT',
  'ALL',
  'UNION',
  'INTERSECT',
  'EXCEPT',
  'INSERT',
  'INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'CREATE',
  'TABLE',
  'INDEX',
  'VIEW',
  'DROP',
  'ALTER',
  'ADD',
  'COLUMN',
  'PRIMARY KEY',
  'FOREIGN KEY',
  'REFERENCES',
  'UNIQUE',
  'CHECK',
  'DEFAULT',
  'CASCADE',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'ASC',
  'DESC',
  'NULLS FIRST',
  'NULLS LAST',
  'EXISTS',
  'COALESCE',
  'CAST',
  'PRAGMA',
]

const SQL_FUNCTIONS = [
  { name: 'COUNT', detail: 'COUNT(expr) - Count rows' },
  { name: 'SUM', detail: 'SUM(expr) - Sum of values' },
  { name: 'AVG', detail: 'AVG(expr) - Average of values' },
  { name: 'MIN', detail: 'MIN(expr) - Minimum value' },
  { name: 'MAX', detail: 'MAX(expr) - Maximum value' },
  { name: 'LENGTH', detail: 'LENGTH(str) - String length' },
  { name: 'UPPER', detail: 'UPPER(str) - Convert to uppercase' },
  { name: 'LOWER', detail: 'LOWER(str) - Convert to lowercase' },
  { name: 'TRIM', detail: 'TRIM(str) - Remove whitespace' },
  { name: 'SUBSTR', detail: 'SUBSTR(str, start, len) - Substring' },
  { name: 'REPLACE', detail: 'REPLACE(str, from, to) - Replace string' },
  { name: 'INSTR', detail: 'INSTR(str, substr) - Find substring' },
  { name: 'ROUND', detail: 'ROUND(num, digits) - Round number' },
  { name: 'ABS', detail: 'ABS(num) - Absolute value' },
  { name: 'IFNULL', detail: 'IFNULL(x, y) - Return y if x is NULL' },
  { name: 'NULLIF', detail: 'NULLIF(x, y) - Return NULL if x=y' },
  { name: 'DATE', detail: 'DATE(time) - Extract date' },
  { name: 'TIME', detail: 'TIME(time) - Extract time' },
  { name: 'DATETIME', detail: 'DATETIME(time) - Datetime value' },
  { name: 'STRFTIME', detail: 'STRFTIME(format, time) - Format datetime' },
  { name: 'JULIANDAY', detail: 'JULIANDAY(time) - Julian day number' },
  { name: 'TYPEOF', detail: 'TYPEOF(expr) - Type of expression' },
  { name: 'RANDOM', detail: 'RANDOM() - Random integer' },
  { name: 'HEX', detail: 'HEX(blob) - Hex encoding' },
  { name: 'QUOTE', detail: 'QUOTE(x) - SQL literal value' },
  { name: 'GROUP_CONCAT', detail: 'GROUP_CONCAT(x) - Concatenate group values' },
  { name: 'JSON', detail: 'JSON(x) - Parse JSON' },
  { name: 'JSON_EXTRACT', detail: 'JSON_EXTRACT(json, path) - Extract JSON value' },
  { name: 'JSON_ARRAY', detail: 'JSON_ARRAY(...) - Create JSON array' },
  { name: 'JSON_OBJECT', detail: 'JSON_OBJECT(...) - Create JSON object' },
]

const SQL_SNIPPETS = [
  {
    label: 'sel',
    insertText: 'SELECT ${1:*}\nFROM ${2:table}\nWHERE ${3:condition}',
    detail: 'SELECT statement',
  },
  {
    label: 'selall',
    insertText: 'SELECT * FROM ${1:table}',
    detail: 'SELECT all from table',
  },
  {
    label: 'ins',
    insertText: 'INSERT INTO ${1:table} (${2:columns})\nVALUES (${3:values})',
    detail: 'INSERT statement',
  },
  {
    label: 'upd',
    insertText: 'UPDATE ${1:table}\nSET ${2:column} = ${3:value}\nWHERE ${4:condition}',
    detail: 'UPDATE statement',
  },
  {
    label: 'del',
    insertText: 'DELETE FROM ${1:table}\nWHERE ${2:condition}',
    detail: 'DELETE statement',
  },
  {
    label: 'crt',
    insertText:
      'CREATE TABLE ${1:table_name} (\n\t${2:id} INTEGER PRIMARY KEY,\n\t${3:column} TEXT\n)',
    detail: 'CREATE TABLE statement',
  },
  {
    label: 'join',
    insertText: 'JOIN ${1:table} ON ${2:condition}',
    detail: 'JOIN clause',
  },
  {
    label: 'ljoin',
    insertText: 'LEFT JOIN ${1:table} ON ${2:condition}',
    detail: 'LEFT JOIN clause',
  },
]

let disposable: { dispose: () => void } | null = null

export function registerSqlCompletions(monaco: Monaco, schema: DatabaseSchema | null): void {
  if (disposable) {
    disposable.dispose()
  }

  disposable = monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions: languages.CompletionItem[] = []

      SQL_KEYWORDS.forEach((keyword) => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range,
        })
      })

      SQL_FUNCTIONS.forEach((func) => {
        suggestions.push({
          label: func.name,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `${func.name}($0)`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: func.detail,
          range,
        })
      })

      SQL_SNIPPETS.forEach((snippet) => {
        suggestions.push({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: snippet.detail,
          range,
        })
      })

      if (schema) {
        schema.tables.forEach((table) => {
          suggestions.push({
            label: table.name,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: table.name,
            detail: `Table (${table.columns.length} columns)`,
            range,
          })

          table.columns.forEach((column) => {
            suggestions.push({
              label: `${table.name}.${column.name}`,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: `${table.name}.${column.name}`,
              detail: `${column.dataType}${column.isPrimaryKey ? ' (PK)' : ''}${column.nullable ? '' : ' NOT NULL'}`,
              range,
            })

            suggestions.push({
              label: column.name,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: column.name,
              detail: `${table.name}.${column.name} (${column.dataType})`,
              range,
            })
          })
        })
      }

      return { suggestions }
    },
  })
}
