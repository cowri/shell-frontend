import { createMuiTheme } from '@material-ui/core/styles'

import { grey, primary } from './colors'

const theme = createMuiTheme({
  palette: {
    grey,
    primary,
  },
  shape: {
    borderRadius: 4,
  }
})

theme.overrides = {
  MuiTextField: {
    root: {
      background: grey[50],
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