import React from 'react'
import styled from 'styled-components'

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  font-size: 36px;
  justify-content: space-between;
  margin: 24px 0;
  padding: 24px 0;
  @media (max-width: 512px) {
    margin: 12px 0;
    padding: 12px 0;
  }
`

const Overview = ({ children }) => (
  <StyledOverview>
    {children}
  </StyledOverview>
)

export default Overview