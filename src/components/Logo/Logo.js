import React from 'react'
import styled from 'styled-components'

import logo from '../../assets/logo.png'

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
  color: ${props => props.color};
  font-size: 24px;
  font-weight: 700;
`

const StyledImg = styled.img`
  height: 48px;
  position: relative;
  top: -2px;
`

const Logo = ({ color = "#FFF" }) => (
  <StyledLogo color={color}>
    <StyledImg src={logo} />
    <div style={{ width: 4 }} />
    <span>Shell</span>
  </StyledLogo>
)

export default Logo