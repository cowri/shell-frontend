import React from 'react'
import styled from 'styled-components'

const StyledTokenIcon = styled.div`
  align-items: center;
  border: 2px solid ${props => props.color};
  border-radius: ${props => props.size}px;
  display: flex;
  height: ${props => props.size - 8}px;
  justify-content: center;
  width: ${props => props.size - 8}px;
`

const StyledTokenIconInner = styled.div`
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  & > * {
    height: 100%;
    width: 100%;
  }
`

const TokenIcon = ({ children, color, size = 48 }) => (
  <StyledTokenIcon color={color} size={size}>
    <StyledTokenIconInner size={size - 12}>
      {children}
    </StyledTokenIconInner>
  </StyledTokenIcon>
)

export default TokenIcon