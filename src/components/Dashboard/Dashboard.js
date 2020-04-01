import React, { useState } from 'react'
import styled from 'styled-components'

// import logo from '../../logo.png'

import theme from '../../theme'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithubAlt,
  faMediumM,
  faRedditAlien,
  faDiscord,
  faTelegramPlane,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'

import Container from '../Container'
import LabelledValue from '../LabelledValue'
import Logo from '../Logo'

import DaiIcon from '../icons/Dai'
import UsdcIcon from '../icons/Usdc'

const StyledDashboard = styled.div`
  background: radial-gradient(circle, #005669,#000546,#00010f);
  background-size: cover;
  color: #FFF;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`

const StyledSurface = styled.div`
  background: radial-gradient(circle  at 50% -25%, #002f3a,#000431,#000219);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  height: 800px;
  overflow: hidden;
  width: 100%;
`

const StyledTabs = styled.div`
  align-items: center;
  display: flex;
`

const StyledTab = styled.div`
  align-items: center;
  background: ${props => props.active ? 'transparent' : '#000219'};
  color: ${props => props.active ? '#00d1ff' : '#FFF'};
  cursor: pointer;
  display: flex;
  flex: 1;
  font-weight: 500;
  height: 72px;
  justify-content: center;
  opacity: ${props => props.active ? 1 : 0.5};
  &:hover {
    opacity: 1;
  }
`

const StyledTabOverview = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  font-size: 24px;
  justify-content: space-between;
  margin: 24px 48px;
`

const StyledRow = styled.div`
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0,0.5);
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  font-size: 1.1rem;
  height: 96px;
  margin: 0 24px;
  padding: 0 24px;
  &:first-of-type {
    border-top: 0;
  }
  &:last-of-type {
    border-bottom: 0;
  }
`
const StyledTokenIcon = styled.div`
  align-items: center;
  border: 2px solid ${props => props.color};
  border-radius: 48px;
  display: flex;
  height: 44px;
  justify-content: center;
  width: 44px;
`

const StyledTokenIconInner = styled.div`
  height: 36px;
  width: 36px;
  & > * {
    height: 100%;
    width: 100%;
  }
`

const StyledTokenName = styled.span`
  flex: 3;
  margin-left: 24px;
  opacity: 0.8;
`

const StyledBalance = styled.div`
  opacity: 0.9;
`

const StyledCurrency = styled.span`
  flex: 4;
  font-size: 1rem;
  opacity: 0.8;
  text-align: center;
`
const StyledTopBar = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  margin-top: -80px;
`

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pool')
  return (
    <StyledDashboard>
      <Container>
        <StyledTopBar>
          <Logo />
        </StyledTopBar>
      </Container>
      <Container>
        <StyledSurface>
          <StyledTabs>
            <StyledTab
              active={activeTab === 'pool'}
              onClick={() => setActiveTab('pool')}
            >
              Overview
            </StyledTab>
            <StyledTab
              active={activeTab === 'swap'}
              onClick={() => setActiveTab('swap')}
            >
              Swap
            </StyledTab>
            <StyledTab
              active={activeTab === 'deposit'}
              onClick={() => setActiveTab('deposit')}
            >
              Deposit
            </StyledTab>
            <StyledTab
              active={activeTab === 'withdraw'}
              onClick={() => setActiveTab('withdraw')}
            >
              Withdraw
            </StyledTab>
          </StyledTabs>
          {activeTab === 'pool' && <PoolTab />}
          {activeTab === 'portfolio' && <PortfolioTab />}
        </StyledSurface>
      </Container>
      
      <Container>
        <div style={{
          alignItems: 'center',
          display: 'flex',
          height: 96,
          justifyContent: 'space-between',
          marginBottom: -96,
        }}>

          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: 128,
            opacity: 0.5
          }}>
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faTelegramPlane} />
            <FontAwesomeIcon icon={faDiscord} />
          </div>

          <div style={{
            border: `1px solid rgba(255,255,255,.05)`,
            borderRadius: 4,
            lineHeight: '44px',
            fontWeight: 500,
            padding: '0 24px'
          }}>
            <span style={{ opacity: 0.5 }}>Logout</span>
          </div>
        </div>
      </Container>
    </StyledDashboard>
  )
}

