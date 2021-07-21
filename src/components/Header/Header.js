import React, {useContext} from 'react';
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'
import {ClaimRewards} from './ClaimRewards.js';
import DashboardContext from '../../views/Dashboard/context.js';
import Button from '../Button';
import {StyledButton} from '../Button/Button.js';

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  padding: 40px 0;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    flex-wrap: wrap;
  }
`

const StyledHeaderLink = styled.a`
  color: #ac0cee;
  text-decoration: none;
  font-size: 20px;
  margin-right: 20px;
  margin-left: auto;
  &:hover {
    text-decoration: underline;
  }
`

const StyledHeaderText = styled.span`
  color: #00010f;
  text-decoration: none;
  font-size: 20px;
  margin-left: auto;
  margin-right: 20px;
`

const ConnectButtonContainer = styled.div`
  @media screen and (max-width: 600px) {
    width: 100%;
    ${StyledButton} {
      margin: 40px auto 0 !important;
      justify-self: center !important;
    }
  }
`

const Header = () => {
  const {engine, loggedIn, selectWallet, disconnect} = useContext(DashboardContext)
  return (
    <Container>
      <StyledHeader>
        <Logo />
          {engine && engine.staking && engine.staking.cmpPrice && <StyledHeaderText>CMP price: ${engine.staking.cmpPrice}</StyledHeaderText>}
        <StyledHeaderLink href="https://docs.component.finance/" target="_blank">Docs</StyledHeaderLink>
        <ConnectButtonContainer>
          <Button onClick={() => {loggedIn ? disconnect() : selectWallet()}}>{loggedIn ? 'Disconnect' : 'Connect'}</Button>
        </ConnectButtonContainer>
        {engine && engine.rewards.amount && !engine.rewards.isClaimed && <ClaimRewards />}
      </StyledHeader>
    </Container>
  )
}

export default Header
