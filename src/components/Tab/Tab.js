import React from 'react'
import styled from 'styled-components'
import * as colors from "../../theme/colors";

const StyledTab = styled.div`
  align-items: center;
  background: ${props => props.active ? '#FFF' : 'transparent'};
  color: ${props => props.active ? colors.primary.main : '#000'};
  cursor: pointer;
  display: flex;
  flex: 1;
  font-weight: 700;
  height: 72px;
  font-size: 18px;
  justify-content: center;
  opacity: ${props => props.active ? 1 : 0.5};
  pointer-events: ${props => props.disabled ? 'none' : 'all'};
  &:hover {
    opacity: 1;
  }
`

const Tab = ({ active, children, disabled, onClick }) => (
  <StyledTab active={active} disabled={disabled} onClick={onClick}>
    {children}
  </StyledTab>
)

export default Tab