import React from 'react'
import styled from 'styled-components'

const StyledOverviewSection = styled.div`
  border-right: 1px solid rgba(0,0,0,0.1);
  flex: 1;
  text-align: center;
  &:last-of-type {
    border-right: 0;
  }
`

const OverviewSection = ({ children }) => (
  <StyledOverviewSection>
    {children}
  </StyledOverviewSection>
)

export default OverviewSection