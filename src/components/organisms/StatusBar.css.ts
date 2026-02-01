import { style } from '@vanilla-extract/css'

import { vars } from '../../configs/theme.css'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  height: '24px',
  padding: `0 ${vars.space.md}`,
  backgroundColor: vars.color.backgroundSecondary,
  borderTop: `1px solid ${vars.color.border}`,
  fontSize: vars.fontSize.xs,
  color: vars.color.foregroundSecondary,
  gap: vars.space.md,
})

export const section = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const spacer = style({
  flex: 1,
})

export const executing = style({
  color: vars.color.warning,
})

export const shortcut = style({
  color: vars.color.foregroundSecondary,
  opacity: 0.7,
})
