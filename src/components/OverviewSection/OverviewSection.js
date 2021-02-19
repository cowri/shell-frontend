import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledOverviewSection = withTheme(styled.div`
  flex: 1;
  text-align: center;
  &:last-of-type {
    border-right: 0;
  }
  @media (max-width: 512px) {
    :first-child {
      margin-bottom: 15px;
    }
  }
`)

const OverviewSection = ({ children }) => (
  <StyledOverviewSection>
    {children}
  </StyledOverviewSection>
)

export default OverviewSection
