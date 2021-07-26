import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledTab = withTheme(styled.div`
  align-items: center;
  background: ${props => props.active ? 'rgba(255,66,161,1) !important' : 'rgb(246 211 246)'};
  color: #fff;
  cursor: pointer;
  display: flex;
  flex: 1;
  font-weight: 700;
  height: 72px;
  font-size: 21px;
  justify-content: center;
  opacity: 1;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  :hover {
    background: rgba(255,66,161,0.6);
    opacity: 1;
  }
  :nth-child(1) {
    background: rgba(255,66,161,.9)
  }
  :nth-child(2) {
    background: rgba(255,66,161,.8)
  }
  :nth-child(3) {
    background: rgba(255,66,161,.7)
  }
  :nth-child(4) {
    background: rgba(255,66,161,.6)
  }
  @media screen and (max-width: 600px) {
    font-size: 18px;
  }
`)

const Tab = ({ active, children, disabled, onClick }) => (
  <StyledTab active={active} disabled={disabled} onClick={onClick}>
    {children}
  </StyledTab>
)

export default Tab
