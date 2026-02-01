import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  width: '240px',
  minWidth: '180px',
  maxWidth: '400px',
  flexShrink: 0,
  backgroundColor: vars.color.backgroundSecondary,
  borderRight: `1px solid ${vars.color.border}`,
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

export const title = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.foregroundSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

export const content = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: vars.space.xs,
})

export const tableItem = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: vars.space.xs,
})

export const tableHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.sm,
  cursor: 'pointer',
  color: vars.color.foreground,
  fontSize: vars.fontSize.sm,
  transition: 'background-color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.backgroundTertiary,
  },
})

export const tableHeaderActive = style([
  tableHeader,
  {
    backgroundColor: vars.color.backgroundTertiary,
  },
])

export const tableIcon = style({
  color: vars.color.primary,
  flexShrink: 0,
})

export const tableName = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: vars.fontFamily.mono,
})

export const chevron = style({
  color: vars.color.foregroundSecondary,
  flexShrink: 0,
  transition: 'transform 0.15s ease',
})

export const chevronOpen = style([
  chevron,
  {
    transform: 'rotate(90deg)',
  },
])

export const columnList = style({
  paddingLeft: vars.space.lg,
})

export const columnItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `2px ${vars.space.sm}`,
  fontSize: vars.fontSize.xs,
  color: vars.color.foregroundSecondary,
})

export const columnIcon = style({
  flexShrink: 0,
})

export const columnIconPrimary = style([
  columnIcon,
  {
    color: vars.color.warning,
  },
])

export const columnName = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: vars.fontFamily.mono,
})

export const columnType = style({
  fontSize: vars.fontSize.xs,
  fontFamily: vars.fontFamily.mono,
  color: vars.color.foregroundSecondary,
  opacity: 0.7,
})

export const emptyState = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 0,
  padding: vars.space.md,
  color: vars.color.foregroundSecondary,
  fontSize: vars.fontSize.sm,
  textAlign: 'center',
})

export const loadingState = style([
  emptyState,
  {},
])
