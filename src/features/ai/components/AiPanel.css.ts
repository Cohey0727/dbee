import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  width: '320px',
  minWidth: '320px',
  borderLeft: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.backgroundSecondary,
  overflow: 'hidden',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
})

export const headerTitle = style({
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.foreground,
})

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const iconButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  padding: 0,
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: vars.radius.sm,
  color: vars.color.foregroundSecondary,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.backgroundTertiary,
    color: vars.color.foreground,
  },
})

export const messageList = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.sm,
  gap: vars.space.sm,
})

export const message = style({
  maxWidth: '85%',
  padding: `${vars.space.sm} ${vars.space.md}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.sm,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})

export const userMessage = style([
  message,
  {
    alignSelf: 'flex-end',
    backgroundColor: vars.color.primary,
    color: '#ffffff',
  },
])

export const assistantMessage = style([
  message,
  {
    alignSelf: 'flex-start',
    backgroundColor: vars.color.backgroundTertiary,
    color: vars.color.foreground,
  },
])

export const inputArea = style({
  display: 'flex',
  gap: vars.space.sm,
  padding: vars.space.sm,
  borderTop: `1px solid ${vars.color.border}`,
  flexShrink: 0,
})

export const input = style({
  flex: 1,
  minHeight: '36px',
  maxHeight: '100px',
  padding: `${vars.space.sm} ${vars.space.sm}`,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.foreground,
  fontSize: vars.fontSize.sm,
  outline: 'none',
  resize: 'none',
  transition: 'border-color 0.15s ease',

  ':focus': {
    borderColor: vars.color.borderFocus,
  },

  '::placeholder': {
    color: vars.color.foregroundSecondary,
  },
})

export const sendButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  flexShrink: 0,
  padding: 0,
  backgroundColor: vars.color.primary,
  border: 'none',
  borderRadius: vars.radius.sm,
  color: '#ffffff',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.primaryHover,
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  padding: vars.space.lg,
  textAlign: 'center',
  color: vars.color.foregroundSecondary,
  fontSize: vars.fontSize.sm,
  gap: vars.space.sm,
})

export const errorBanner = style({
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: 'rgba(241, 76, 76, 0.1)',
  borderBottom: `1px solid ${vars.color.error}`,
  color: vars.color.error,
  fontSize: vars.fontSize.xs,
  flexShrink: 0,
})

const dotPulse = keyframes({
  '0%, 80%, 100%': { opacity: 0 },
  '40%': { opacity: 1 },
})

export const loadingDots = style({
  display: 'flex',
  alignSelf: 'flex-start',
  gap: '4px',
  padding: `${vars.space.sm} ${vars.space.md}`,
})

export const dot = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: vars.color.foregroundSecondary,
  animation: `${dotPulse} 1.4s ease-in-out infinite`,

  selectors: {
    '&:nth-child(2)': { animationDelay: '0.2s' },
    '&:nth-child(3)': { animationDelay: '0.4s' },
  },
})
