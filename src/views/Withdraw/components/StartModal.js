import React, { useState } from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import { withTheme } from '@material-ui/core/styles'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'
import shellIcon from '../../../assets/logo.png'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import { displayAmount } from '../../../utils/web3Utils'

const StyledInput = styled.div`
  margin: 24px 0;
`

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
  balances,
  onDismiss,
  onWithdraw,
}) => {

  const handleSubmit = (e) => {
    e.preventDefault()
    onWithdraw()
  }

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Withdraw Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            <TokenInput
              icon={shellIcon}
              symbol="Shells"
              value={displayAmount(balances.shell, 18, -1)}
            />
            <TokenInput
              icon={daiIcon}
              symbol="DAI"
              value={displayAmount(balances.dai, 18, -1)}
            />
            <TokenInput
              icon={usdcIcon}
              symbol="USDC"
              value={displayAmount(balances.usdc, 6, -1)}
            />
            <TokenInput
              icon={usdtIcon}
              symbol="USDT"
              value={displayAmount(balances.usdt, 6, -1)}
            />
            <TokenInput
              icon={susdIcon}
              symbol="SUSD"
              value={displayAmount(balances.susd, 18, -1)}
            />
          </StyledRows>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Button onClick={handleSubmit}>Withdraw Everything</Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  icon,
  symbol,
  value
}) => (
  <StyledInput>
    <TextField fullWidth disabled
      placeholder="0"
      value={value}
      InputProps={{
        endAdornment: <StyledEndAdornment>{symbol}</StyledEndAdornment>,
        startAdornment: (
          <StyledStartAdornment>
            <TokenIcon size={24}> <img src={icon} /> </TokenIcon>
          </StyledStartAdornment>
        )
      }}
    />
  </StyledInput>
)

export default StartModal