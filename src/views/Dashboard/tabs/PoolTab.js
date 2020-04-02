import React from 'react'
import styled from 'styled-components'

import LabelledValue from '../../../components/LabelledValue'
import Overview from '../../../components/Overview'
import OverviewSection from '../../../components/OverviewSection'
import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import DaiIcon from '../../../components/icons/Dai'
import UsdcIcon from '../../../components/icons/Usdc'

const StyledPoolTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-bottom: 96px;
`

const StyledTokenName = styled.span`
  flex: 3;
  margin-left: 24px;
  opacity: 0.75;
`

const StyledBalance = styled.div`
  opacity: 0.8;
  font-weight: 700;
`

const StyledCurrency = styled.span`
  flex: 4;
  font-size: 1rem;
  opacity: 0.5;
  text-align: center;
`

const PoolTab = () => (
  <StyledPoolTab>
    <Overview>
      <OverviewSection>
        <LabelledValue label="Liquidity" value="$5,420,990" />
      </OverviewSection>
      <OverviewSection>
        <LabelledValue label="Volume 24h" value="$812,344" />
      </OverviewSection>
    </Overview>

    <div>
      <Row>
        <TokenIcon color="#00d395" >
          <DaiIcon />
        </TokenIcon>
        <StyledTokenName>Compound Dai</StyledTokenName>
        <StyledCurrency>cDAI</StyledCurrency>
        <StyledBalance>2,093,319</StyledBalance>
      </Row>

      <Row>
        <TokenIcon color="#00d395" >
          <UsdcIcon />
        </TokenIcon>
        <StyledTokenName>Compound USD Coin</StyledTokenName>
        <StyledCurrency>cUSDC</StyledCurrency>
        <StyledBalance>1,758,099</StyledBalance>
      </Row>

      <Row>
        <TokenIcon color="#b6509e" >
          <DaiIcon />
        </TokenIcon>
        <StyledTokenName>Aave DAI</StyledTokenName>
        <StyledCurrency>aDAI</StyledCurrency>
        <StyledBalance>1,393,319</StyledBalance>
      </Row>

      <Row>
        <TokenIcon color="#b6509e" >
          <UsdcIcon />
        </TokenIcon>
        <StyledTokenName>Aave USD Coin</StyledTokenName>
        <StyledCurrency>aUSDC</StyledCurrency>
        <StyledBalance>758,099</StyledBalance>
      </Row>
    </div>
  </StyledPoolTab>
)

export default PoolTab