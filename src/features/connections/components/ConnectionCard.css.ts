import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: vars.space.md,
  backgroundColor: vars.color.backgroundSecondary,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
  minHeight: '120px',
  position: 'relative',

  ':hover': {
    borderColor: vars.color.borderFocus,
    backgroundColor: vars.color.backgroundTertiary,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
})

export const cardHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
})

export const icon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  background: 'linear-gradient(135deg, rgba(0, 122, 204, 0.15) 0%, rgba(0, 152, 255, 0.08) 100%)',
  borderRadius: vars.radius.md,
  color: vars.color.primary,
  flexShrink: 0,
})

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  opacity: 0,
  transition: 'opacity 0.15s ease',
  selectors: {
    [`${card}:hover &`]: {
      opacity: 1,
    },
  },
})

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: 1,
})

export const name = style({
  fontSize: vars.fontSize.md,
  fontWeight: 600,
  color: vars.color.foreground,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: 1.3,
})

export const details = style({
  fontSize: vars.fontSize.xs,
  color: vars.color.foregroundSecondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: vars.fontFamily.mono,
})

export const actionButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  padding: 0,
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: vars.radius.sm,
  color: vars.color.foregroundSecondary,
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.backgroundSecondary,
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
