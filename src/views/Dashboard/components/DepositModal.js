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
  const { contracts, walletBalances } = useContext(DashboardContext)

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

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            <StyledLabelBar>
              <span>Available: {availableDai} DAI</span>
            </StyledLabelBar>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>DAI</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={daiIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              onChange={e => handleChange(e, setDaiValue)}
              placeholder="0"
              value={daiValue}
            />
            <StyledLabelBar>
              <span>Available: {availableUsdc} USDC</span>
            </StyledLabelBar>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>USDC</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={usdcIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              onChange={e => handleChange(e, setUsdcValue)}
              placeholder="0"
              value={usdcValue}
            />
            <StyledLabelBar>
              <span>Available: {availableUsdt} USDT</span>
            </StyledLabelBar>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>USDT</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={usdtIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              onChange={e => handleChange(e, setUsdtValue)}
              placeholder="0"
              value={usdtValue}
            />
            <StyledLabelBar>
              <span>Available: {availableSusd} SUSD</span>
            </StyledLabelBar>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>SUSD</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={susdIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              onChange={e => handleChange(e, setSusdValue)}
              placeholder="0"
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

export default DepositModal