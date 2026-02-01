import { style, styleVariants } from '@vanilla-extract/css'

import { vars } from '../../configs/theme.css'

export const button = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  border: 'none',
  borderRadius: vars.radius.md,
  fontFamily: vars.fontFamily.base,
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  transition: 'background-color 0.15s ease, color 0.15s ease',

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

export const variants = styleVariants({
  primary: {
    backgroundColor: vars.color.primary,
    color: '#ffffff',

    ':hover:not(:disabled)': {
      backgroundColor: vars.color.primaryHover,
    },
  },
  secondary: {
    backgroundColor: vars.color.backgroundTertiary,
    color: vars.color.foreground,
    border: `1px solid ${vars.color.border}`,

    ':hover:not(:disabled)': {
      backgroundColor: vars.color.border,
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: vars.color.foreground,

    ':hover:not(:disabled)': {
      backgroundColor: vars.color.backgroundTertiary,
    },
  },
})

export const sizes = styleVariants({
  sm: {
    height: '24px',
    padding: `0 ${vars.space.sm}`,
    fontSize: vars.fontSize.xs,
  },
  md: {
    height: '32px',
    padding: `0 ${vars.space.md}`,
  },
})
