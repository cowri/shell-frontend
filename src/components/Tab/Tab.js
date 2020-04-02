import React from 'react'
import styled from 'styled-components'

const StyledTab = styled.div`
  align-items: center;
  background: ${props => props.active ? 'transparent' : 'rgba(0,0,0,0.1)'};
  color: ${props => props.active ? '#0043ff' : '#000'};
  cursor: pointer;
  display: flex;
  flex: 1;
  font-weight: 700;
  height: 72px;
  justify-content: center;
  opacity: ${props => props.active ? 1 : 0.5};
  &:hover {
    opacity: 1;
  }
`

const Tab = ({ active, children, onClick }) => (
  <StyledTab active={active} onClick={onClick}>
    {children}
  </StyledTab>
)

export default Tab