import { style } from '@vanilla-extract/css'

import { vars } from '../configs/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
})

export const main = style({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
})

export const sidebarArea = style({
  display: 'flex',
  flexShrink: 0,
  overflow: 'hidden',
})

export const sidebarDivider = style({
  width: '4px',
  flexShrink: 0,
  backgroundColor: vars.color.border,
  cursor: 'col-resize',
  transition: 'background-color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.primary,
  },
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
})

export const aiPanelArea = style({
  display: 'flex',
  flexShrink: 0,
  overflow: 'hidden',
})

export const aiPanelDivider = style({
  width: '4px',
  flexShrink: 0,
  backgroundColor: vars.color.border,
  cursor: 'col-resize',
  transition: 'background-color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.primary,
  },
})
