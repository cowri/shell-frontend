import React, { useEffect } from 'react';

import { ThemeProvider } from '@material-ui/core/styles'

import theme from './theme'

import Dashboard from './views/Dashboard'
import {IS_BSC, IS_FTM, IS_XDAI} from './constants/chainId';

function App() {

  useEffect(() => {
    document.title = `Component on ${IS_BSC ? 'BSC' : IS_XDAI ? 'xDAI' : IS_FTM ? 'FTM' : 'ETH'}`

    if (+process.env.REACT_APP_CHAIN_ID === 1) {
      document.documentElement.classList.add('fantom')
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Dashboard/>
    </ThemeProvider>
  )
}

export default App
