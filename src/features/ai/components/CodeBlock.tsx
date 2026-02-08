import { Check, FileCode } from 'lucide-react'
import { useState } from 'react'

import { useEditorStore } from '../../editor/stores/editorStore'
import * as styles from './CodeBlock.css'

interface CodeBlockProps {
  children?: React.ReactNode
}

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractTextContent).join('')
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const element = node as { props: { children?: React.ReactNode } }
    return extractTextContent(element.props.children)
  }
  return ''
}

export function CodeBlock({ children }: CodeBlockProps) {
  const { tabs, activeTabId, updateTabContent } = useEditorStore()
  const [copied, setCopied] = useState(false)

  const codeContent = extractTextContent(children).replace(/\n$/, '')

  const handleApply = () => {
    const targetTabId = activeTabId ?? tabs[0]?.id
    if (!targetTabId) return

    updateTabContent(targetTabId, codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button className={styles.applyButton} onClick={handleApply} type="button">
          {copied ? (
            <>
              <Check size={12} />
              Applied
            </>
          ) : (
            <>
              <FileCode size={12} />
              Apply to Editor
            </>
          )}
        </button>
      </div>
      <pre className={styles.pre}>{children}</pre>
    </div>
  )
}
