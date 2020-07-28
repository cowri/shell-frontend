import React, { useState } from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, withTheme } from '@material-ui/core/styles'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'
import shellIcon from '../../../assets/cowri-logo.svg'

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
  margin-top: 18px;
`)

const StyledWarning = styled.div`
  font-size: 19px;
  width: 82.5%;
  margin: 0 auto;
  margin-top: 2.5px;
  color: red;
`

const StyledFeeMessage = styled.div`
  margin: 10px auto;
  width: 82.5%;
  font-size: 19px;
`

const StartModal = ({
  allowances,
  balances,
  contracts,
  loihi,
  onDeposit,
  onDismiss,
  onUnlock,
  liquidity,
  unlocking,
  walletBalances,
}) => {

  const [daiInputValue, setDaiInputValue] = useState('')
  const [usdcInputValue, setUsdcInputValue] = useState('')
  const [usdtInputValue, setUsdtInputValue] = useState('')
  const [susdInputValue, setSusdInputValue] = useState('')
  const [daiError, setDaiError] = useState('')
  const [usdcError, setUsdcError] = useState('')
  const [usdtError, setUsdtError] = useState('')
  const [susdError, setSusdError] = useState('')
  const [error, setError] = useState('')
  const [feeMessage, setFeeMessage] = useState('')
  const [toolTip, setToolTip] = useState('')

  function composeToolTip (payload) {

    if (payload.type === 'error') {

      setToolTip('Deposit amounts trigger halt check')

    } else {
      console.log("payload.trigger", payload.trigger)

      payload.setter(payload.trigger ? 'amount is greater than your balance' : '')

      const setDai = (payload.type === 'dai' && payload.trigger) || (payload.type !== 'dai' && !!daiError.length)
      const setUsdc = (payload.type === 'usdc' && payload.trigger) || (payload.type !== 'usdc' && !!usdcError.length)
      const setUsdt = (payload.type === 'usdt' && payload.trigger) || (payload.type !== 'usdt' && !!usdtError.length)
      const setSusd = (payload.type === 'susd' && payload.trigger) || (payload.type !== 'susd' && !!susdError.length)

      if (!setDai && !setUsdc && !setUsdt && !setSusd) {

        return setToolTip('')

      } else {

        let tip = ' in your wallet'
        let count = 0;

        if (setDai) buildTip("DAI")
        if (setUsdc) buildTip("USDC")
        if (setUsdt) buildTip("USDT")
        if (setSusd) buildTip("SUSD")

        tip = 'Insufficient' + tip

        return setToolTip(tip)

        function buildTip (piece) {
          if (count === 0) tip = ' ' + piece + tip
          else if (count === 1) tip = ' ' + piece + ' and' + tip
          else tip = ' ' + piece + ','  + tip
          count++
        }

      }

    }

  }

  const availableDai = walletBalances.dai ? contracts.dai.getDisplayFromNumeraire(walletBalances.dai, 4) : '--'
  const availableUsdc = walletBalances.usdc ? contracts.usdc.getDisplayFromNumeraire(walletBalances.usdc, 4) : '--'
  const availableUsdt = walletBalances.usdt ? contracts.usdt.getDisplayFromNumeraire(walletBalances.usdt, 4) : '--'
  const availableSusd = walletBalances.susd ? contracts.susd.getDisplayFromNumeraire(walletBalances.susd, 4) : '--'

  console.log("available dai", availableDai)

  const handleInput = (e, type, setter) => {
    e.preventDefault()
    if (!isNaN(e.target.value)) {
      if (e.target.value === '') {
        setter(e.target.value)
        primeDeposit({ type: type, value: '0'})
      } else {
        setter(Math.abs(+e.target.value))
        primeDeposit({ type: type, value: Math.abs(+e.target.value)})
      }
    }
  }

  const primeDeposit = async (payload) => {

    if ( contracts[payload.type].getNumeraireFromDisplay(payload.value).isGreaterThan(walletBalances[payload.type]) ) {

      if (payload.type === 'dai') composeToolTip({ setter: setDaiError, trigger: true, type: 'dai'})
      if (payload.type === 'usdc') composeToolTip({ setter: setUsdcError, trigger: true, type: 'usdc'})
      if (payload.type === 'usdt') composeToolTip({ setter: setUsdtError, trigger: true, type: 'usdt'})
      if (payload.type === 'susd') composeToolTip({ setter: setSusdError, trigger: true, type: 'susd'})

    } else {
      
      if (payload.type === 'dai') composeToolTip({ setter: setDaiError, trigger: false, type: 'dai'})
      if (payload.type === 'usdc') composeToolTip({ setter: setUsdcError, trigger: false, type: 'usdc'})
      if (payload.type === 'usdt') composeToolTip({ setter: setUsdtError, trigger: false, type: 'usdt'})
      if (payload.type === 'susd') composeToolTip({ setter: setSusdError, trigger: false, type: 'susd'})
      
    }

    const daiAmount = payload.type === 'dai' ? payload.value : daiInputValue ? daiInputValue : 0
    const usdcAmount = payload.type === 'usdc' ? payload.value : usdcInputValue ? usdcInputValue : 0
    const usdtAmount = payload.type === 'usdt' ? payload.value : usdtInputValue ? usdtInputValue : 0
    const susdAmount = payload.type === 'susd' ? payload.value : susdInputValue ? susdInputValue : 0

    const addresses = [
      contracts.dai.address,
      contracts.usdc.address,
      contracts.usdt.address,
      contracts.susd.address
    ]

    const amounts = [
      contracts.dai.getRawFromDisplay(daiAmount),
      contracts.usdc.getRawFromDisplay(usdcAmount),
      contracts.usdt.getRawFromDisplay(usdtAmount),
      contracts.susd.getRawFromDisplay(susdAmount)
    ]

    if (amounts.reduce((accu, val) => accu.plus(val), new BigNumber(0)).isZero()) return setFeeMessage('')

    const shellsToMint = await loihi.viewSelectiveDeposit(addresses, amounts)

    if (shellsToMint === false) {

      setError('This amount triggers the halt check')

      return setFeeMessage('')

    } else {

      setError('')

    }

    var totalDeposit = contracts.dai.getNumeraireFromDisplay(daiAmount)
      .plus(contracts.usdc.getNumeraireFromDisplay(usdcAmount))
      .plus(contracts.usdt.getNumeraireFromDisplay(usdtAmount))
      .plus(contracts.susd.getNumeraireFromDisplay(susdAmount))

    const liquidityChange = totalDeposit.dividedBy(liquidity.total)

    const shellsChange = shellsToMint.dividedBy(balances.total)

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))

    const slippageMessage = slippage.absoluteValue().isGreaterThan(0.0001)
      ? slippage.isNegative()
        ? <span> and earn a { Math.abs(slippage.toFixed(4)) } % rebalancing subsidy </span> 
        : <span> and pay a { slippage.toFixed(4) } % fee to liquidity providers </span>
      : ''
    
    const feeMessage = <div>
      You will mint 
        <span style={{position: 'relative', paddingRight: '17.5px'}}> 
          { loihi.getDisplayFromNumeraire(shellsToMint, 2) } 
          <img alt="" 
            src={shellIcon} 
            style={{position:'absolute', top:'0px', right: '5px', height: '20px' }} 
          /> 
        </span> 
      { slippageMessage }
    </div>

    setFeeMessage(feeMessage)

  }

  const handleDeposit = async (
    daiValue,
    usdcValue,
    usdtValue,
    susdValue,
  ) => {

    // Should be abstracted to web3Utils / withWallet
    const addresses = [
      contracts.dai.address,
      contracts.usdc.address,
      contracts.usdt.address,
      contracts.susd.address,
    ]

    const amounts = [
      bnAmount(daiValue ? daiValue : 0, contracts.dai.decimals).toFixed(),
      bnAmount(usdcValue ? usdcValue : 0, contracts.usdc.decimals).toFixed(),
      bnAmount(usdtValue ? usdtValue : 0, contracts.usdt.decimals).toFixed(),
      bnAmount(susdValue ? susdValue : 0, contracts.susd.decimals).toFixed(),
    ]

    const sum = amounts.reduce(function(accu, val) { return accu.plus(val) }, new BigNumber(0))

    if (sum.isZero()) {
      setError("You can not deposit 0 value")
      setFeeMessage(null)
      return
    } else {
      setError('')
    }
    
    onDeposit(addresses, amounts)

  }

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    handleDeposit(daiInputValue, usdcInputValue, usdtInputValue, susdInputValue)
  }

  const inputStyles = makeStyles({
    // inputBase: { fontSize: '22px', height: '60px' },
    helperText: {
      color: 'red', 
      fontSize: '13px',
      marginLeft: '10px'
    }
  })()

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            <StyledWarning> This is an unaudited product, so please only use nonessential funds. The audit is currently under way. </StyledWarning>
            <TokenInput
              available={availableDai}
              error={!!error.length || !!daiError.length}
              icon={daiIcon}
              helperText={daiError}
              locked={allowances.dai.isZero()}
              onChange={e => handleInput(e, 'dai', setDaiInputValue)}
              onUnlock={e => onUnlock('dai')}
              styles={inputStyles}
              symbol="DAI"
              unlocking={unlocking.dai}
              value={daiInputValue}
            />
            <TokenInput
              available={availableUsdc}
              error={!!error.length || !!usdcError.length}
              icon={usdcIcon}
              helperText={usdcError}
              locked={allowances.usdc.isZero()}
              onChange={e =>  handleInput(e, 'usdc', setUsdcInputValue)}
              onUnlock={e => onUnlock('usdc')}
              unlocking={unlocking.usdc}
              styles={inputStyles}
              symbol="USDC"
              value={usdcInputValue}
            />
            <TokenInput
              available={availableUsdt}
              error={!!error.length || !!usdtError.length}
              icon={usdtIcon}
              helperText={usdtError}
              locked={allowances.usdt.isZero()}
              onChange={e => handleInput(e, 'usdt', setUsdtInputValue)}
              onUnlock={e => onUnlock('usdt')}
              unlocking={unlocking.usdt}
              styles={inputStyles}
              symbol="USDT"
              value={usdtInputValue}
            />
            <TokenInput
              available={availableSusd}
              error={!!error.length || !!susdError.length}
              icon={susdIcon}
              helperText={susdError}
              locked={allowances.susd.isZero()}
              onChange={e => handleInput(e, 'susd', setSusdInputValue)}
              onUnlock={e => onUnlock('susd')}
              unlocking={unlocking.susd}
              styles={inputStyles}
              symbol="SUSD"
              value={susdInputValue}
            />
          </StyledRows>
          <StyledFeeMessage> { feeMessage } </StyledFeeMessage>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Tooltip arrow={true} placement={'top'} title={toolTip} style={ error || !!daiError.length || !!usdcError.length || !!usdtError.length || !! susdError.length ? { cursor: 'no-drop'} : null } >
          <div>
            <Button disabled={ error || !!daiError.length || !!usdcError.length || !!usdtError.length || !! susdError.length } onClick={handleSubmit}> Deposit </Button>
          </div>
        </Tooltip>
      </ModalActions>
      <Snackbar 
        anchorOrigin={{vertical: 'center', horizontal: 'center'}} 
        autoHideDuration={6000} 
        onClose={handleErrorSnackbarClose}
        style={{'marginTop': '65px'}}
        open={error ? true : false} 
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
  available,
  error,
  icon,
  helperText,
  locked,
  onChange,
  onUnlock,
  styles,
  symbol,
  unlocking,
  value
}) => {


  
  return ( <>
    <StyledLabelBar>
      <span>Available: {available} {symbol}</span>
    </StyledLabelBar>
    <TextField fullWidth
      disabled={locked}
      error={error}
      FormHelperTextProps={{className: styles.helperText}}
      helperText={helperText}
      onChange={onChange}
      placeholder="0"
      type="number"
      value={value}
      onKeyDown={e => { if (e.keyCode === 189) e.preventDefault() }}
      InputProps={{
        min: "0",
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
              <img src={icon} alt="" />
            </TokenIcon>
          </StyledStartAdornment>
        )
      }}
    />
  </>)

}


export default StartModal