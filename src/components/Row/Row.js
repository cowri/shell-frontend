import React from 'react'
import styled from 'styled-components'
import { withTheme } from'@material-ui/core/styles'

const StyledRow = withTheme(styled.div`
  align-items: center;
  border-top: ${props => props.hideBorder ? 0 : `1px solid ${props.theme.palette.grey[50]}`};
  color: ${props => props.head ? props.theme.palette.grey[500] : 'inherit'};
  display: flex;
  font-weight: ${props => props.head ? 500 : 400};
  height: ${props => props.head ? 48 : 96}px;
  margin: 0;
  padding: 0 24px;
  @media (max-width: 512px) {
    height: ${props => props.head ? 32 : 80}px;
    padding: 0 12px;
  }
`)

const Row = ({ children, head, hideBorder }) => (
  <StyledRow head={head} hideBorder={hideBorder}>
    {children}
  </StyledRow>
)

export default Row