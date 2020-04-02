import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import { withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'

import { displayAmount } from '../../../utils/web3Utils'

import DashboardContext from '../context'

const StyledStartAdornment = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
`

const StyledEndAdornment = styled.div`
  padding-left: 6px;
  padding-right: 12px;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

const StyledRows = styled.div`
  margin-bottom: 24px;
  margin-top: -24px;
`

const StyledLabelBar = withTheme(styled.div`
  align-items: center;
  color: ${props => props.theme.palette.grey[500]};
  display: flex;
  height: 32px;
  justify-content: space-between;
  margin-top: 24px;
`)

const DepositModal = ({ onDeposit, onDismiss }) => {
  const { allowances, contracts, walletBalances } = useContext(DashboardContext)

  const [daiValue, setDaiValue] = useState('')
  const [susdValue, setSusdValue] = useState('')
  const [usdcValue, setUsdcValue] = useState('')
  const [usdtValue, setUsdtValue] = useState('')

  const availableDai = walletBalances.dai ? displayAmount(walletBalances.dai, contracts.dai.decimals, -1) : '--'
  const availableUsdc = walletBalances.usdc ? displayAmount(walletBalances.usdc, contracts.usdc.decimals, -1) : '--'
  const availableUsdt = walletBalances.usdt ? displayAmount(walletBalances.usdt, contracts.usdt.decimals, -1) : '--'
  const availableSusd = walletBalances.susd ? displayAmount(walletBalances.susd, contracts.susd.decimals, -1) : '--'

  const handleChange = (e, updateHandler) => {
    const { value } = e.target
    if (!isNaN(value)) {
      updateHandler(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(daiValue, susdValue, usdcValue, usdtValue)
  }

  const handleUnlock = () => {

  }

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            <TokenInput
              available={availableDai}
              icon={daiIcon}
              locked={allowances.dai === '0'}
              onChange={e => handleChange(e, setDaiValue)}
              onUnlock={handleUnlock}
              symbol="DAI"
              value={daiValue}
            />
            <TokenInput
              available={availableUsdc}
              icon={usdcIcon}
              locked={allowances.usdc === '0'}
              onChange={e => handleChange(e, setUsdcValue)}
              onUnlock={handleUnlock}
              symbol="USDC"
              value={usdcValue}
            />
            <TokenInput
              available={availableUsdt}
              icon={usdtIcon}
              locked={allowances.usdt === '0'}
              onChange={e => handleChange(e, setUsdtValue)}
              onUnlock={handleUnlock}
              symbol="USDT"
              value={usdtValue}
            />
            <TokenInput
              available={availableSusd}
              icon={susdIcon}
              locked={allowances.susd === '0'}
              onChange={e => handleChange(e, setSusdValue)}
              onUnlock={handleUnlock}
              symbol="SUSD"
              value={susdValue}
            />
          </StyledRows>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Button>Deposit</Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  available,
  icon,
  locked,
  onChange,
  onUnlock,
  symbol,
  value
}) => (
  <>
    <StyledLabelBar>
      <span>Available: {available} {symbol}</span>
    </StyledLabelBar>
    <TextField
      disabled={locked}
      fullWidth
      InputProps={{
        endAdornment: locked ? (
          <div style={{ marginRight: 6 }}>
            <Button
              outlined
              small
              onClick={onUnlock}
            >
              Unlock
            </Button>
          </div>
        ) : (
          <StyledEndAdornment>{symbol}</StyledEndAdornment>
        ),
        startAdornment: (
          <StyledStartAdornment>
            <TokenIcon size={24}>
              <img src={icon} />
            </TokenIcon>
          </StyledStartAdornment>
        )
      }}
      onChange={onChange}
      placeholder="0"
      value={value}
    />
  </>
)

export default DepositModal