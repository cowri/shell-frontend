import React from 'react'
import styled from 'styled-components'

import DaiIcon from '../icons/Dai'
import UsdcIcon from '../icons/Usdc'

import Row from '../Row'
import TokenIcon from '../TokenIcon'

const StyledPoolTable = styled.div``

const StyledTokenName = styled.span`
  flex: 3;
  margin-left: 12px;
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

const PoolTable = () => (
  <StyledPoolTable>
    <Row>
      <TokenIcon color="#00d395" size={36}>
        <DaiIcon />
      </TokenIcon>
      <StyledTokenName>Compound Dai</StyledTokenName>
      <StyledCurrency>cDAI</StyledCurrency>
      <StyledBalance>2,093,319</StyledBalance>
    </Row>

    <Row>
      <TokenIcon color="#00d395" size={36}>
        <UsdcIcon />
      </TokenIcon>
      <StyledTokenName>Compound USD Coin</StyledTokenName>
      <StyledCurrency>cUSDC</StyledCurrency>
      <StyledBalance>1,758,099</StyledBalance>
    </Row>

    <Row>
      <TokenIcon color="#b6509e" size={36}>
        <DaiIcon />
      </TokenIcon>
      <StyledTokenName>Aave DAI</StyledTokenName>
      <StyledCurrency>aDAI</StyledCurrency>
      <StyledBalance>1,393,319</StyledBalance>
    </Row>

    <Row>
      <TokenIcon color="#b6509e" size={36}>
        <UsdcIcon />
      </TokenIcon>
      <StyledTokenName>Aave USD Coin</StyledTokenName>
      <StyledCurrency>aUSDC</StyledCurrency>
      <StyledBalance>758,099</StyledBalance>
    </Row>
  </StyledPoolTable>
)

export default PoolTable