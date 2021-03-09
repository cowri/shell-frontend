import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledButton = withTheme(styled.button`
  align-items: center;
  background: ${props => props.outlined ? '#e9cff9' : '#ff42a1'};
  border: none;
  border-radius: ${props => props.theme.shape.borderRadius}px;
  box-sizing: border-box;
  color: ${props => props.outlined ? props.theme.palette.primary.main : '#FFF'};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.small ? '1rem' : '1.2rem'};
  font-weight: 700;
  height: ${props => props.withInput ? 60 : props.small ? 32 : 60}px;
  padding: 0 ${props => props.small ? 30 : props.withInput ? 12 : 32}px;
  transition: background-color .2s, border-color .2s;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  opacity: ${props => props.disabled ? 0.8 : 1};
  margin: ${props => props.fullWidth ? '20px auto 70px' : props.withInput ? '0 0 0 20px' : ''};
  max-width: ${props => props.fullWidth ? '460px' : 'auto'};
  width: ${props => props.fullWidth ? '90%' : 'auto'};
  justify-content: center;
  outline: none;
  &:hover {
    background-color: ${props => props.outlined && '#FFF'};
    border-color: ${props => props.outlined ? props.theme.palette.primary.main : 'transparent'};
    color: ${props => props.outlined ? props.theme.palette.primary.main : '#000' };
  }
`)

const Button = ({
  disabled,
  children,
  onClick,
  outlined,
  withInput,
  small,
  fullWidth,
  ...props
}) => {

  return (
    <StyledButton
      disabled={disabled}
      onClick={onClick}
      outlined={outlined}
      small={small}
      withInput={withInput}
      fullWidth={fullWidth}
      type="button"
      {...props}
    >
      {children}
    </StyledButton>
  )
}

export default Button
