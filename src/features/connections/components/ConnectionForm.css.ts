import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
})

export const modal = style({
  width: '100%',
  maxWidth: '480px',
  backgroundColor: vars.color.backgroundSecondary,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: vars.space.md,
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
  padding: vars.space.md,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
})

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
})

export const fieldRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.md,
})

export const label = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  color: vars.color.foreground,
})

export const input = style({
  width: '100%',
  height: '36px',
  padding: `0 ${vars.space.sm}`,
  backgroundColor: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  color: vars.color.foreground,
  fontSize: vars.fontSize.sm,
  outline: 'none',
  transition: 'border-color 0.15s ease',

  ':focus': {
    borderColor: vars.color.borderFocus,
  },

  '::placeholder': {
    color: vars.color.foregroundSecondary,
  },
})

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: vars.space.md,
  marginTop: vars.space.sm,
  borderTop: `1px solid ${vars.color.border}`,
  gap: vars.space.sm,
})

export const footerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const footerRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
})

export const testStatus = style({
  fontSize: vars.fontSize.sm,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
})

export const testSuccess = style([
  testStatus,
  {
    color: vars.color.success,
  },
])

export const testError = style([
  testStatus,
  {
    color: vars.color.error,
  },
])

export const testLoading = style([
  testStatus,
  {
    color: vars.color.foregroundSecondary,
  },
])
