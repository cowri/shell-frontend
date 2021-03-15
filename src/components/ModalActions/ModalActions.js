import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalActions = withTheme(styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin: 40px;
  min-height: 48px;
  padding: 0 40px;
  @media screen and (max-width: 512px) {
    padding: 0;
    margin: 20px;
  }
`)

const ModalActions = ({ centered, children }) => (
  <StyledModalActions centered={centered}>
    {children}
  </StyledModalActions>
)

export default ModalActions
