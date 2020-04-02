import React from 'react'

import { ThemeProvider } from '@material-ui/core/styles'

import theme from './theme'

import Dashboard from './views/Dashboard'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Dashboard />
      </div>
    </ThemeProvider>
  )
}

export default App
