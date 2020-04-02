import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalActions = withTheme(styled.div`
  align-items: center;
  background-color: ${props => props.theme.palette.grey[50]};
  display: flex;
  justify-content: ${props => props.centered ? 'center' : 'flex-end'};
  margin: 0;
  min-height: 48px;
  padding: 12px 18px;
  & > * {
    margin-left: 6px;
    margin-right: 6px;
  }
  @media (max-width: 512px) {
    padding: 12px;
  }
`)

const ModalActions = ({ centered, children }) => (
  <StyledModalActions centered={centered}>
    {children}
  </StyledModalActions>
)

export default ModalActions