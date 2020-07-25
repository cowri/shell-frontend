import React from 'react'
import styled from 'styled-components'
import config from '../../kovan.config.json'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTelegram, faTwitter, } from '@fortawesome/free-brands-svg-icons'

import etherscan from "../../assets/etherscan-logo-light-circle.svg"

import Container from '../Container'

const StyledFooter = styled.footer`
  align-items: center;
  color: #FFF;
  display: flex;
  height: 96px;
  justify-content: center;
`

const StyledSocialIcon = styled.a`
  align-items: center;
  color: #FFF;
  display: flex;
  height: 44px;
  justify-content: center;
  opacity: 0.5;
  margin: 10px;
  transition: opacity .2s;
  width: 44px;
  &:hover {
    opacity: 1;
  }
`

const Footer = () => (
  <Container>
    <StyledFooter>
      <StyledSocialIcon target="_blank" href="https://twitter.com/shellprotocol">
        <FontAwesomeIcon icon={faTwitter} size="lg" />
      </StyledSocialIcon>
      <StyledSocialIcon target="_blank" href="https://t.me/joinchat/IXE6vxd2VqQT1-VyAxAqig">
        <FontAwesomeIcon icon={faTelegram} size="lg" />
      </StyledSocialIcon>
      <StyledSocialIcon target="_blank" href={"https://etherscan.io/address/" + config.LOIHI} >
        <img src={etherscan} style={{width:'1.33em'}} alt="" />
      </StyledSocialIcon>
      <StyledSocialIcon target="_blank" href="https://discord.gg/ZqMJPr4">
        <FontAwesomeIcon icon={faDiscord} size="lg" />
      </StyledSocialIcon>
    </StyledFooter>
  </Container>
)

export default Footer