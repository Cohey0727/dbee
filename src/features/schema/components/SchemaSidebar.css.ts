import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minWidth: '180px',
  maxWidth: '400px',
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

export const headerTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.foreground,
})

export const content = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
})

export const section = style({
  display: 'flex',
  flexDirection: 'column',
})

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `6px ${vars.space.md}`,
  cursor: 'pointer',
  color: vars.color.foregroundSecondary,
  fontSize: vars.fontSize.xs,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  transition: 'color 0.15s ease',
  userSelect: 'none',
  borderBottom: `1px solid ${vars.color.border}`,

  ':hover': {
    color: vars.color.foreground,
  },
})

export const sectionChevron = style({
  flexShrink: 0,
  transition: 'transform 0.15s ease',
})

export const sectionChevronOpen = style([
  sectionChevron,
  {
    transform: 'rotate(90deg)',
  },
])

export const sectionCount = style({
  marginLeft: 'auto',
  fontSize: vars.fontSize.xs,
  color: vars.color.foregroundSecondary,
  opacity: 0.6,
  fontWeight: 400,
})

export const sectionContent = style({
  padding: vars.space.xs,
})

export const tableItem = style({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1px',
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

export const viewIcon = style({
  color: vars.color.success,
  flexShrink: 0,
})

export const tableName = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.xs,
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
