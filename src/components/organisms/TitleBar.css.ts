import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '../../configs/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '40px',
  paddingLeft: '80px',
  paddingRight: vars.space.md,
  backgroundColor: vars.color.backgroundSecondary,
  borderBottom: `1px solid ${vars.color.border}`,
  // @ts-expect-error Tauri-specific CSS property for window drag
  WebkitAppRegion: 'drag',
})

export const logo = style({
  height: '18px',
  width: 'auto',
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
  // @ts-expect-error Tauri-specific CSS property to exclude from window drag
  WebkitAppRegion: 'no-drag',
})

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

export const spinning = style({
  animation: `${spin} 1s linear infinite`,
})

export const activeToggle = style({
  backgroundColor: vars.color.backgroundTertiary,
})
