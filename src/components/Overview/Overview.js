import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledOverview = withTheme(styled.div`
  align-items: center;
  border-radius: ${props => props.theme.shape.borderRadius}px;
  display: flex;
  flex: 1;
  font-size: 36px;
  justify-content: space-between;
  margin: 0 0 24px 0;
  @media (max-width: 512px) {
    margin: 24px 0;
    padding: 12px 0;
    flex-direction: column;
  }
`)

const Overview = ({ children }) => (
  <StyledOverview>
    {children}
  </StyledOverview>
)

export default Overview
