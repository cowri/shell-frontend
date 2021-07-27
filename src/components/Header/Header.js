import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'
import DashboardContext from '../../views/Dashboard/context.js';
import Button from '../Button';
import {IS_BSC, IS_ETH, IS_XDAI} from '../../constants/chainId.js';

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
  margin-bottom: 15px;
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
`
const MobileMenuBtn = styled.div`
  align-items: center;
  justify-content: space-around;
  padding: 20px 10px;
  background: rgba(255,255,255,0.6);
  border-radius: 10px;
  position: relative;
  margin-right: 10px;
  display: flex;
  cursor: pointer;
  > span {
    display: block;
    width: 8px;
    height: 8px;
    background: #ff42a1;
    border-radius: 50%;
    &:nth-child(1),
    &:nth-child(2) {
      margin-right: 4px;
    }
  }
`

const MobileMenuContainer = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  width: auto;
  background: #fcefff;
  z-index: 10;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 1px 1px 10px 2px rgba(0, 0, 255, .2);
  display: flex;
  flex-direction: column;
`

const Header = ({goToIndexTab}) => {
  const {engine, loggedIn, selectWallet, disconnect} = useContext(DashboardContext)
  const [showMenu, setShowMenu] = useState(false)

  const showMenuRef = useRef(showMenu)

  useEffect(() => {
    document.addEventListener('click', () => {
      if (showMenuRef.current) {
        showMenuRef.current = false
        setShowMenu(false)
      }
    })
  }, [])

  return (
    <Container>
      <StyledHeader>
        <Logo onClick={() => goToIndexTab()}/>
        {engine && engine.farming && engine.farming.cmpPrice && <StyledHeaderText>CMP price: ${engine.farming.cmpPrice}</StyledHeaderText>}
        <MobileMenuBtn
          onClick={e => {
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            showMenuRef.current = !showMenu
            setShowMenu(!showMenu)
          }}
        >
          <span />
          <span />
          <span />
          {showMenu && (
            <MobileMenuContainer
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <StyledHeaderLink href="https://omni.xdaichain.com/bridge" target="_blank">{
                IS_ETH
                  ? 'Bridge to ETH'
                  : IS_BSC
                  ? 'Bridge to BSC'
                  : 'Bridge to xDAI'
              }</StyledHeaderLink>
              {!IS_ETH && <StyledHeaderLink href="https://component.finance/" target="_blank">Component on ETH</StyledHeaderLink>}
              {!IS_BSC && <StyledHeaderLink href="https://bsc.component.finance/" target="_blank">Component on BSC</StyledHeaderLink>}
              {!IS_XDAI && <StyledHeaderLink href="https://xdai.component.finance/" target="_blank">Component on xDAI</StyledHeaderLink>}
              <StyledHeaderLink href="https://docs.component.finance/" target="_blank">Docs</StyledHeaderLink>
              <Button onClick={() => {loggedIn ? disconnect() : selectWallet()}}>{loggedIn ? 'Disconnect' : 'Connect'}</Button>
            </MobileMenuContainer>
          )}
        </MobileMenuBtn>
      </StyledHeader>
    </Container>
  )
}

export default Header
