import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTelegram, faTwitter, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

import Container from '../Container'
import theme from '../../theme';
import config from '../../config.js';
import {chainId, IS_BSC, IS_ETH, IS_FTM, IS_XDAI} from '../../constants/chainId.js';
import etherscanIcon from '../../assets/etherscan-logo-circle.svg'
import xdaiIcon from '../../assets/etherscan-logo-circle-xdai.svg'
import fantomIcon from '../../assets/etherscan-logo-circle-fantom.svg'

const StyledFooter = styled.footer`
  align-items: center;
  color: #FFF;
  display: flex;
  height: 136px;
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
    width: 30px;
  }
`

const Footer = ({ shellIx }) => {
  let etherscan = null;
  if (shellIx !== null) {
    const shellAddress = config.pools[chainId][shellIx].shell
    etherscan = IS_ETH
      ? `https://etherscan.io/address/${shellAddress}`
      : IS_BSC
      ? `https://bscscan.com/address/${shellAddress}`
      : `https://blockscout.com/xdai/mainnet/address/${shellAddress}`
  }
  const iconColor = IS_FTM ? '#C6D7FF' : theme.palette.primary.main;

  return (
    <Container>
      <StyledFooter>
        <StyledSocialIcon target="_blank" href="https://twitter.com/componentx">
          <FontAwesomeIcon style={{iconColor}} icon={faTwitter} size="2x"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://discord.gg/AMrXmH3yff">
          <FontAwesomeIcon style={{iconColor}} icon={faDiscord} size="2x"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://github.com/Componentfinance">
          <FontAwesomeIcon style={{iconColor}} icon={faGithub} size="2x"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://componentfinance.medium.com/">
          <FontAwesomeIcon style={{iconColor}} icon={faMedium} size="2x"/>
        </StyledSocialIcon>
        <StyledSocialIcon target="_blank" href="https://t.me/componentfinance">
          <FontAwesomeIcon style={{iconColor}} icon={faTelegram} size="2x"/>
        </StyledSocialIcon>
        {shellIx !== null && (
          <StyledSocialIcon href={etherscan} target="_blank">
            <IconBox >
              <img src={IS_XDAI ? xdaiIcon : IS_FTM ? fantomIcon : etherscanIcon} alt="etherscan logo"/>
            </IconBox>
          </StyledSocialIcon>
        )}
      </StyledFooter>
    </Container>
  )
}

export default Footer
