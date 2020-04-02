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
  flex: 3;
  margin-left: 12px;
  opacity: 0.75;
`

const StyledBalance = styled.div`
  display: flex;
  flex: 2;
  font-size: 22px;
  justify-content: flex-end;
  text-align: left;
`

const StyledCurrency = styled.span`
  font-size: 12px;
  margin-left: 12px;
  opacity: 0.5;
`

const StyledActions = withTheme(styled.div`
  align-items: center;
  background-color: ${props => props.theme.palette.grey[50]};
  display: flex;
  height: 80px;
  padding: 0 48px;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledRows = styled.div`
  padding: 24px 48px;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`

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


  const totalBalance = shellBalance ? `${displayAmount(shellBalance, 18, 0)}` : '--'
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
            <LabelledValue label="Your Balance" value={totalBalance} />
          </OverviewSection>
          <OverviewSection>
            <LabelledValue label="Total Liquidity" value={totalPoolLiquidity} />
          </OverviewSection>
        </Overview>
        <StyledRows>
          <Row>
            <TokenIcon>
              <img src={daiIcon} />
            </TokenIcon>
            <StyledTokenName>
              <LabelledValue label="DAI" value="Dai" />
            </StyledTokenName>
            <StyledBalance>
              <LabelledValue label="Balance" value={daiBalanceDisplay} />
            </StyledBalance>
            <StyledBalance>
              <LabelledValue label="Liquidity" value={daiReserveDisplay} />
            </StyledBalance>
          </Row>
          <Row>
            <TokenIcon>
              <img src={usdcIcon} />
            </TokenIcon>
            <StyledTokenName>
              <LabelledValue label="USDC" value="USD Coin" />
            </StyledTokenName>
            <StyledBalance>
              <LabelledValue label="Balance" value={usdcBalanceDisplay} />
            </StyledBalance>
            <StyledBalance>
              <LabelledValue label="Liquidity" value={usdcReserveDisplay} />
            </StyledBalance>
          </Row>
          <Row>
            <TokenIcon>
              <img src={usdtIcon} />
            </TokenIcon>
            <StyledTokenName>
              <LabelledValue label="USDT" value="Tether" />
            </StyledTokenName>
            <StyledBalance>
              <LabelledValue label="Balance" value={usdtBalanceDisplay} />
            </StyledBalance>
            <StyledBalance>
              <LabelledValue label="Liquidity" value={usdtReserveDisplay} />
            </StyledBalance>
          </Row>
          <Row>
            <TokenIcon>
              <img src={susdIcon} />
            </TokenIcon>
            <StyledTokenName>
              <LabelledValue label="SUSD" value="Sythentix USD" />
            </StyledTokenName>
            <StyledBalance>
              <LabelledValue label="Balance" value={susdBalanceDisplay} />
            </StyledBalance>
            <StyledBalance>
              <LabelledValue label="Liquidity" value={susdReserveDisplay} />
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