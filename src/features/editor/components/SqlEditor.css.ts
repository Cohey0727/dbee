import { style } from '@vanilla-extract/css'

import { vars } from '../../../configs/theme.css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  backgroundColor: vars.color.background,
  overflow: 'hidden',
})
