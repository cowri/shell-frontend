import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledOverviewSection = withTheme(styled.div`
  border-right: 1px solid ${props => props.theme.palette.grey[50]};
  flex: 1;
  text-align: center;
  &:last-of-type {
    border-right: 0;
  }
`)

const OverviewSection = ({ children }) => (
  <StyledOverviewSection>
    {children}
  </StyledOverviewSection>
)

export default OverviewSection