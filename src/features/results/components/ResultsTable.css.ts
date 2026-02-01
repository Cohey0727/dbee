import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  backgroundColor: vars.color.background,
  overflow: 'hidden',
})

export const tableWrapper = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
})

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.sm,
})

export const th = style({
  position: 'sticky',
  top: 0,
  padding: `${vars.space.sm} ${vars.space.md}`,
  backgroundColor: vars.color.backgroundSecondary,
  borderBottom: `1px solid ${vars.color.border}`,
  textAlign: 'left',
  fontWeight: 600,
  color: vars.color.foreground,
  whiteSpace: 'nowrap',
})

export const tr = style({
  selectors: {
    '&:nth-child(even)': {
      backgroundColor: vars.color.backgroundSecondary,
    },
    '&:hover': {
      backgroundColor: vars.color.backgroundTertiary,
    },
  },
})

export const td = style({
  padding: `${vars.space.xs} ${vars.space.md}`,
  borderBottom: `1px solid ${vars.color.border}`,
  color: vars.color.foreground,
  maxWidth: '300px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const tdFocusable = style([
  td,
  {
    cursor: 'default',
    outline: 'none',

    ':focus': {
      backgroundColor: vars.color.primary,
      color: vars.color.background,
    },
  },
])

export const message = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 0,
  color: vars.color.foregroundSecondary,
  fontSize: vars.fontSize.md,
  textAlign: 'center',
  gap: vars.space.sm,
})

export const error = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 0,
  color: vars.color.error,
  fontSize: vars.fontSize.md,
  padding: vars.space.lg,
  textAlign: 'center',
})

export const executionTime = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.foregroundSecondary,
})
