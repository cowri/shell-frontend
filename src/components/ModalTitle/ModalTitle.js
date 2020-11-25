import React from 'react'
import { withTheme } from '@material-ui/core/styles'
import styled from 'styled-components'

const StyledModalTitle = withTheme(styled.div`
  font-size: 1.75rem;
  margin-bottom: 10px;
  margin-top: 36px;
  padding: 0 24px;
`)

const ModalTitle = ({ marginBottom, children }) => (
  <StyledModalTitle style={{marginBottom: marginBottom ? marginBottom : '10px'}}>
    {children}
  </StyledModalTitle>
)

export default ModalTitle