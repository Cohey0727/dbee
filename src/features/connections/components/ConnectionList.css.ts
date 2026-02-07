import { keyframes, style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: vars.color.background,
  overflow: 'auto',
})

export const hero = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '80px',
  paddingBottom: vars.space.xl,
  gap: vars.space.md,
})

export const logoContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '72px',
  height: '72px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #007acc 0%, #0098ff 100%)',
  boxShadow: '0 8px 32px rgba(0, 122, 204, 0.3)',
  color: '#ffffff',
})

export const appName = style({
  fontSize: '28px',
  fontWeight: 700,
  color: vars.color.foreground,
  letterSpacing: '-0.5px',
})

export const tagline = style({
  fontSize: vars.fontSize.md,
  color: vars.color.foregroundSecondary,
  marginTop: `-${vars.space.sm}`,
})

export const main = style({
  width: '100%',
  maxWidth: '640px',
  padding: `0 ${vars.space.lg}`,
  paddingBottom: vars.space.xl,
})

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: vars.space.md,
})

export const sectionTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.foregroundSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

export const connectionGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
})

export const newConnectionCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: vars.space.lg,
  backgroundColor: 'transparent',
  border: `2px dashed ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  color: vars.color.foregroundSecondary,
  fontSize: vars.fontSize.sm,
  fontWeight: 500,
  minHeight: '120px',

  ':hover': {
    borderColor: vars.color.primary,
    backgroundColor: 'rgba(0, 122, 204, 0.05)',
    color: vars.color.primary,
  },
})

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.md,
  padding: `${vars.space.xl} 0`,
  color: vars.color.foregroundSecondary,
})

export const emptyText = style({
  fontSize: vars.fontSize.md,
  color: vars.color.foregroundSecondary,
})

export const emptyHint = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.foregroundSecondary,
  opacity: 0.7,
})

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

export const loadingState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: '100vh',
  gap: vars.space.md,
  color: vars.color.foregroundSecondary,
})

export const loadingSpinner = style({
  animation: `${spin} 1s linear infinite`,
  color: vars.color.primary,
})

export const errorState = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.md}`,
  color: vars.color.error,
  backgroundColor: 'rgba(241, 76, 76, 0.08)',
  borderRadius: vars.radius.md,
  marginBottom: vars.space.md,
  fontSize: vars.fontSize.sm,
})
