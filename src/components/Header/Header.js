import React, {useContext, useEffect, useRef, useState} from 'react';
import styled from 'styled-components'

import Container from '../Container'
import Logo from '../Logo'
import DashboardContext from '../../views/Dashboard/context.js';
import Button from '../Button';
import {IS_BSC, IS_ETH, IS_FTM, IS_XDAI} from '../../constants/chainId.js';

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  padding: 40px 0 30px;
  justify-content: flex-end;
  flex-wrap: wrap;
`

const StyledHeaderLink = styled.a`
  color: ${IS_FTM ? '#0A14EE' : '#ff42a1'};
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
`

const StyledHeaderText = styled.span`
  white-space: nowrap;
  color: ${IS_FTM ? '#fff' : '#ff42a1'};
  font-weight: bold;
  text-decoration: none;
  font-size: 20px;
  margin-right: 20px;
`
const MobileMenuBtn = styled.div`
  align-items: center;
  justify-content: space-around;
  padding: 20px 10px;
  background: ${IS_FTM ? 'rgba(71,136,255,1)' : 'rgba(255,255,255,0.6)'};
  border-radius: 10px;
  position: relative;
  margin-right: 10px;
  display: flex;
  cursor: pointer;
  > span {
    display: block;
    width: 8px;
    height: 8px;
    background: ${IS_FTM ? '#fff' : '#ff42a1'};
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
  background: ${IS_FTM ? '#C6D7FF' : '#fcefff'};
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
        {engine && engine.farming && engine.farming.cmpPrice && <StyledHeaderText>CMP price: ${engine.farming.cmpPrice.toFixed(2)}</StyledHeaderText>}
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
                  ? 'BSC/xDAI bridge'
                  : IS_BSC
                  ? 'ETH/xDAI bridge'
                  : IS_FTM
                  ? ''
                  : 'ETH/BSC bridge'
              }</StyledHeaderLink>
              {!IS_ETH && <StyledHeaderLink href="https://component.finance/" target="_blank">Component on ETH</StyledHeaderLink>}
              {!IS_BSC && <StyledHeaderLink href="https://bsc.component.finance/" target="_blank">Component on BSC</StyledHeaderLink>}
              {!IS_XDAI && <StyledHeaderLink href="https://xdai.component.finance/" target="_blank">Component on xDAI</StyledHeaderLink>}
              {!IS_FTM && <StyledHeaderLink href="https://xdai.component.finance/" target="_blank">Component on FTM</StyledHeaderLink>}
              <StyledHeaderLink href="https://app.uniswap.org/#/swap?inputCurrency=0x9f20ed5f919dc1c1695042542c13adcfc100dcab&outputCurrency=ETH" target="_blank">CMP on Uniswap</StyledHeaderLink>
              <StyledHeaderLink href="https://app.balancer.fi/#/trade/ether/0x9f20ed5f919dc1c1695042542c13adcfc100dcab" target="_blank">CMP on Balancer</StyledHeaderLink>
              {IS_BSC && <StyledHeaderLink href="https://pancakeswap.finance/swap?inputCurrency=0x96124f7382a0ed672bba8f9b92208434eabcfb40&outputCurrency=BNB" target="_blank">CMP on PancakeSwap</StyledHeaderLink>}
              {IS_XDAI && <StyledHeaderLink href="https://app.sushi.com/swap?inputCurrency=0x911F196Ed489e41C8B45B5C56FEce021C27a6159&outputCurrency=0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d" target="_blank">CMP on SushiSwap</StyledHeaderLink>}
              <StyledHeaderLink href="https://docs.component.finance/" target="_blank">Docs</StyledHeaderLink>
              <Button onClick={() => {
                loggedIn ? disconnect() : selectWallet()
                setShowMenu(false)
              }}>
                {loggedIn ? 'Disconnect' : 'Connect'}
              </Button>
            </MobileMenuContainer>
          )}
        </MobileMenuBtn>
      </StyledHeader>
    </Container>
  )
}

export default Header
