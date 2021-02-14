import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledButton = withTheme(styled.button`
  align-items: center;
  background-color: ${props => props.outlined ? '#fff' : '#ff42a1'};
  border: ${props => props.outlined ? '1px solid #000' : '0'};
  border-radius: ${props => props.theme.shape.borderRadius}px;
  box-sizing: border-box;
  color: ${props => props.outlined ? '#000' : '#FFF'};
  cursor: pointer;
  display: flex;
  font-size: ${props => props.small ? '0.8rem' : '1.2rem'};
  font-weight: 700;
  height: ${props => props.withInput ? 42 : props.small ? 32 : 60}px;
  padding: 0 ${props => props.small ? 12 : props.withInput ? 12 : 32}px;
  transition: background-color .2s, border-color .2s;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  opacity: ${props => props.disabled ? 0.8 : 1};
  margin: ${props => props.fullWidth ? '20px auto 80px' : props.withInput ? '0 0 0 20px' : ''};
  max-width: ${props => props.fullWidth ? '460px' : 'auto'};
  width: ${props => props.fullWidth ? '90%' : 'auto'};
  justify-content: center;
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
    >
      {children}
    </StyledButton>
  )
}

export default Button
