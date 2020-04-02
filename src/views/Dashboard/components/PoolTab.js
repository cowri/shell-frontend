import React, { useContext, useState } from 'react'
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

import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'

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

const StyledRows = withTheme(styled.div`
`)

const PoolTab = () => {
  const { balances, reserves } = useContext(DashboardContext)
  const [depositModal, setDepositModal] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)

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

  const totalBalance = shellBalance ? `$${displayAmount(shellBalance, 18, 0)}` : '--'
  const totalPoolLiquidity = totalReserves ? `$${displayAmount(totalReserves, 18, 0)}` : '--'

  const daiReserveDisplay = daiReserve ? `$${displayAmount(daiReserve, 18, 0)}` : '--'
  const susdReserveDisplay = susdReserve ? `$${displayAmount(susdReserve, 18, 0)}` : '--'
  const usdcReserveDisplay = usdcReserve ? `$${displayAmount(usdcReserve, 18, 0)}` : '--'
  const usdtReserveDisplay = usdtReserve ? `$${displayAmount(usdtReserve, 18, 0)}` : '--'

  const daiBalanceDisplay = daiBalance ? `$${displayAmount(daiBalance, 18, 0)}` : '--'
  const susdBalanceDisplay = susdBalance ? `$${displayAmount(susdBalance, 18, 0)}` : '--'
  const usdcBalanceDisplay = usdcBalance ? `$${displayAmount(usdcBalance, 18, 0)}` : '--'
  const usdtBalanceDisplay = usdtBalance ? `$${displayAmount(usdtBalance, 18, 0)}` : '--'

  return (
    <>
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
          <Button onClick={() => setDepositModal(true)}>Deposit</Button>
          <div style={{ width: 12 }} />
          <Button outlined onClick={() => setWithdrawModal(true)}>Withdraw</Button>
        </StyledActions>
      </StyledPoolTab>

      {depositModal && <DepositModal onDismiss={() => setDepositModal(false)} />}
      {withdrawModal && <WithdrawModal onDismiss={() => setWithdrawModal(false)} />}
    </>
  )
}

export default PoolTab