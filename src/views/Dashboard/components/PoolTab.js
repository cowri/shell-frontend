import React, { useContext } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'
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
`

const StyledTokenName = styled.span`
  align-items: center;
  display: flex;
  flex: 1;
  opacity: 0.75;
`

const StyledBalance = styled.div`
  display: flex;
  flex: 1;
  font-size: 22px;
  justify-content: flex-end;
  text-align: right;
  @media (max-width: 512px) {
    font-size: 18px;
  }
`

const StyledActions = withTheme(styled.div`
  align-items: center;
  background-color: ${props => props.theme.palette.grey[50]};
  display: flex;
  height: 80px;
  padding: 0 24px;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledRows = styled.div`
  margin-bottom: 12px;
`

const PoolTab = () => {
  const {
    balances,
    presentDeposit,
    presentWithdraw,
    reserves,
  } = useContext(DashboardContext)

  const {
    totalReserves,
    daiReserve,
    susdReserve,
    usdcReserve,
    usdtReserve,
  } = reserves

  const {
    dai: daiBalance,
    susd: susdBalance,
    usdc: usdcBalance,
    usdt: usdtBalance,
    shell: shellBalance,
  } = balances

  const totalBalance = shellBalance ? `$${displayAmount(shellBalance, 18, 2)}` : '--'
  const totalPoolLiquidity = totalReserves ? `$${displayAmount(totalReserves, 18, 2)}` : '--'

  const daiReserveDisplay = daiReserve ? `$${displayAmount(daiReserve, 18, 2)}` : '--'
  const susdReserveDisplay = susdReserve ? `$${displayAmount(susdReserve, 18, 2)}` : '--'
  const usdcReserveDisplay = usdcReserve ? `$${displayAmount(usdcReserve, 18, 2)}` : '--'
  const usdtReserveDisplay = usdtReserve ? `$${displayAmount(usdtReserve, 18, 2)}` : '--'

  const daiBalanceDisplay = daiBalance ? `$${displayAmount(daiBalance, 18, 2)}` : '--'
  const usdcBalanceDisplay = usdcBalance ? `$${displayAmount(usdcBalance, 6, 2)}` : '--'
  const usdtBalanceDisplay = usdtBalance ? `$${displayAmount(usdtBalance, 6, 2)}` : '--'
  const susdBalanceDisplay = susdBalance ? `$${displayAmount(susdBalance, 18, 2)}` : '--'

  return (
    <StyledPoolTab>
      <Overview>
        <OverviewSection>
          <LabelledValue label="Pool Balance" value={totalPoolLiquidity} />
        </OverviewSection>
        <OverviewSection>
          <LabelledValue label="Your Balance" value={totalBalance} />
        </OverviewSection>
      </Overview>
      <StyledRows>
        <Row head>
          <span style={{ flex: 1 }}>Token</span>
          <span style={{ flex: 1, textAlign: 'right' }}>Pool Balance</span>
          <span style={{ flex: 1, textAlign: 'right' }}>My Balance</span>
        </Row>
        <Row>
          <StyledTokenName>
            <TokenIcon>
              <img src={daiIcon} />
            </TokenIcon>
            <div style={{ width: 12 }} />
            <LabelledValue label="DAI" value="Dai" />
          </StyledTokenName>
          <StyledBalance>
            {daiReserveDisplay}
          </StyledBalance>
          <StyledBalance>
            {daiBalanceDisplay}
          </StyledBalance>
        </Row>
        <Row>
          <StyledTokenName>
            <TokenIcon>
              <img src={usdcIcon} />
            </TokenIcon>
            <div style={{ width: 12 }} />
            <LabelledValue label="USDC" value="USD Coin" />
          </StyledTokenName>
          <StyledBalance>
            {usdcReserveDisplay}
          </StyledBalance>
          <StyledBalance>
            {usdcBalanceDisplay}
          </StyledBalance>
        </Row>
        <Row>
          <StyledTokenName>
            <TokenIcon>
              <img src={usdtIcon} />
            </TokenIcon>
            <div style={{ width: 12 }} />
            <LabelledValue label="USDT" value="Tether" />
          </StyledTokenName>
          <StyledBalance>
            {usdtReserveDisplay}
          </StyledBalance>
          <StyledBalance>
            {usdtBalanceDisplay}
          </StyledBalance>
        </Row>
        <Row>
          <StyledTokenName>
            <TokenIcon>
              <img src={susdIcon} />
            </TokenIcon>
            <div style={{ width: 12 }} />
            <LabelledValue label="SUSD" value="Sythentix USD" />
          </StyledTokenName>
          <StyledBalance hasBalance>
            {susdReserveDisplay}
          </StyledBalance>
          <StyledBalance>
            {susdBalanceDisplay}
          </StyledBalance>
        </Row>
      </StyledRows>
      <StyledActions>
        <Button onClick={presentDeposit}>Deposit</Button>
        <div style={{ width: 12 }} />
        <Button outlined onClick={presentWithdraw}>Withdraw</Button>
      </StyledActions>
    </StyledPoolTab>
  )
}

export default PoolTab