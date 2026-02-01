import Editor, { type OnMount } from '@monaco-editor/react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import type { editor } from 'monaco-editor'

import { useSchemaStore } from '../../schema/stores/schemaStore'
import { registerSqlCompletions } from '../utils/completions'
import * as styles from './SqlEditor.css'

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: () => void
}

export interface SqlEditorHandle {
  focusAtEnd: () => void
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
        onExecuteRef.current()
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
