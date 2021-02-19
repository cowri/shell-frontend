import React from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

const StyledTab = withTheme(styled.div`
  align-items: center;
  background: ${props => props.active ? 'rgba(255,66,161,1)' : 'rgb(246 211 246)'};
  color: ${props => props.active ? '#fff' : props.theme.palette.primary.main };
  cursor: pointer;
  display: flex;
  flex: 1;
  font-weight: 700;
  height: 72px;
  font-size: 21px;
  justify-content: center;
  opacity: 1;
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  &:hover {
    background: rgba(255,66,161,0.6);
    opacity: 1;
  }
`)

const Tab = ({ active, children, disabled, onClick }) => (
  <StyledTab active={active} disabled={disabled} onClick={onClick}>
    {children}
  </StyledTab>
)

export default Tab
