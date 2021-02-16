import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalContent = withTheme(styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 40px;
  @media (max-width: 512px) {
    padding: 24px 24px 0;
  }
`)

const ModalContent = ({ children }) => (
  <StyledModalContent>
    {children}
  </StyledModalContent>
)

export default ModalContent
