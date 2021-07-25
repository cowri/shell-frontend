import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'
import {StyledButton} from '../../Button/Button.js';

const StyledModalActions = withTheme(styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin: 40px 55px 20px;
  min-height: 48px;
  ${StyledButton} {
    margin: 0;
  }
  @media (max-width: 512px) {
    margin: 20px 0;
  }
`)

const ModalActions = ({ centered, children }) => (
  <StyledModalActions centered={centered}>
    {children}
  </StyledModalActions>
)

export default ModalActions
