import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledButton = withTheme(styled.button`
  align-items: center;
  background-color: ${props => props.outlined ? props.theme.palette.grey[50] : props.theme.palette.primary.main};
  border: ${props => props.outlined ? `1px solid ${props.theme.palette.grey[200]}` : '0'};
  border-radius: ${props => props.theme.shape.borderRadius}px;
  box-sizing: border-box;
  color: ${props => props.outlined ? props.theme.palette.grey[600] : '#FFF'};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  height: 48px;
  padding: 0 32px;
  transition: background-color .2s, border-color .2s;
  &:hover {
    background-color: ${props => props.outlined ? '#FFF' : props.theme.palette.primary.dark};
    color: ${props => props.outlined ? props.theme.palette.primary.main : '#FFF' };
  }
`)

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