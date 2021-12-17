import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledTabs = withTheme(styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
`)

const Tabs = ({ children }) => (
  <StyledTabs>
    {children}
  </StyledTabs>
)

export default Tabs
