import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalTitle = withTheme(styled.div`
  font-size: 1.75rem;
  margin-bottom: 24px;
  margin-top: 24px;
  padding: 0 24px;
`)

const ModalTitle = ({ children }) => (
  <StyledModalTitle>
    {children}
  </StyledModalTitle>
)

export default ModalTitle