export default Dashboard

/*
          <div style={{
            letterSpacing: 2,
            marginBottom: 12,
            marginLeft: 48,
            opacity: 0.5,
            textTransform: 'uppercase',
          }}>
            <span>Pool Balances</span>
          </div>
*/

const PoolTab = () => (
  <>
    <StyledTabOverview>
      <div style={{ borderRight: `1px solid rgba(255,255,255,0.1)`, flex: 1, textAlign: 'center' }}>
        <LabelledValue label="Liquidity" value="$5,420,990" />
      </div>
      <div style={{ flex: 1, textAlign: 'center'  }}>
        <LabelledValue label="Volume 24h" value="$812,344" />
      </div>
    </StyledTabOverview>
    <div>
      <StyledRow>
        <StyledTokenIcon color="#00d395" >
          <StyledTokenIconInner>
            <DaiIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Compound Dai</StyledTokenName>
        <StyledCurrency>cDAI</StyledCurrency>
        <StyledBalance>2,093,319</StyledBalance>
      </StyledRow>

      <StyledRow>
        <StyledTokenIcon color="#00d395" >
          <StyledTokenIconInner>
            <UsdcIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Compound USD Coin</StyledTokenName>
        <StyledCurrency>cUSDC</StyledCurrency>
        <StyledBalance>1,758,099</StyledBalance>
      </StyledRow>

      <StyledRow>
        <StyledTokenIcon color="#b6509e" >
          <StyledTokenIconInner>
            <DaiIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Aave DAI</StyledTokenName>
        <StyledCurrency>aDAI</StyledCurrency>
        <StyledBalance>1,393,319</StyledBalance>
      </StyledRow>

      <StyledRow>
        <StyledTokenIcon color="#b6509e" >
          <StyledTokenIconInner>
            <UsdcIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Aave USD Coin</StyledTokenName>
        <StyledCurrency>aUSDC</StyledCurrency>
        <StyledBalance>758,099</StyledBalance>
      </StyledRow>
    </div>
    <div style={{ height: 96 }} />
  </>
)

const PortfolioTab = () => (
  <>
    <StyledTabOverview>
      <LabelledValue label="Portfolio Balance" value="$5,420,990" />
    </StyledTabOverview>
    <div>
      <StyledRow>
        <StyledTokenIcon color="#00d395" >
          <StyledTokenIconInner>
            <DaiIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Compound Dai</StyledTokenName>
        <StyledCurrency>cDAI</StyledCurrency>
        <StyledBalance>2,093,319</StyledBalance>
      </StyledRow>

      <StyledRow>
        <StyledTokenIcon color="#00d395" >
          <StyledTokenIconInner>
            <UsdcIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Compound USD Coin</StyledTokenName>
        <StyledCurrency>cUSDC</StyledCurrency>
        <StyledBalance>1,758,099</StyledBalance>
      </StyledRow>

      <StyledRow>
        <StyledTokenIcon color="#b6509e" >
          <StyledTokenIconInner>
            <DaiIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Compound Dai</StyledTokenName>
        <StyledCurrency>aDAI</StyledCurrency>
        <StyledBalance>2,093,319</StyledBalance>
      </StyledRow>

      <StyledRow>
        <StyledTokenIcon color="#b6509e" >
          <StyledTokenIconInner>
            <UsdcIcon />
          </StyledTokenIconInner>
        </StyledTokenIcon>
        <StyledTokenName>Compound Dai</StyledTokenName>
        <StyledCurrency>aUSDC</StyledCurrency>
        <StyledBalance>1,758,099</StyledBalance>
      </StyledRow>
    </div>
    <div style={{ height: 64 }} />
  </>
)