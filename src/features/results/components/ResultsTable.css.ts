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
  userSelect: 'none',
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

export const tdEditing = style([
  td,
  {
    padding: 0,
    overflow: 'visible',
  },
])

export const tdSelected = style([
  td,
  {
    backgroundColor: 'rgba(0, 122, 204, 0.15)',
    cursor: 'default',
    outline: 'none',
  },
])

export const tdFocus = style([
  td,
  {
    backgroundColor: 'rgba(0, 122, 204, 0.3)',
    cursor: 'default',
    outline: `1px solid ${vars.color.primary}`,
    outlineOffset: '-1px',
  },
])

export const tdCopied = style([
  td,
  {
    backgroundColor: 'rgba(137, 209, 133, 0.2)',
    color: vars.color.success,
    cursor: 'default',
    outline: 'none',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
])

export const tdModified = style([
  td,
  {
    backgroundColor: 'rgba(137, 209, 133, 0.15)',
    cursor: 'default',
    outline: 'none',

    ':focus': {
      backgroundColor: vars.color.primary,
      color: vars.color.background,
    },
  },
])

export const cellInput = style({
  width: '100%',
  height: '100%',
  padding: `${vars.space.xs} ${vars.space.md}`,
  backgroundColor: vars.color.background,
  border: `2px solid ${vars.color.primary}`,
  borderRadius: 0,
  color: vars.color.foreground,
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.sm,
  outline: 'none',
})

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
