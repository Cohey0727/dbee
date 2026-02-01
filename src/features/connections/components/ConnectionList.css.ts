import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  backgroundColor: vars.color.background,
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: vars.space.md,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const title = style({
  fontSize: vars.fontSize.xl,
  fontWeight: 600,
  color: vars.color.foreground,
})

export const content = style({
  flex: 1,
  padding: vars.space.md,
  overflow: 'auto',
})

export const connectionsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
})

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: vars.space.md,
  color: vars.color.foregroundSecondary,
})

export const emptyText = style({
  fontSize: vars.fontSize.md,
})

export const loadingState = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: vars.color.foregroundSecondary,
})

export const errorState = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: vars.space.md,
  color: vars.color.error,
  backgroundColor: 'rgba(241, 76, 76, 0.1)',
  borderRadius: vars.radius.md,
  marginBottom: vars.space.md,
})
