import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalContent = withTheme(styled.div`
  padding: 24px;
  @media (max-width: 512px) {
    padding: 12px;
  }
`)

const ModalContent = ({ children }) => (
  <StyledModalContent>
    {children}
  </StyledModalContent>
)

export default ModalContent