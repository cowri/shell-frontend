import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import BigNumber from 'bignumber.js'

import { bnAmount, displayAmount } from '../../../utils/web3Utils'

import DashboardContext from '../context'

import ModalConfirmMetamask from '../../../components/ModalConfirmMetamask'
import ModalError from '../../../components/ModalError'
import ModalSuccess from '../../../components/ModalSuccess'
import ModalTx from '../../../components/ModalAwaitingTx'

import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import { makeStyles, withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'


import TokenIcon from '../../../components/TokenIcon'

const StyledStartAdornment = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding-left: 22px;
  padding-right: 12px;
`

const StyledSwapTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledLabelBar = withTheme(styled.div`
  align-items: flex-end;
  display: flex;
  height: 32px;
  align-content: baseline;
  margin-top: 24px;
`)

const StyledTitle = styled.div`
  margin-left: 24px;
  font-size: 24px;
  margin-bottom: 4px;
  align-items: center;
`
const StyledAvailability = withTheme(styled.div`
  color: ${props => props.theme.palette.grey[500]};
  margin-left: 8px;
  font-size: 16px;
  margin-bottom: 5px;
`)

const StyledInput = styled.div`
  margin-bottom: 24px;
`

const StyledSwapRow = styled.div`
  position: relative;
  height: 0px;
`

const StyledPriceMessage = styled.div`
font-size: 20px;
padding: 10px;
  height: 0px;
`

const StyledRows = styled.div`
  margin-bottom: 48px;
  margin-top: 24px;
  text-align: center;
`

const StyledWarning = styled.div`
  color: red;
  font-size: 18px;
  width: 80%;
  margin: 20px auto 10px;
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

const SwapTab = () => {

  const {
    account,
    allowances,
    contracts,
    updateAllState,
    updateAllowances,
    updateBalances,
    updateWalletBalances,
    walletBalances,
    state,
    engine
  } = useContext(DashboardContext)

  const shell = contracts.shell

  const [step, setStep] = useState('start')
  const [originIx, setOriginIx] = useState(0)
  const [targetIx, setTargetIx] = useState(3)
  const [originValue, setOriginValue] = useState('0')
  const [targetValue, setTargetValue] = useState('0')
  const [originError, setOriginError] = useState(false)
  const [targetError, setTargetError] = useState(false)
  const [isZero, setIsZero ] = useState(true)
  const [originHelperText, setOriginHelperText] = useState('')
  const [targetHelperText, setTargetHelperText] = useState('')
  const [swapType, setSwapType] = useState('origin')
  const [slippage, setSlippage] = useState(0)
  const [priceMessage, setPriceMessage] = useState('')
  const [txHash, setTxHash] = useState('')

  const origin = engine.assets[originIx]
  const target = engine.assets[targetIx]

  const haltCheckMessage = 'amount triggers halt check'
  const insufficientBalanceMessage = 'amount is greater than your wallet\'s balance'

  const initiallyLocked = allowances[origin.symbol.toLowerCase()] === 0
  const [unlocked, setUnlocked] = useState(false)

  function setZeroes (value) {
    console.log("set zeroes")
    setOriginValue(value)
    setTargetValue(value)
    setPriceMessage('')
  }

  const primeSwapNew = async (swap, index) => {

    setSlots(index)

    console.log("swap", swap)
    console.log("index", index)


    if (swap.value == 0) return setZeroes(swap.value)
    if (swap.type == 'origin') {
      if (!index.type) primeOrigin(originIx, targetIx, swap.value)
      if (index.type == 'origin') primeOrigin(index.value, targetIx, swap.value)
      if (index.type == 'target') {
        console.log("type is target", index.value)
        primeOrigin(originIx, index.value, swap.value)
      }
    }
    if (swap.type == 'target') {
      if (!index.type) primeOrigin(originIx, targetIx, swap.value)
      if (index.type == 'origin') primeTarget(index.value, targetIx, swap.value)
      if (index.type == 'target') primeTarget(originIx, index.value, swap.value)
    }
    if (swap.type == 'switch') {
      if (swapType == 'origin') primeOrigin(targetIx, originIx, targetValue)
      if (swapType == 'target') primeTarget(targetIx, originIx, originValue)
    }

  }
  
  const setSlots = (indexPayload) => {

    if (indexPayload.type === 'origin') setOriginIx(indexPayload.value)
    if (indexPayload.type === 'target') setTargetIx(indexPayload.value)
    if (indexPayload.type === 'switch') {
      setOriginIx(targetIx)
      setTargetIx(originIx)
    } 

  }

  const primeTarget = async (_originIx, _targetIx, amount) => { 
    
    setTargetValue(amount)
    setSwapType('target')

    const {
      originAmount,
      targetAmount
    } = await engine.viewTargetSwap(_originIx, _targetIx, targetValue)

    setOriginValue(originAmount.display)

    // console.log("originAmount.display", originAmount.numeraire.toString())
    // console.log("targetAmount.display", targetAmount.numeraire.toString())
    setPriceIndication(
      _originIx, 
      _targetIx, 
      originAmount.numeraire, 
      targetAmount.numeraire
    )

  }

  const primeOrigin = async (_originIx, _targetIx, amount) => {

    setOriginValue(amount)
    setSwapType('origin')

    console.log("originIx", _originIx)
    console.log("targetIx", _targetIx)

    const { 
      originAmount,
      targetAmount
    } = await engine.viewOriginSwap(_originIx, _targetIx, amount)

    // console.log("originAmount.display", originAmount.numeraire.toString())
    // console.log("targetAmount.display", targetAmount.numeraire.toString())

    setTargetValue(targetAmount.display)

    setPriceIndication(
      _originIx, 
      _targetIx, 
      originAmount.numeraire, 
      targetAmount.numeraire
    )

  }

  async function setPriceIndication (_originIx, _targetIx, originAmount, targetAmount) {

    const tPrice = targetAmount.dividedBy(originAmount).toFixed(4)

    const oSymbol = engine.assets[_originIx].symbol
    const tSymbol = engine.assets[_targetIx].symbol

    let message = (oSymbol === 'cUSDC' || oSymbol === 'cDAI' || oSymbol === 'CHAI') 
      ? '$1.00 of ' + oSymbol + ' is worth '
      : '1.0000 ' + oSymbol + ' is worth '

    message += (tSymbol === 'cUSDC' || tSymbol === 'cDAI' || tSymbol === 'CHAI')
      ? '$' + tPrice + ' of ' + tSymbol + ' for this trade'
      : tPrice + ' ' + tSymbol + ' for this trade'
      
    setPriceMessage(message)

  }

  const handleSwap = async (e) => {

    e.preventDefault()

    setStep('confirmingMetamask')

    console.log("origin ix", originIx)
    console.log("target ix", targetIx)

    let tx = swapType === 'origin'
      ? engine.executeOriginSwap(originIx, targetIx, originValue)
      : engine.executeTargetSwap(originIx, targetIx, targetValue)

    tx.send({ from: state.get('account') })
      .once('transactionHash', handleTransactionHash)
      .once('confirmation', handleConfirmation)
      .on('error', handleError)

    function handleTransactionHash (hash) {

      setTxHash(hash)
      setStep('swapping')

    }

    function handleConfirmation () {

      setOriginValue('0')
      setTargetValue('0')
      setPriceMessage('')
      setStep('success')

    }

    function handleError () {

      setStep('error')

    }

  }

  const handleUnlock = async () => {

    setStep('confirmingMetamask')

    const tx = origin.methods.approve(shell.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")

    tx.send({ from: account })
      .once('transactionHash', onTxHash)
      .once('confirmation', onConfirmation)
      .on('error', onError)

    function onTxHash (hash) {
      setTxHash(hash)
      setStep('unlocking')
    }

    function onConfirmation () {
      setStep('unlockSuccess')
      setUnlocked(true)
      updateAllowances()
    }

    function onError () {
      setStep('error')
    }

  }

  const handleOriginSelect = e => {

    if (e.target.value !== targetIx) {

      const swapPayload = swapType == 'origin'
        ? { type: 'origin', value: originValue }
        : { type: 'target', value: targetValue }
        
      primeSwapNew(swapPayload, { type: 'origin', value: e.target.value })

    } else {
      
      primeSwapNew({type: 'switch'}, {type: 'switch'})

    }

  }

  const handleTargetSelect = e => {

    if (e.target.value !== originIx) {

      const swapPayload = swapType == 'origin'
        ? { type: 'origin', value: originValue }
        : { type: 'target', value: targetValue }
        
      primeSwapNew(swapPayload, { type: 'target', value: e.target.value })
      
    } else { 
      
      primeSwapNew({type: 'switch' }, {type: 'switch' })

    }
    
  }

  const selectionCss = makeStyles({
    root: { 'fontSize': '22px' }
  })()

  const selections = engine.assets.map( (asset, ix) => {

      return <MenuItem className={selectionCss.root} key={ix} value={ix} > { asset.symbol } </MenuItem>
      
  })

  const getDropdown = (handler, value) => {

    return ( <TextField select
      children={selections}
      onChange={e => handler(e)}
      value={value}
    /> )

  }

  const iconClasses = makeStyles({
      root: { position: 'absolute', right: '12.5px', top: '-25px' }
  }, { name: 'MuiIconButton' })()

  let toolTipMsg = ''

  if (originError){ 

    if (originError === haltCheckMessage) toolTipMsg = 'This amount triggers safety halts'

    else toolTipMsg = 'Your wallet has insufficient ' + origin.symbol 

  } else if (targetError) {

    if (targetError === haltCheckMessage) toolTipMsg = 'This amount triggers safety halts'

    else toolTipMsg = 'Your wallet has insufficient ' + origin.symbol 

  }

  if (initiallyLocked && !unlocked) {

    toolTipMsg = 'You must unlock ' + origin.symbol + ' to swap'

  }

  const inputStyles = makeStyles({
    inputBase: { fontSize: '22px', height: '60px' },
    helperText: {
      color: 'red', 
      fontSize: '16px',
      marginLeft: '25px'
    }
  })()
  
  // console.log("is zero", isZero)
  // console.log("target error", targetError)
  // console.log("origin error", originError)
  // console.log("initially locked", initiallyLocked)
  // console.log("unlocked", unlocked)
  // console.log("acount", account)
  // console.log("state.account", state.get('account'))

  // console.log("originIx", originIx)
  // console.log("targetIx", targetIx)
  // console.log("swap type", swapType)

  return (

    <StyledSwapTab>
      { step === 'confirmingMetamask' && <ModalConfirmMetamask /> }
      { (step === 'swapping' || step === 'unlocking') && <ModalTx txHash={txHash} /> }
      { step === 'success' && <ModalSuccess buttonBlurb={'Finish'} txHash={txHash} onDismiss={() => setStep('none')} title={'Swap Successful.'}/> }
      { step === 'unlockSuccess' && <ModalSuccess buttonBlurb={'Finish'} onDismiss={() => setStep('none')} title={'Unlocking Successful.'}/> }
      { step === 'error' && <ModalError buttonBlurb={'Finish'} onDismiss={() => setStep('none')} title={'An error occurred.'} />}
      <StyledRows>
        <StyledWarning> This is an unaudited product, so please only use nonessential funds. The audit is currently under way. </StyledWarning>
        <AmountInput 
          available={state.get('assets').get(originIx).get('balance').get('display')}
          error={originError}
          icon={origin.icon}
          helperText={originHelperText}
          onChange={e => primeSwapNew({type:'origin', value: e.target.value}, {})}
          selections={getDropdown(handleOriginSelect, originIx)}
          styles={inputStyles}
          symbol={origin.symbol}
          title={'From'}
          value={originValue}
        />
        <StyledSwapRow>
          <IconButton 
            className={iconClasses.root} 
            onClick={e=> primeSwapNew({type:'switch'}, {type:'switch'})}
          >
            <SwapCallsIcon fontSize={'large'}/>
          </IconButton>
        </StyledSwapRow>
        <AmountInput 
          error={targetError}
          icon={target.icon}
          helperText={targetHelperText}
          onChange={e => primeSwapNew({type:'target', value: e.target.value}, {})}
          selections={getDropdown(handleTargetSelect, targetIx)}
          styles={inputStyles}
          symbol={target.symbol}
          title={'To'}
          value={targetValue}
        /> 
        <StyledPriceMessage> { priceMessage } </StyledPriceMessage>
        <>
          { slippage === 0 ? '' : slippage < 0 ? 'slippage: ' + slippage : 'anti-slippage:' + slippage }
        </>
      </StyledRows>
      <StyledActions>
        <Tooltip arrow={true} placement={'top'} title={toolTipMsg} style={targetError || originError || (initiallyLocked && !unlocked) ? { cursor: 'no-drop'} : null } >
          <div>
            <Button 
              disabled={( (targetValue == 0 || originValue == 0) || targetError || originError || (initiallyLocked && !unlocked))}
              onClick={handleSwap}
              outlined={initiallyLocked && !unlocked}
            >
              Swap
            </Button> 
          </div>
        </Tooltip>
        <div style={{ width: 12 }} />
        { (initiallyLocked && !unlocked) ? <Button onClick={handleUnlock}> Unlock { origin.symbol } </Button> : null } 
      </StyledActions>
    </StyledSwapTab>
  )
}


const AmountInput = ({
  available,
  icon,
  error,
  helperText,
  onChange,
  styles,
  symbol,
  title,
  value,
  selections
}) => {

  return (
    <StyledInput>
      <StyledLabelBar>
        <StyledTitle> { title } </StyledTitle>
        { available ? <StyledAvailability> Available: {available} {symbol} </StyledAvailability> : null }
      </StyledLabelBar>
      <TextField fullWidth
        error={error}
        FormHelperTextProps={{className: styles.helperText}}
        helperText={helperText}
        min="0"
        onChange={onChange}
        onKeyDown={e => { if (e.keyCode === 189) e.preventDefault() }}
        placeholder="0"
        value={value}
        type="number"
        InputProps={{
          className: styles.inputBase,
          endAdornment: ( 
            <div style={{ marginRight: 6 }}> 
              { selections } 
            </div>
          ),
          startAdornment: (
            <StyledStartAdornment>
              <TokenIcon > <img src={icon} alt="" /> </TokenIcon>
            </StyledStartAdornment>
          )
        }}
      />
    </StyledInput>
  )
}

export default SwapTab