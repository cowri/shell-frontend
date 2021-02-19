import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalTitle = withTheme(styled.div`
  font-size: 1.75rem;
  padding: 0 24px;
  font-weight: bold;
`)

const ModalTitle = ({ children }) => (
  <StyledModalTitle>
    {children}
  </StyledModalTitle>
)

export default ModalTitle
