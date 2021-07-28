import React, { useEffect } from 'react';

import { ThemeProvider } from '@material-ui/core/styles'

import theme from './theme'

import Dashboard from './views/Dashboard'
import { IS_BSC, IS_XDAI } from "./constants/chainId";

function App() {

    useEffect(() => {
        document.title = `Component on ${IS_BSC ? 'BSC' : IS_XDAI ? 'xDAI' : 'ETH'}`
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Dashboard/>
        </ThemeProvider>
    )
}

export default App
