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

export const rowNumberHeader = style({
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 2,
  padding: `${vars.space.sm} ${vars.space.sm}`,
  backgroundColor: vars.color.backgroundSecondary,
  borderBottom: `1px solid ${vars.color.border}`,
  borderRight: `1px solid ${vars.color.border}`,
  textAlign: 'center',
  fontWeight: 600,
  color: vars.color.foregroundSecondary,
  whiteSpace: 'nowrap',
  width: '1px',
  minWidth: '40px',
  cursor: 'pointer',
  userSelect: 'none',
})

export const rowNumberCell = style({
  position: 'sticky',
  left: 0,
  zIndex: 1,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.background,
  borderBottom: `1px solid ${vars.color.border}`,
  borderRight: `1px solid ${vars.color.border}`,
  color: vars.color.foregroundSecondary,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  width: '1px',
  minWidth: '40px',
  cursor: 'pointer',
  userSelect: 'none',
  fontSize: vars.fontSize.xs,

  ':hover': {
    backgroundColor: vars.color.backgroundTertiary,
    color: vars.color.foreground,
  },
})

export const rowNumberCellSelected = style([
  rowNumberCell,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.background,

    ':hover': {
      backgroundColor: vars.color.primaryHover,
      color: vars.color.background,
    },
  },
])

export const trRowSelected = style({
  selectors: {
    '&&, &&:nth-child(even), &&:hover': {
      backgroundColor: 'rgba(0, 122, 204, 0.1)',
    },
  },
})

export const rowActionBar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.xs} ${vars.space.md}`,
  backgroundColor: vars.color.backgroundSecondary,
  borderTop: `1px solid ${vars.color.border}`,
  fontSize: vars.fontSize.sm,
  color: vars.color.foregroundSecondary,
  flexShrink: 0,
})

export const rowActionButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: 'transparent',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.foreground,
  fontSize: vars.fontSize.sm,
  cursor: 'pointer',
  whiteSpace: 'nowrap',

  ':hover': {
    backgroundColor: vars.color.backgroundTertiary,
    borderColor: vars.color.foregroundSecondary,
  },
})

export const rowActionButtonDanger = style([
  rowActionButton,
  {
    color: vars.color.error,
    borderColor: vars.color.error,

    ':hover': {
      backgroundColor: 'rgba(241, 76, 76, 0.1)',
      borderColor: vars.color.error,
    },
  },
])

export const rowActionLabel = style({
  color: vars.color.foreground,
  fontWeight: 500,
})
