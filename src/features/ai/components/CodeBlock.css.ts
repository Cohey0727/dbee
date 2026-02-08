import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const wrapper = style({
  position: 'relative',
  margin: `${vars.space.sm} 0`,
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  border: `1px solid ${vars.color.border}`,
})

export const toolbar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.backgroundTertiary,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const applyButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: `2px ${vars.space.sm}`,
  backgroundColor: 'transparent',
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.foregroundSecondary,
  fontSize: vars.fontSize.xs,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.primary,
    borderColor: vars.color.primary,
    color: '#ffffff',
  },
})

export const pre = style({
  margin: 0,
  padding: vars.space.sm,
  backgroundColor: vars.color.background,
  overflowX: 'auto',
  fontSize: vars.fontSize.xs,
  lineHeight: 1.5,
})
