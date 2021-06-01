import { createMuiTheme } from '@material-ui/core/styles'

import { grey, primary } from './colors'

const theme = createMuiTheme({
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
      paddingLeft: '20px',
    },
    inputBase: {
      height: '60px',
      fontSize: '20px'
    }
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
