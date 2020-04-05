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

import { bnAmount, displayAmount } from '../../../utils/web3Utils'

import BigNumber from 'bignumber.js'

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
  balances,
  contracts,
  onDeposit,
  onDismiss,
  onUnlock,
  reserves,
  unlocking,
  walletBalances,
}) => {
  const [daiInputValue, setDaiInputValue] = useState('')
  const [susdInputValue, setSusdInputValue] = useState('')
  const [usdcInputValue, setUsdcInputValue] = useState('')
  const [usdtInputValue, setUsdtInputValue] = useState('')
  const [slippage, setSlippage] = useState(0)

  const availableDai = walletBalances.dai ? displayAmount(walletBalances.dai, contracts.dai.decimals, 4) : '--'
  const availableUsdc = walletBalances.usdc ? displayAmount(walletBalances.usdc, contracts.usdc.decimals, 4) : '--'
  const availableUsdt = walletBalances.usdt ? displayAmount(walletBalances.usdt, contracts.usdt.decimals, 4) : '--'
  const availableSusd = walletBalances.susd ? displayAmount(walletBalances.susd, contracts.susd.decimals, 4) : '--'

  const handleInput = (e, type, setter) => {
    e.preventDefault()
    if (!isNaN(e.target.value)) {
      setter(e.target.value)
      primeDeposit({ type: type, value: e.target.value })
    }
  }

  const primeDeposit = async (
    inputPayload
  ) => {

    const addresses = [
      contracts.dai.options.address,
      contracts.usdc.options.address,
      contracts.usdt.options.address,
      contracts.susd.options.address,
    ]

    const amounts = [
      bnAmount(inputPayload.type === 'dai' ? inputPayload.value : daiInputValue ? daiInputValue : 0, contracts.dai.decimals).toFixed(),
      bnAmount(inputPayload.type === 'usdc' ? inputPayload.value : usdcInputValue ? usdcInputValue : 0, contracts.usdc.decimals).toFixed(),
      bnAmount(inputPayload.type === 'usdt' ? inputPayload.value : usdtInputValue ? usdtInputValue : 0, contracts.usdt.decimals).toFixed(),
      bnAmount(inputPayload.type === 'susd' ? inputPayload.value : susdInputValue ? susdInputValue : 0, contracts.susd.decimals).toFixed(),
    ]

    const shellsToMint = new BigNumber(
      await contracts.loihi.methods.viewSelectiveDeposit(addresses, amounts).call()
    )

    if (shellsToMint.comparedTo(new BigNumber('3.963877391197344453575983046348115674221700746820753546331534351508065746944e+75')) === 0) {
      console.log("reverted")
    }


    const numeraireAmounts = [
      new BigNumber(await contracts.dai.adapter.methods.viewNumeraireAmount(amounts[0]).call()),
      new BigNumber(await contracts.usdc.adapter.methods.viewNumeraireAmount(amounts[1]).call()),
      new BigNumber(await contracts.usdt.adapter.methods.viewNumeraireAmount(amounts[2]).call()),
      new BigNumber(await contracts.susd.adapter.methods.viewNumeraireAmount(amounts[3]).call())
    ]

    const sum = (accu, val) => accu.plus(val)
    const totalDeposit = numeraireAmounts.reduce(sum, new BigNumber(0))

    const reservesChange = totalDeposit.dividedBy(reserves.totalReserves)
    const shellsChange = shellsToMint.dividedBy(balances.totalShells)
    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(reservesChange)).multipliedBy(new BigNumber(100))
    setSlippage(slippage.toFixed(4))
    
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
            <>
              { slippage == 0 ? '' : slippage > 0 ? 'slippage:' + slippage + '%' : 'anti-slippage:' + slippage + '%' }
            </>
            <TokenInput
              available={availableDai}
              icon={daiIcon}
              locked={allowances.dai === '0'}
              onChange={e => handleInput(e, 'dai', setDaiInputValue)}
              onUnlock={e => onUnlock('dai')}
              symbol="DAI"
              unlocking={unlocking.dai}
              value={daiInputValue}
            />
            <TokenInput
              available={availableUsdc}
              icon={usdcIcon}
              locked={allowances.usdc === '0'}
              onChange={e =>  handleInput(e, 'usdc', setUsdcInputValue)}
              onUnlock={e => onUnlock('usdc')}
              unlocking={unlocking.usdc}
              symbol="USDC"
              value={usdcInputValue}
            />
            <TokenInput
              available={availableUsdt}
              icon={usdtIcon}
              locked={allowances.usdt === '0'}
              onChange={e => handleInput(e, 'usdt', setUsdtInputValue)}
              onUnlock={e => onUnlock('usdt')}
              unlocking={unlocking.usdt}
              symbol="USDT"
              value={usdtInputValue}
            />
            <TokenInput
              available={availableSusd}
              icon={susdIcon}
              locked={allowances.susd === '0'}
              onChange={e => handleInput(e, 'susd', setSusdInputValue)}
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