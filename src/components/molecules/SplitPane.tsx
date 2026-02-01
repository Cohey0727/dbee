import { useCallback, useRef, useState, type ReactNode } from 'react'

import * as styles from './SplitPane.css'

interface SplitPaneProps {
  direction?: 'horizontal' | 'vertical'
  defaultSize?: number
  minSize?: number
  maxSize?: number
  children: [ReactNode, ReactNode]
}

export function SplitPane({
  direction = 'vertical',
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  children,
}: SplitPaneProps) {
  const [size, setSize] = useState(defaultSize)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMouseDown = useCallback(() => {
    isDragging.current = true
    document.body.style.cursor = direction === 'vertical' ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'
  }, [direction])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      let newSize: number

      if (direction === 'vertical') {
        newSize = ((e.clientY - rect.top) / rect.height) * 100
      } else {
        newSize = ((e.clientX - rect.left) / rect.width) * 100
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize))
      setSize(newSize)
    },
    [direction, minSize, maxSize]
  )

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const attachListeners = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const onDividerMouseDown = useCallback(() => {
    handleMouseDown()
    const cleanup = attachListeners()

    const onUp = () => {
      cleanup()
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mouseup', onUp)
  }, [handleMouseDown, attachListeners])

  const isVertical = direction === 'vertical'

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ flexDirection: isVertical ? 'column' : 'row' }}
    >
      <div
        className={styles.pane}
        style={isVertical ? { height: `${size}%` } : { width: `${size}%` }}
      >
        {children[0]}
      </div>
      <div
        className={isVertical ? styles.dividerVertical : styles.dividerHorizontal}
        onMouseDown={onDividerMouseDown}
      />
      <div className={styles.pane} style={{ flex: 1 }}>
        {children[1]}
      </div>
    </div>
  )
}
