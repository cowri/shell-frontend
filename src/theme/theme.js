import { createTheme } from '@material-ui/core/styles'

import { grey, primary } from './colors'

const theme = createTheme({
  palette: {
    grey,
    primary,
  },
  shape: {
    borderRadius: 16,
  }
})

theme.overrides = {
  MuiTextField: {
    root: {
      background: '#e9cff9',
      borderRadius: theme.shape.borderRadius,
    },
  },
  MuiButton: {
    disabled: {
      cursor: 'no-drop'
    }
  },
  MuiInput: {
    underline: {
      '&:before': {
        display: 'none',
      },
    }
  },
}

export default theme
