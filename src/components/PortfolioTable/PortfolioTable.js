import React from 'react'
import styled from 'styled-components'

import IconButton from '@material-ui/core/IconButton'
import PublishIcon from '@material-ui/icons/Publish'
import GetAppIcon from '@material-ui/icons/GetApp'

import DaiIcon from '../icons/Dai'
import UsdcIcon from '../icons/Usdc'

import Row from '../Row'
import TokenIcon from '../TokenIcon'

const StyledPortfolioTable = styled.div`

`

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

const PortfolioTable = () => (
  <StyledPortfolioTable>
    <Row>
      <TokenIcon color="#00d395" size={36}>
        <DaiIcon />
      </TokenIcon>
      <StyledTokenName>Compound Dai</StyledTokenName>
      <StyledBalance>2,093,319</StyledBalance>
      <div style={{ width: 24 }} />
      <IconButton><GetAppIcon /></IconButton>
      <IconButton><PublishIcon /></IconButton>
    </Row>

    <Row>
      <TokenIcon color="#00d395" size={36}>
        <UsdcIcon />
      </TokenIcon>
      <StyledTokenName>Compound USD Coin</StyledTokenName>
      <StyledBalance>1,758,099</StyledBalance>
      <div style={{ width: 24 }} />
      <IconButton><GetAppIcon /></IconButton>
      <IconButton><PublishIcon /></IconButton>
    </Row>

    <Row>
      <TokenIcon color="#b6509e" size={36}>
        <DaiIcon />
      </TokenIcon>
      <StyledTokenName>Aave DAI</StyledTokenName>
      <StyledBalance>1,393,319</StyledBalance>
      <div style={{ width: 24 }} />
      <IconButton><GetAppIcon /></IconButton>
      <IconButton><PublishIcon /></IconButton>
    </Row>

    <Row>
      <TokenIcon color="#b6509e" size={36}>
        <UsdcIcon />
      </TokenIcon>
      <StyledTokenName>Aave USD Coin</StyledTokenName>
      <StyledBalance>758,099</StyledBalance>
      <div style={{ width: 24 }} />
      <IconButton><GetAppIcon /></IconButton>
      <IconButton><PublishIcon /></IconButton>
    </Row>
  </StyledPortfolioTable>
)

export default PortfolioTable