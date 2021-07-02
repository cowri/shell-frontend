import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTelegram, faTwitter, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

import Container from '../Container'
import theme from '../../theme';
import etherscanIcon from '../../assets/etherscan-logo-circle.svg'
import config from '../../mainnet.multiple.config.json';

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

const IconBox = styled.span`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 21px;
  }
`

const Footer = ({ shellIx }) => {
  let etherscan = null;
  if (shellIx !== null) {
    etherscan = config.network === 1 ? 'https://etherscan.io/address/' + config.pools[shellIx].shell
      : config.network === 41 ? 'https://kovan.etherscan.io/address/' + config.pools[shellIx].shell
        : config.network === 56 ? 'https://bscscan.com/address/' + config.pools[shellIx].shell
          : ''
  }
  return (
    <Container>
      <StyledFooter>
        <StyledSocialIcon target="_blank" href="https://twitter.com/componentx">
          <FontAwesomeIcon style={{color: theme.palette.primary.main}} icon={faTwitter} size="lg"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://discord.gg/AMrXmH3yff">
          <FontAwesomeIcon style={{color: theme.palette.primary.main}} icon={faDiscord} size="lg"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://github.com/Componentfinance">
          <FontAwesomeIcon style={{color: theme.palette.primary.main}} icon={faGithub} size="lg"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://componentfinance.medium.com/">
          <FontAwesomeIcon style={{color: theme.palette.primary.main}} icon={faMedium} size="lg"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://t.me/componentfinance">
          <FontAwesomeIcon style={{color: theme.palette.primary.main}} icon={faTelegram} size="lg"/>
        </StyledSocialIcon>
        {shellIx !== null && (
          <StyledSocialIcon href={etherscan} target="_blank">
            <IconBox >
              <img src={etherscanIcon} alt="etherscan logo"/>
            </IconBox>
          </StyledSocialIcon>
        )}
      </StyledFooter>
    </Container>
  )
}

export default Footer
