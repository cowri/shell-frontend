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
  padding: 40px 0 30px;
  justify-content: flex-end;
  flex-wrap: wrap;
`

const StyledHeaderLink = styled.a`
  color: #ff42a1;
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  :not(:last-child) {
    margin-right: 20px;
  }
  @media screen and (max-width: 325px) {
    font-size: 16px;
  }
  &:hover {
    text-decoration: underline;
  }
`

const StyledHeaderText = styled.span`
  white-space: nowrap;
  color: #ff42a1;
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  margin-right: 20px;
  @media screen and (max-width: 325px) {
    font-size: 16px;
  }
`

const ConnectButtonContainer = styled.div`
  @media screen and (max-width: 600px) {
    button {
      padding: 0 16px;
    }
  }
  @media screen and (max-width: 512px) {
    margin-right: 5px;
  }
`

const HeaderLinksContainer = styled.div`
  width: 100%;
  padding: 30px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media screen and (max-width: 512px) {
    justify-content: center;
  }
`

const Header = ({goToIndexTab}) => {
  const {engine, loggedIn, selectWallet, disconnect} = useContext(DashboardContext)
  return (
    <Container>
      <StyledHeader>
        <Logo onClick={() => goToIndexTab()}/>
        <ConnectButtonContainer>
          <Button onClick={() => {loggedIn ? disconnect() : selectWallet()}}>{loggedIn ? 'Disconnect' : 'Connect'}</Button>
        </ConnectButtonContainer>
        {engine && engine.rewards.amount && !engine.rewards.isClaimed && <ClaimRewards />}
        <HeaderLinksContainer>
          {engine && engine.farming && engine.farming.cmpPrice && <StyledHeaderText>CMP price: ${engine.farming.cmpPrice}</StyledHeaderText>}
          <StyledHeaderLink href="https://omni.xdaichain.com/bridge" target="_blank">Bridge to BSC</StyledHeaderLink>
          <StyledHeaderLink href="https://docs.component.finance/" target="_blank">Docs</StyledHeaderLink>
        </HeaderLinksContainer>
      </StyledHeader>
    </Container>
  )
}

export default Header
