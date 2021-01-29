import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faDiscord, faTelegram, faTwitter, faGithub, faMedium} from '@fortawesome/free-brands-svg-icons';

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
      <StyledSocialIcon target="_blank" href="https://twitter.com/componentx">
        <FontAwesomeIcon icon={faTwitter} size="lg" />
      </StyledSocialIcon>
      <StyledSocialIcon target="_blank" href="https://discord.gg/AMrXmH3yff">
        <FontAwesomeIcon icon={faDiscord} size="lg" />
      </StyledSocialIcon>
      <StyledSocialIcon target="_blank" href="https://github.com/Componentfinance">
        <FontAwesomeIcon icon={faGithub} size="lg" />
      </StyledSocialIcon>
      <StyledSocialIcon target="_blank" href="https://componentfinance.medium.com/">
        <FontAwesomeIcon icon={faMedium} size="lg" />
      </StyledSocialIcon>
      <StyledSocialIcon target="_blank" href="https://t.me/componentfinance">
        <FontAwesomeIcon icon={faTelegram} size="lg" />
      </StyledSocialIcon>
    </StyledFooter>
  </Container>
)

export default Footer
