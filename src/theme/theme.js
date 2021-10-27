import { createTheme } from '@material-ui/core/styles'

import { grey, primary } from './colors'
import {IS_FTM} from '../constants/chainId.js';

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
      background: IS_FTM ? '#C6D7FF' : '#e9cff9',
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
