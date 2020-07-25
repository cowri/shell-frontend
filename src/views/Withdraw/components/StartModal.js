import React, { useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'
import shellIcon from '../../../assets/logo.png'
import tinyShellIcon from '../../../assets/cowri-logo.svg'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import { bnAmount, displayAmount } from '../../../utils/web3Utils'

import BigNumber from 'bignumber.js'

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

const StyledWithdrawEverything = styled.div`
  position: relative;
  height: 25px;
  margin-top: -10px;
  padding-bottom: 20px;
  & .MuiIconButton-root {
    position: relative;
    top: 0px;
    right: 0px;
  }
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

const StyledShells = styled.div`
  align-items: center;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const StyledShellIcon = styled.img`
  height: 48px;
  float: left;
`
const StyledShellBalance = styled.div`
  font-size: 36px;
  font-weight: 300;
`

const StyledFeeMessage = styled.div`
  padding: 20px 10px 10px 10px;
  font-size: 22px;
`

const StartModal = ({
  balances,
  contracts,
  onDismiss,
  onWithdraw,
  reserves,
  setWithdrawEverything,
  withdrawEverything
}) => {

  const [daiInputAmt, setDaiInputAmt] = useState('')
  const [usdcInputAmt, setUsdcInputAmt] = useState('')
  const [usdtInputAmt, setUsdtInputAmt] = useState('')
  const [susdInputAmt, setSusdInputAmt] = useState('')
  const [feeMessage, setFeeMessage] = useState(null)
  const [error, setError] = useState('')

  const epsilonRemovedAmount = (amount, decimals) => {
    const one = new BigNumber(1).pow(decimals)
    const epsilon = new BigNumber(0.000175).pow(decimals)
    return displayAmount(amount.multipliedBy(one.minus(epsilon)), decimals, 4)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (withdrawEverything) {

      onWithdraw()

    } else {

      const addresses = []
      const amounts = []
      if (Number(daiInputAmt)) {
        addresses.push(contracts.dai.options.address)
        amounts.push(bnAmount(daiInputAmt, contracts.dai.decimals).toFixed())
      }

      if (Number(usdcInputAmt)) {
        addresses.push(contracts.usdc.options.address)
        amounts.push(bnAmount(usdcInputAmt, contracts.usdc.decimals).toFixed())
      }

      if (Number(usdtInputAmt)) {
        addresses.push(contracts.usdt.options.address)
        amounts.push(bnAmount(usdtInputAmt, contracts.usdt.decimals).toFixed())
      }

      if (Number(susdInputAmt)) {
        addresses.push(contracts.susd.options.address)
        amounts.push(bnAmount(susdInputAmt, contracts.susd.decimals).toFixed())
      }

      onWithdraw(addresses, amounts)

    }
  }

  const handleWithdrawEverythingCheckbox = (e) => {
    setWithdrawEverything(e.target.checked)
    if (e.target.checked) {
      setDaiInputAmt(epsilonRemovedAmount(balances.dai, 18))
      setUsdcInputAmt(epsilonRemovedAmount(balances.usdc, 6))
      setUsdtInputAmt(epsilonRemovedAmount(balances.usdt, 6))
      setSusdInputAmt(epsilonRemovedAmount(balances.susd, 18))

      const shells = (
        <span style={{position: 'relative', paddingRight: '17.5px'}}> 
          { displayAmount(balances.shell, 18, 2) } 
          <img alt=""
            src={tinyShellIcon} 
            style={{position:'absolute', top:'2.5px', right: '5px', height: '20px' }} 
          /> 
        </span>
      )

      setFeeMessage(<div> You will burn {shells} and pay a 0.0175% fee to liquidity providers </div> )

    } else {
      setDaiInputAmt('')
      setUsdcInputAmt('')
      setUsdtInputAmt('')
      setSusdInputAmt('')
      setFeeMessage('')
    }
  }

  const handleInput = (e, type, setter) => {
    e.preventDefault()
    if (!isNaN(e.target.value)) {
      if (e.target.value === '') {
        setter(e.target.value)
        primeWithdraw({ type: type, value: '0'})
      } else {
        setter(Math.abs(+e.target.value))
        primeWithdraw({ type: type, value: Math.abs(+e.target.value)})
      }
    }
  }

  const primeWithdraw = async (inputPayload) => {

    const addresses = [
      contracts.dai.options.address,
      contracts.usdc.options.address,
      contracts.usdt.options.address,
      contracts.susd.options.address,
    ]

    const amounts = [
      bnAmount(inputPayload.type === 'dai' ? inputPayload.value : daiInputAmt ? daiInputAmt : 0, contracts.dai.decimals).toFixed(),
      bnAmount(inputPayload.type === 'usdc' ? inputPayload.value : usdcInputAmt ? usdcInputAmt : 0, contracts.usdc.decimals).toFixed(),
      bnAmount(inputPayload.type === 'usdt' ? inputPayload.value : usdtInputAmt ? usdtInputAmt : 0, contracts.usdt.decimals).toFixed(),
      bnAmount(inputPayload.type === 'susd' ? inputPayload.value : susdInputAmt ? susdInputAmt : 0, contracts.susd.decimals).toFixed(),
    ]

    const sum = amounts.reduce((accu, val) => accu.plus(val), new BigNumber(0))
    if (sum.isZero()) return setFeeMessage('')

    const shellsToBurn = new BigNumber(await contracts.loihi.methods.viewSelectiveWithdraw(addresses, amounts).call())
    const isReverted = shellsToBurn.comparedTo(new BigNumber('3.963877391197344453575983046348115674221700746820753546331534351508065746944e+75')) === 0

    if (isReverted) {
      setError('This amount triggers the halt check')
      return setFeeMessage('')
    } else if (shellsToBurn.isGreaterThan(balances.shell)) {
      setError('You can not withdraw more than your balance')
      return setFeeMessage('')
    } else {
      setError('')
    }

    const numeraireAmounts = [
      new BigNumber(await contracts.dai.adapter.methods.viewNumeraireAmount(amounts[0]).call()),
      new BigNumber(await contracts.usdc.adapter.methods.viewNumeraireAmount(amounts[1]).call()),
      new BigNumber(await contracts.usdt.adapter.methods.viewNumeraireAmount(amounts[2]).call()),
      new BigNumber(await contracts.susd.adapter.methods.viewNumeraireAmount(amounts[3]).call())
    ]

    const totalWithdraw = numeraireAmounts.reduce((accu, val) => accu.plus(val), new BigNumber(0))

    const reservesChange = totalWithdraw.dividedBy(reserves.totalReserves)
    const shellsChange = shellsToBurn.dividedBy(balances.totalShells)
    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(reservesChange)).multipliedBy(100)

    const shells = (<span style={{position: 'relative', paddingRight: '17.5px'}}> 
        { displayAmount(shellsToBurn, 18, 2) } 
        <img alt=""
          src={tinyShellIcon} 
          style={{position:'absolute', top:'2.5px', right: '5px', height: '20px' }} 
        /> 
    </span>)

    if (slippage.isNegative()) {
      setFeeMessage(<div> You will burn {shells} and pay a {Math.abs(slippage.toFixed(4))} % fee to liquidity providers </div> )
    } else {
      setFeeMessage(<div> You will burn {shells} and earn a {slippage.toFixed(4)} % rebalancing subsidy </div>)
    }

  }

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
  };

  const checkboxClasses = makeStyles({
    root: {
      '& .MuiSvgIcon-root': { 
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '1.65em' 
      },
      color: 'rgba(0, 0, 0, 0.54)',
      padding: 'none'
    }
  }, { name: 'MuiCheckbox' })()

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Withdraw Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            <StyledShells>
                <StyledShellIcon src={shellIcon}/>
                <StyledShellBalance> { displayAmount(balances.shell, 18, 2) + ' Shells'} </StyledShellBalance>
            </StyledShells>
            <StyledFeeMessage> { feeMessage } </StyledFeeMessage>
            <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={daiIcon}
              onChange={e => handleInput(e, 'dai', setDaiInputAmt) }
              symbol="DAI"
              value={daiInputAmt}
            />
            <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={usdcIcon}
              onChange={e => handleInput(e, 'usdc', setUsdcInputAmt) }
              symbol="USDC"
              value={usdcInputAmt}
            />
            <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={usdtIcon}
              onChange={e => handleInput(e, 'usdt', setUsdtInputAmt) }
              symbol="USDT"
              value={usdtInputAmt}
            />
            <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={susdIcon}
              onChange={e => handleInput(e, 'susd', setSusdInputAmt) }
              symbol="SUSD"
              value={susdInputAmt}
            />
            <StyledWithdrawEverything>
              <Checkbox 
                checked={ withdrawEverything }
                className={ checkboxClasses.root }
                onChange={ handleWithdrawEverythingCheckbox }
              >
              </Checkbox>
                Withdraw Everything
            </StyledWithdrawEverything>
          </StyledRows>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Tooltip placement={'top'} title={error} style={ error ? { cursor: 'no-drop'} : null }>
          <div>
            <Button disabled={error ? true : false } onClick={handleSubmit}>{ withdrawEverything ? 'Withdraw Everything' : 'Withdraw' } </Button>
          </div>
        </Tooltip>
      </ModalActions>
      <Snackbar 
        anchorOrigin={{vertical: 'center', horizontal: 'center'}} 
        autoHideDuration={6000} 
        onClose={handleErrorSnackbarClose}
        style={{'marginTop': '65px'}}
        open={!!error.length} 
      >
        <MuiAlert 
          elevation={6}
          onClose={handleErrorSnackbarClose}   
          severity={'error'} 
          variant="filled"
        >
          { error }
        </MuiAlert>
      </Snackbar>
    </Modal>
  )
}

const TokenInput = ({
  disabled,
  error,
  icon,
  onChange,
  symbol,
  value
}) => (
  <StyledInput>
    <TextField fullWidth 
      disabled={disabled}
      error={error}
      min="0"
      onChange={onChange}
      onKeyDown={e => { if (e.keyCode === 189) e.preventDefault() }}
      placeholder="0"
      type="number"
      value={value}
      InputProps={{
        endAdornment: <StyledEndAdornment>{symbol}</StyledEndAdornment>,
        startAdornment: (
          <StyledStartAdornment>
            <TokenIcon size={24}> <img src={icon} alt="" /> </TokenIcon>
          </StyledStartAdornment>
        )
      }}
    />
  </StyledInput>
)

export default StartModal