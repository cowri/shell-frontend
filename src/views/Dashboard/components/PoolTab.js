import React, { useContext } from 'react'
import styled from 'styled-components'

import LabelledValue from '../../../components/LabelledValue'
import Overview from '../../../components/Overview'
import OverviewSection from '../../../components/OverviewSection'
import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'

import { displayAmount } from '../../../utils/web3Utils'

import DashboardContext from '../context'

const StyledPoolTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-bottom: 96px;
`

const StyledTokenName = styled.span`
  align-items: baseline;
  display: flex;
  flex: 1;
  margin-left: 24px;
  opacity: 0.75;
`

const StyledBalance = styled.div`
  opacity: 0.8;
  font-weight: 700;
`

const StyledCurrency = styled.span`
  flex: 4;
  margin-left: 24px;
  opacity: 0.5;
`

const PoolTab = () => {
  const { reserves } = useContext(DashboardContext)

  const {
    totalReserves,
    daiReserve,
    susdReserve,
    usdcReserve,
    usdtReserve,
  } = reserves
  if (totalReserves) {
    console.log(daiReserve.toNumber())
  }

  return (
    <StyledPoolTab>
      {!!totalReserves && (
        <>
          <Overview>
            <OverviewSection>
              <LabelledValue label="Pool Liquidity" value={`$${displayAmount(totalReserves, 18, 0)}`} />
            </OverviewSection>
          </Overview>
          <div>
            <Row>
              <TokenIcon>
                <img src={daiIcon} />
              </TokenIcon>
              <StyledTokenName>Dai<StyledCurrency>DAI</StyledCurrency></StyledTokenName>
              <StyledBalance>
                {`$${displayAmount(daiReserve, 18, 0)}`}
              </StyledBalance>
            </Row>
            <Row>
              <TokenIcon>
                <img src={usdcIcon} />
              </TokenIcon>
              <StyledTokenName>USD Coin<StyledCurrency>USDC</StyledCurrency></StyledTokenName>
              <StyledBalance>
                {`$${displayAmount(usdcReserve, 18, 0)}`}
              </StyledBalance>
            </Row>
            <Row>
              <TokenIcon>
                <img src={usdtIcon} />
              </TokenIcon>
              <StyledTokenName>Tether<StyledCurrency>USDT</StyledCurrency></StyledTokenName>
              <StyledBalance>
                {`$${displayAmount(usdtReserve, 18, 0)}`}
              </StyledBalance>
            </Row>
            <Row>
              <TokenIcon>
                <img src={susdIcon} />
              </TokenIcon>
              <StyledTokenName>Synthetix USD<StyledCurrency>SUSD</StyledCurrency></StyledTokenName>
              <StyledBalance>
                {`$${displayAmount(susdReserve, 18, 0)}`}
              </StyledBalance>
            </Row>
          </div>
        </>
      )}
    </StyledPoolTab>
  )
}

export default PoolTab