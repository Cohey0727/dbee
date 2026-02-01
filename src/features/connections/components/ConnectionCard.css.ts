import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const card = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: vars.space.md,
  backgroundColor: vars.color.backgroundSecondary,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',

  ':hover': {
    borderColor: vars.color.borderFocus,
    backgroundColor: vars.color.backgroundTertiary,
  },
})

export const icon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  backgroundColor: vars.color.backgroundTertiary,
  borderRadius: vars.radius.md,
  color: vars.color.primary,
})

export const info = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  minWidth: 0,
})

export const name = style({
  fontSize: vars.fontSize.md,
  fontWeight: 500,
  color: vars.color.foreground,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const details = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.foregroundSecondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const actionButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  padding: 0,
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: vars.radius.sm,
  color: vars.color.foregroundSecondary,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.backgroundTertiary,
    color: vars.color.foreground,
  },
})

export const deleteButton = style([
  actionButton,
  {
    ':hover': {
      backgroundColor: 'rgba(241, 76, 76, 0.1)',
      color: vars.color.error,
    },
  },
])
