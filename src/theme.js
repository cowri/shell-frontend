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
      paddingTop: 6,
    },
  },
  MuiInput: {
    underline: {
      '&:before': {
        display: 'none',
      },
    }
  },
  MuiInputLabel: {
    formControl: {
      top: 6,
      left: 6
    }
  }
}

export default theme