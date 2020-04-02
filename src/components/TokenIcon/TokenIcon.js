import React from 'react'
import styled from 'styled-components'

const StyledTokenIcon = styled.div`
  align-items: center;
  display: flex;
  height: ${props => props.size}px;
  justify-content: center;
  width: ${props => props.size}px;
  & > * {
    height:100%;
  }
`

const TokenIcon = ({ children, color, size = 36 }) => (
  <StyledTokenIcon color={color} size={size}>
    {children}
  </StyledTokenIcon>
)

export default TokenIcon