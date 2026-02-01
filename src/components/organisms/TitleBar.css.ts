import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '../../configs/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '40px',
  padding: `0 ${vars.space.md}`,
  backgroundColor: vars.color.backgroundSecondary,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const title = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.foreground,
})

export const connectionName = style({
  fontWeight: 400,
  color: vars.color.foregroundSecondary,
})

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

export const spinning = style({
  animation: `${spin} 1s linear infinite`,
})
