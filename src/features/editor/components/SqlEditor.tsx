import Editor, { type OnMount } from '@monaco-editor/react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import type { editor } from 'monaco-editor'

import { useSchemaStore } from '../../schema/stores/schemaStore'
import { registerSqlCompletions } from '../utils/completions'
import * as styles from './SqlEditor.css'

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: (query: string) => void
}

export interface SqlEditorHandle {
  focusAtEnd: () => void
}

function getStatementAtCursor(content: string, offset: number): string {
  const statements: { start: number; end: number; text: string }[] = []
  let current = 0

  for (const raw of content.split(';')) {
    const start = current
    const end = current + raw.length
    const text = raw.trim()
    if (text.length > 0) {
      statements.push({ start, end, text })
    }
    current = end + 1 // +1 for the semicolon
  }

  if (statements.length === 0) return content.trim()

  for (const stmt of statements) {
    if (offset >= stmt.start && offset <= stmt.end + 1) {
      return stmt.text
    }
  }

  // Fallback: return the last statement
  return statements[statements.length - 1].text
}

export const SqlEditor = forwardRef<SqlEditorHandle, SqlEditorProps>(function SqlEditor(
  { value, onChange, onExecute },
  ref
) {
  const { schema } = useSchemaStore()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null)
  const onExecuteRef = useRef(onExecute)

  useEffect(() => {
    onExecuteRef.current = onExecute
  }, [onExecute])

  useImperativeHandle(ref, () => ({
    focusAtEnd: () => {
      const editor = editorRef.current
      if (editor) {
        editor.focus()
        const model = editor.getModel()
        if (model) {
          const lastLine = model.getLineCount()
          const lastColumn = model.getLineMaxColumn(lastLine)
          editor.setPosition({ lineNumber: lastLine, column: lastColumn })
        }
      }
    },
  }))

  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor
      monacoRef.current = monaco

      registerSqlCompletions(monaco, schema)

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        const model = editor.getModel()
        if (!model) return

        const position = editor.getPosition()
        if (!position) return

        const offset = model.getOffsetAt(position)
        const fullContent = model.getValue()
        const statement = getStatementAtCursor(fullContent, offset)

        onExecuteRef.current(statement)
      })

      editor.focus()
    },
    [schema]
  )

  useEffect(() => {
    if (monacoRef.current && schema) {
      registerSqlCompletions(monacoRef.current, schema)
    }
  }, [schema])

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      onChange(newValue ?? '')
    },
    [onChange]
  )

  return (
    <div className={styles.container}>
      <Editor
        language="sql"
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          tabSize: 2,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 8, bottom: 8 },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Menlo, monospace',
          fontLigatures: true,
        }}
      />
    </div>
  )
})
