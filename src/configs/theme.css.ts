import { createTheme, createThemeContract, globalStyle } from '@vanilla-extract/css'

export const vars = createThemeContract({
  color: {
    background: null,
    backgroundSecondary: null,
    backgroundTertiary: null,
    foreground: null,
    foregroundSecondary: null,
    border: null,
    borderFocus: null,
    primary: null,
    primaryHover: null,
    error: null,
    success: null,
    warning: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  fontSize: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  fontFamily: {
    base: null,
    mono: null,
  },
  radius: {
    sm: null,
    md: null,
    lg: null,
  },
})

export const darkTheme = createTheme(vars, {
  color: {
    background: '#1e1e1e',
    backgroundSecondary: '#252526',
    backgroundTertiary: '#2d2d2d',
    foreground: '#cccccc',
    foregroundSecondary: '#858585',
    border: '#3c3c3c',
    borderFocus: '#007acc',
    primary: '#007acc',
    primaryHover: '#1c8cd9',
    error: '#f14c4c',
    success: '#89d185',
    warning: '#cca700',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '14px',
    xl: '16px',
  },
  fontFamily: {
    base: '"Nunito Sans", "Hiragino Maru Gothic Pro", "Rounded Mplus 1c", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"Fira Code", "JetBrains Mono", "Cascadia Code", "Roboto Mono", Menlo, monospace',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
  },
})

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
  fontFamily: 'inherit',
})

globalStyle('html, body', {
  height: '100%',
  width: '100%',
})

globalStyle('body', {
  fontFamily: vars.fontFamily.base,
  fontSize: vars.fontSize.md,
  color: vars.color.foreground,
  backgroundColor: vars.color.background,
  lineHeight: 1.5,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
})

globalStyle('#root', {
  height: '100%',
  width: '100%',
})

globalStyle('button', {
  fontFamily: 'inherit',
  cursor: 'pointer',
})

globalStyle('input, textarea', {
  fontFamily: 'inherit',
})
