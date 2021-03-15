import React from 'react'
import styled from 'styled-components'

import logo from '../../assets/logo.png'

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
  font-size: 24px;
  font-weight: 700;
  @media screen and (max-width: 512px) {
    margin-left: 5px;
  }
`

const StyledImg = styled.img`
  width: 48px;
`

const StyledName = styled.span`
  color: rgb(0,0,0);
  margin-top: -.15em;
  margin-left: .6em;
  font-size: 1.2em;
`

export default function (){
  return (
    <StyledLogo>
      <StyledImg src={logo} />
      <StyledName>component on BSC</StyledName>
    </StyledLogo>
  )
}
