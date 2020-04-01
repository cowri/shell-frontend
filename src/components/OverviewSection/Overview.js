import React from 'react'
import styled from 'styled-components'

const StyledOverviewSection = styled.div`
flex: 1;
`

const OverviewSection = ({ children }) => (
  <StyledOverviewSection>
    {children}
  </StyledOverviewSection>
)

export default OverviewSection