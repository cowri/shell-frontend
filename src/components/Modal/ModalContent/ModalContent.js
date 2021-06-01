import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalContent = withTheme(styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`)

const ModalContent = ({ children }) => (
  <StyledModalContent>
    {children}
  </StyledModalContent>
)

export default ModalContent
