import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalIcon = withTheme(styled.div`
  align-items: center;
  background: ${props => props.theme.palette.primary.main};
  border-radius: 64px;
  display: flex;
  height: 128px;
  justify-content: center;
  margin: 40px auto;
  width: 128px;
  color: #fff;
  flex-shrink: 0;
  & > * {
    font-size: 48px !important;
  }
`)

const ModalIcon = ({ children }) => (
  <StyledModalIcon>
    {children}
  </StyledModalIcon>
)

export default ModalIcon
