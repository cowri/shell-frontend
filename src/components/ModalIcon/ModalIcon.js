import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalIcon = withTheme(styled.div`
  align-items: center;
  background: ${props => props.theme.palette.grey[50]};
  border-radius: 64px;
  display: flex;
  height: 128px;
  justify-content: center;
  margin: 0 auto 24px;
  width: 128px;
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