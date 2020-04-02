import React from 'react'
import styled from 'styled-components'

const StyledRow = styled.div`
  align-items: center;
  border-bottom: ${props => props.hideBorder ? 0 : '1px solid rgba(0,0,0,0.075)'};
  border-top: ${props => props.hideBorder ? 0 : '1px solid rgba(255,255,255,0.08)'};
  display: flex;
  height: 96px;
  &:first-of-type {
    border-top: 0;
  }
  &:last-of-type {
    border-bottom: 0;
  }
`

const Row = ({ children, hideBorder }) => (
  <StyledRow hideBorder={hideBorder}>
    {children}
  </StyledRow>
)

export default Row