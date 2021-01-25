import React from 'react'
import styled from 'styled-components'

import logo from '../../assets/logo.png'

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
  font-size: 24px;
  font-weight: 700;
`

const StyledImg = styled.img`
  width: 48px;
`

const StyledName = styled.span`
  color: rgb(0,0,0);
  margin-top: -.15em;
  margin-left: .6em;
`

export default function (){
  return (
    <StyledLogo>
      <StyledImg src={logo} />
      <StyledName>component</StyledName>
    </StyledLogo>
  )
}
