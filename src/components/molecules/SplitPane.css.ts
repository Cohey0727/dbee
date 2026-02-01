import { style } from '@vanilla-extract/css'

import { vars } from '../../configs/theme.css'

export const container = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
})

export const pane = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
})

const dividerBase = style({
  backgroundColor: vars.color.border,
  flexShrink: 0,
  transition: 'background-color 0.15s ease',

  ':hover': {
    backgroundColor: vars.color.primary,
  },
})

export const dividerVertical = style([
  dividerBase,
  {
    height: '4px',
    cursor: 'row-resize',
  },
])

export const dividerHorizontal = style([
  dividerBase,
  {
    width: '4px',
    cursor: 'col-resize',
  },
])
