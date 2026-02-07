import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
})

export const modal = style({
  width: '100%',
  maxWidth: '420px',
  backgroundColor: vars.color.backgroundSecondary,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.md} ${vars.space.lg}`,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const title = style({
  fontSize: vars.fontSize.lg,
  fontWeight: 600,
  color: vars.color.foreground,
})

export const closeButton = style({
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

export const form = style({
  padding: vars.space.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const label = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  color: vars.color.foregroundSecondary,
})

export const input = style({
  width: '100%',
  height: '36px',
  padding: `0 ${vars.space.sm}`,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.foreground,
  fontSize: vars.fontSize.sm,
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',

  ':focus': {
    borderColor: vars.color.borderFocus,
    boxShadow: '0 0 0 2px rgba(0, 122, 204, 0.15)',
  },

  '::placeholder': {
    color: vars.color.foregroundSecondary,
  },
})

export const select = style({
  width: '100%',
  height: '36px',
  padding: `0 ${vars.space.sm}`,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  color: vars.color.foreground,
  fontSize: vars.fontSize.sm,
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',

  ':focus': {
    borderColor: vars.color.borderFocus,
    boxShadow: '0 0 0 2px rgba(0, 122, 204, 0.15)',
  },
})

export const errorText = style({
  color: vars.color.error,
  fontSize: vars.fontSize.xs,
})

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingTop: vars.space.md,
  marginTop: vars.space.sm,
  borderTop: `1px solid ${vars.color.border}`,
  gap: vars.space.sm,
})
