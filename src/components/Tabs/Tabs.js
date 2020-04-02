import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledTabs = withTheme(styled.div`
  align-items: center;
  background-color: ${props => props.theme.palette.grey[50]};
  display: flex;
`)

const Tabs = ({ children }) => (
  <StyledTabs>
    {children}
  </StyledTabs>
)

export default Tabs