import React, { useState } from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import { withTheme } from '@material-ui/core/styles'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import { displayAmount } from '../../../utils/web3Utils'

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

const StartModal = ({
  allowances,
  contracts,
  onDeposit,
  onDismiss,
  onUnlock,
  unlocking,
  walletBalances,
}) => {
  const [daiInputValue, setDaiInputValue] = useState('')
  const [susdInputValue, setSusdInputValue] = useState('')
  const [usdcInputValue, setUsdcInputValue] = useState('')
  const [usdtInputValue, setUsdtInputValue] = useState('')

  const availableDai = walletBalances.dai ? displayAmount(walletBalances.dai, contracts.dai.decimals, -1) : '--'
  const availableUsdc = walletBalances.usdc ? displayAmount(walletBalances.usdc, contracts.usdc.decimals, -1) : '--'
  const availableUsdt = walletBalances.usdt ? displayAmount(walletBalances.usdt, contracts.usdt.decimals, -1) : '--'
  const availableSusd = walletBalances.susd ? displayAmount(walletBalances.susd, contracts.susd.decimals, -1) : '--'

  const handleChange = (e, changeHandler) => {
    const { value } = e.target
    if (!isNaN(value)) {
      changeHandler(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onDeposit(daiInputValue, usdcInputValue, usdtInputValue, susdInputValue)
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
              onChange={e => handleChange(e, setDaiInputValue)}
              onUnlock={e => onUnlock('dai')}
              symbol="DAI"
              unlocking={unlocking.dai}
              value={daiInputValue}
            />
            <TokenInput
              available={availableUsdc}
              icon={usdcIcon}
              locked={allowances.usdc === '0'}
              onChange={e => handleChange(e, setUsdcInputValue)}
              onUnlock={e => onUnlock('usdc')}
              unlocking={unlocking.usdc}
              symbol="USDC"
              value={usdcInputValue}
            />
            <TokenInput
              available={availableUsdt}
              icon={usdtIcon}
              locked={allowances.usdt === '0'}
              onChange={e => handleChange(e, setUsdtInputValue)}
              onUnlock={e => onUnlock('usdt')}
              unlocking={unlocking.usdt}
              symbol="USDT"
              value={usdtInputValue}
            />
            <TokenInput
              available={availableSusd}
              icon={susdIcon}
              locked={allowances.susd === '0'}
              onChange={e => handleChange(e, setSusdInputValue)}
              onUnlock={e => onUnlock('susd')}
              unlocking={unlocking.susd}
              symbol="SUSD"
              value={susdInputValue}
            />
          </StyledRows>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Button onClick={handleSubmit}>Deposit</Button>
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
  unlocking,
  value
}) => (
  <>
    <StyledLabelBar>
      <span>Available: {available} {symbol}</span>
    </StyledLabelBar>
    <TextField fullWidth
      disabled={locked}
      onChange={onChange}
      placeholder="0"
      value={value}
      InputProps={{
        endAdornment: locked ? (
          <div style={{ marginRight: 6 }}>
            <Button
              disabled={unlocking}
              outlined
              small
              onClick={onUnlock}
            >
              {unlocking ? (
                <>
                  <CircularProgress size={18} />
                  <span style={{ marginLeft: 6 }}>Unlocking</span>
                </>
              ) : 'Unlock'}
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
    />
  </>
)

export default StartModal