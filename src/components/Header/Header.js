import React, {useContext} from 'react';
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'
import DashboardContext from '../../views/Dashboard/context.js';
import Button from '../Button';
import {StyledButton} from '../Button/Button.js';

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  padding: 40px 0;
  justify-content: flex-end;
  @media screen and (max-width: 600px) {
    flex-wrap: wrap;
  }
`

const StyledHeaderLink = styled.a`
  color: #ff42a1;
  text-decoration: none;
  font-size: 20px;
  margin-right: 20px;
  font-weight: bold;
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
  margin-left: 20px;
  margin-right: 20px;
  @media screen and (max-width: 380px) {
    margin-left: auto;
  }
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

const Header = ({goToIndexTab}) => {
  const {engine, loggedIn, selectWallet, disconnect} = useContext(DashboardContext)
  return (
    <Container>
      <StyledHeader>
        <Logo onClick={() => goToIndexTab()}/>
        {engine && engine.farming && engine.farming.cmpPrice && <StyledHeaderText>CMP price: ${engine.farming.cmpPrice}</StyledHeaderText>}
        <StyledHeaderLink href="https://docs.component.finance/" target="_blank">Docs</StyledHeaderLink>
        <ConnectButtonContainer>
          <Button onClick={() => {loggedIn ? disconnect() : selectWallet()}}>{loggedIn ? 'Disconnect' : 'Connect'}</Button>
        </ConnectButtonContainer>
      </StyledHeader>
    </Container>
  )
}

export default Header
