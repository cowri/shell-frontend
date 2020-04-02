import React from 'react'
import styled from 'styled-components'

const StyledRow = styled.div`
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.075);
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  font-size: 1.1rem;
  height: 96px;
  margin: 0 24px;
  padding: 0 24px;
  &:first-of-type {
    border-top: 0;
  }
  &:last-of-type {
    border-bottom: 0;
  }
`

const Row = ({ children }) => (
  <StyledRow>
    {children}
  </StyledRow>
)

export default Row