import React from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDiscord,
  faTelegramPlane,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'

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
  width: 44px;
  opacity: 0.5;
  transition: opacity .2s;
  &:hover {
    opacity: 1;
  }
`

const Footer = () => (
  <Container>
    <StyledFooter>
      <StyledSocialIcon href="#">
        <FontAwesomeIcon icon={faTwitter} />
      </StyledSocialIcon>
      <StyledSocialIcon href="#">
        <FontAwesomeIcon icon={faTelegramPlane} />
      </StyledSocialIcon>
      <StyledSocialIcon href="#">
        <FontAwesomeIcon icon={faDiscord} />
      </StyledSocialIcon>
    </StyledFooter>
  </Container>
)

export default Footer