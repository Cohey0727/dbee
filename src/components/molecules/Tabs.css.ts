import { style } from '@vanilla-extract/css'

import { vars } from '../../configs/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
})

export const tabList = style({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: vars.color.backgroundSecondary,
  borderBottom: `1px solid ${vars.color.border}`,
  height: '36px',
  flexShrink: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
})

export const tab = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  height: '100%',
  padding: `0 ${vars.space.md}`,
  backgroundColor: 'transparent',
  color: vars.color.foregroundSecondary,
  cursor: 'pointer',
  border: 'none',
  borderRight: `1px solid ${vars.color.border}`,
  fontSize: vars.fontSize.sm,
  transition: 'background-color 0.15s ease, color 0.15s ease',
  userSelect: 'none',
  flexShrink: 0,

  ':hover': {
    backgroundColor: vars.color.backgroundTertiary,
    color: vars.color.foreground,
  },
})

export const tabActive = style({
  backgroundColor: vars.color.background,
  color: vars.color.foreground,
  borderBottom: `2px solid ${vars.color.primary}`,
  marginBottom: '-1px',
})

export const tabLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  whiteSpace: 'nowrap',
})

export const dirtyIndicator = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: vars.color.foregroundSecondary,
})

export const closeButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  padding: 0,
  border: 'none',
  borderRadius: vars.radius.sm,
  backgroundColor: 'transparent',
  color: vars.color.foregroundSecondary,
  cursor: 'pointer',

  ':hover': {
    backgroundColor: vars.color.border,
    color: vars.color.foreground,
  },
})

export const newTabButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '100%',
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  color: vars.color.foregroundSecondary,
  cursor: 'pointer',
  flexShrink: 0,

  ':hover': {
    backgroundColor: vars.color.backgroundTertiary,
    color: vars.color.foreground,
  },
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
})
