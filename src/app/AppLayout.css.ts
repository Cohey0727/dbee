import { style } from '@vanilla-extract/css'

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

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
})
