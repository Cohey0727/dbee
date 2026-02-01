import { clsx } from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import * as styles from './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  children: ReactNode
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, styles.variants[variant], styles.sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
