import React from 'react'
import styled from 'styled-components'
import { withTheme } from'@material-ui/core/styles'

const StyledRow = withTheme(styled.div`
  align-items: center;
  color: ${props => props.head ? '#000' : 'inherit'};
  display: flex;
  font-weight: ${props => props.head ? 600 : 400};
  height: ${props => props.head ? 40 : 80}px;
  margin: 0;
  padding: 0 40px;
  font-size: ${p => p.head ? '20px' : 'inherit'};
  @media (max-width: 512px) {
    height: ${props => props.head ? 26 : 65}px;
    padding: 0 12px;
    font-size: ${p => p.head ? '16px' : 'inherit'};
    .mobile-hide {
      display: none;
    }
  }
`)

const Row = ({ children, onClick, onMouseOver, onMouseOut, head, hideBorder, style }) => (
  <StyledRow
    onClick={onClick}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    style={style}
    head={head}
    hideBorder={hideBorder}
  >
    {children}
  </StyledRow>
)

export default Row
