import React from 'react'
import styled from 'styled-components'

const StyledOverview = styled.div`
  display: flex;
`

const Overview = ({ children }) => (
  <StyledOverview>
    {children}
  </StyledOverview>
)

export default Overview