import React from 'react'
import styled from 'styled-components'

import logo from '../../logo.png'

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
  color: ${props => props.color};
  font-size: 28px;
  font-weight: 700;
`

const StyledImg = styled.img`
  height: 48px;
  position: relative;
  top: -4px;
`

const Logo = ({ color = "#FFF" }) => (
  <StyledLogo color={color}>
    <StyledImg src={logo} />
    <div style={{ width: 16 }} />
    <span>Shell</span>
  </StyledLogo>
)

export default Logo