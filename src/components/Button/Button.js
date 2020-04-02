import React from 'react'
import styled from 'styled-components'

import theme from '../../theme'

const StyledButton = styled.button`
  align-items: center;
  background-color: ${props => props.outlined ? 'transparent' : theme.palette.primary.main};
  border: 0;
  border-radius: ${theme.shape.borderRadius}px;
  box-sizing: border-box;
  color: #FFF;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 48px;
  padding: 0 24px;
  transition: background-color .2s, border-color .2s;
  &:hover {
    background-color: ${props => props.outlined ? 'rgba(255,255,255,0.1)' : theme.palette.primary.dark};
    color: ${props => props.outlined ? '#FFF' : '#FFF'};
  }
`

const Button = ({ children, onClick, outlined }) => {

  return (
    <StyledButton
      onClick={onClick}
      outlined={outlined}
    >
      {children}
    </StyledButton>
  )
}

export default Button