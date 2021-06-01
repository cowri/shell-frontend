import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'
import {StyledButton} from '../../Button/Button.js';

const StyledModalActions = withTheme(styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin: 40px 0 0;
  min-height: 48px;
  @media (max-width: 512px) {
    flex-direction: column;
  }
  ${StyledButton} {
    margin: 0;
  }
  ${StyledButton}:not(:last-child) {
    margin-right: 2rem;
    @media (max-width: 512px) {
      margin: 0 0 2rem;
    }
  }
`)

const ModalActions = ({ centered, children }) => (
  <StyledModalActions centered={centered}>
    {children}
  </StyledModalActions>
)

export default ModalActions
