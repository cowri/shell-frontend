import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledTabs = withTheme(styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
`)

const Tabs = ({ children }) => (
  <StyledTabs>
    {children}
  </StyledTabs>
)

export default Tabs
