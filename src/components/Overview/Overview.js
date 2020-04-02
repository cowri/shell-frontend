import React from 'react'
import styled from 'styled-components'

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  font-size: 24px;
  justify-content: space-between;
  margin: 24px;
  padding: 24px;
`

const Overview = ({ children }) => (
  <StyledOverview>
    {children}
  </StyledOverview>
)

export default Overview