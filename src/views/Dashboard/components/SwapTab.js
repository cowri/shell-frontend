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
  margin-bottom: 6.5px;
`)

const StyledInput = styled.div`
  margin-bottom: 24px;
`

const StyledSwapRow = styled.div`
  position: relative;
  height: 0px;
`

const StyledMessage = styled.div`
  font-size: 20px;
  padding: 30px;
`

const StyledRows = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
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
    state,
    engine
  } = useContext(DashboardContext)

  const [step, setStep] = useState('start')
  const [originIx, setOriginIx] = useState(0)
  const [targetIx, setTargetIx] = useState(1)
  const [originValue, setOriginValue] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [targetHelperText, setTargetHelperText] = useState('')
  const [swapType, setSwapType] = useState('origin')
  const [priceMessage, setPriceMessage] = useState('Your price for this trade will be...')
  const [haltMessage, setHaltMessage] = useState('')
  const [txHash, setTxHash] = useState('')

  const origin = engine.assets[originIx]
  const target = engine.assets[targetIx]

  const haltCheckMessage = 'amount triggers halt check'
  const insufficientBalanceMessage = 'amount is greater than your wallet\'s balance'

  const initiallyLocked = state.getIn(['assets', originIx, 'allowance']) == 0
  const [unlocked, setUnlocked] = useState(false)

  function setZeroes (value) {
    setOriginValue(value)
    setTargetValue(value)
    setPriceMessage('Your price for this trade will be...')
  }

  const primeSwap = async (swap, index) => {

    setIndexes(index)

    if (swap.value == 0) return setZeroes(swap.value)
    if (swap.type == 'origin') {
      if (!index.type) primeOrigin(originIx, targetIx, swap.value)
      if (index.type == 'origin') primeOrigin(index.value, targetIx, swap.value)
      if (index.type == 'target') primeOrigin(originIx, index.value, swap.value)
    }
    if (swap.type == 'target') {
      if (!index.type) primeTarget(originIx, targetIx, swap.value)
      if (index.type == 'origin') primeTarget(index.value, targetIx, swap.value)
      if (index.type == 'target') primeTarget(originIx, index.value, swap.value)
    }
    if (swap.type == 'switch') {
      if (swapType == 'origin') primeOrigin(targetIx, originIx, targetValue)
      if (swapType == 'target') primeTarget(targetIx, originIx, originValue)
    }

  }
  
  const setIndexes = (index) => {

    if (index.type === 'origin') setOriginIx(index.value)
    if (index.type === 'target') setTargetIx(index.value)
    if (index.type === 'switch') {
      setOriginIx(targetIx)
      setTargetIx(originIx)
    } 

  }

  const primeTarget = async (_originIx, _targetIx, amount) => { 
    
    setTargetValue(amount)
    setSwapType('target')
    
    console.log("origin ix", _originIx)
    console.log("target ix", _targetIx)
    console.log("amount", amount)

    try {

      const {
        originAmount,
        targetAmount
      } = await engine.viewTargetSwap(_originIx, _targetIx, amount)
      
      console.log("origin amount", originAmount)
      console.log("target amount", targetAmount)
      
      setOriginValue(originAmount.display)

      setPriceIndication(
        _originIx, 
        _targetIx, 
        originAmount.numeraire, 
        targetAmount.numeraire
      )
      
    } catch (e) {
      
      console.log("failed")
      
      setOriginValue('')
      setHaltIndication()

    }

  }

  const primeOrigin = async (_originIx, _targetIx, amount) => {

    setOriginValue(amount)
    setSwapType('origin')

    try{

      const { 
        originAmount,
        targetAmount
      } = await engine.viewOriginSwap(_originIx, _targetIx, amount)
      
      console.log("origin amount", originAmount)
      console.log("target amount", targetAmount)

      setTargetValue(targetAmount.display)

      setPriceIndication(
        _originIx, 
        _targetIx, 
        originAmount.numeraire, 
        targetAmount.numeraire
      )
    
    } catch (e) {

      setTargetValue('')
      setHaltIndication()

    }

  }
  
  function setHaltIndication () {
    
    const errorStyles = { color: 'red', fontSize: '26px', fontWeight: 'bold' }

    setHaltMessage(<span style={errorStyles}> This amount triggers Shell's Safety Check </span>)

    setPriceMessage('')

  } 

  async function setPriceIndication (_originIx, _targetIx, originAmount, targetAmount) {

    const tPrice = targetAmount.dividedBy(originAmount).toFixed(4)

    const oSymbol = engine.assets[_originIx].symbol
    const tSymbol = engine.assets[_targetIx].symbol

    let left = (oSymbol === 'cUSDC' || oSymbol === 'cDAI' || oSymbol === 'CHAI') 
      ? <span> $ <span> 1.00 </span> of { oSymbol } is worth </span>
      : <span> <span> 1.00 </span> { oSymbol } is worth </span>

    let right = (tSymbol === 'cUSDC' || tSymbol === 'cDAI' || tSymbol === 'CHAI')
      ? <span> $ <span> { tPrice } </span> of { tSymbol } for this trade </span>
      : <span> <span> { tPrice } </span> { tSymbol } for this trade </span>
      
    setPriceMessage(<span> {left} {right} </span>)
    setHaltMessage('')

  }

  const handleSwap = async (e) => {

    e.preventDefault()

    setStep('confirmingMetamask')

    let tx = swapType === 'origin'
      ? engine.executeOriginSwap(originIx, targetIx, originValue, targetValue)
      : engine.executeTargetSwap(originIx, targetIx, originValue, targetValue)

    tx.send({ from: state.get('account') })
      .once('transactionHash', handleTransactionHash)
      .once('confirmation', handleConfirmation)
      .on('error', handleError)

    function handleTransactionHash (hash) {

      setTxHash(hash)
      setStep('swapping')

    }

    function handleConfirmation () {

      setOriginValue('')
      setTargetValue('')
      setPriceMessage('Your price for this trade will be...')
      setStep('success')
      engine.sync()

    }

    function handleError () {

      setStep('error')

    }

  }

  const handleUnlock = async () => {

    setStep('confirmingMetamask')

    const tx = origin.methods.approve(engine.shell.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")

    tx.send({ from: state.get('account') })
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
      engine.sync()
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
        
      primeSwap(swapPayload, { type: 'origin', value: e.target.value })

    } else {
      
      primeSwap({type: 'switch'}, {type: 'switch'})

    }

  }

  const handleTargetSelect = e => {

    if (e.target.value !== originIx) {

      const swapPayload = swapType == 'origin'
        ? { type: 'origin', value: originValue }
        : { type: 'target', value: targetValue }
        
      primeSwap(swapPayload, { type: 'target', value: e.target.value })
      
    } else { 
      
      primeSwap({type: 'switch' }, {type: 'switch' })

    }
    
  }

  const selectionCss = makeStyles({
    root: { 'fontFamily': 'Geomanist', 'fontSize': '17.5px' }
  })()

  const selections = engine.assets.map( (asset, ix) => {

      return <MenuItem className={selectionCss.root} key={ix} value={ix} > { asset.symbol } </MenuItem>
      
  })

  const getDropdown = (handler, value) => {

    return ( <TextField select
      InputProps={{ className: selectionCss.root }}
      children={selections}
      onChange={e => handler(e)}
      value={value}
    /> )

  }

  const iconClasses = makeStyles({
      root: { position: 'absolute', right: '12.5px', top: '-25px' }
    }, { name: 'MuiIconButton' }
  )()

  let toolTipMsg = ''

  // if (originError){ 
  //   if (originError === haltCheckMessage) toolTipMsg = 'This amount triggers safety halts'
  //   else toolTipMsg = 'Your wallet has insufficient ' + origin.symbol 
  // } else if (targetError) {
  //   if (targetError === haltCheckMessage) toolTipMsg = 'This amount triggers safety halts'
  //   else toolTipMsg = 'Your wallet has insufficient ' + origin.symbol 
  // }

  if (initiallyLocked && !unlocked) {

    toolTipMsg = 'You must unlock ' + origin.symbol + ' to swap'

  }

  const inputStyles = makeStyles({
    inputBase: { fontSize: '20px', height: '60px' },
    helperText: {
      color: 'red', 
      fontSize: '16px',
      marginLeft: '25px'
    }
  })()
  
  return (

    <StyledSwapTab>
      { step === 'confirmingMetamask' && <ModalConfirmMetamask /> }
      { (step === 'swapping' || step === 'unlocking') && <ModalTx txHash={txHash} /> }
      { step === 'success' && <ModalSuccess buttonBlurb={'Finish'} txHash={txHash} onDismiss={() => setStep('none')} title={'Swap Successful.'}/> }
      { step === 'unlockSuccess' && <ModalSuccess buttonBlurb={'Finish'} onDismiss={() => setStep('none')} title={'Unlocking Successful.'}/> }
      { step === 'error' && <ModalError buttonBlurb={'Finish'} onDismiss={() => setStep('none')} title={'An error occurred.'} />}
      <StyledRows>
        <StyledMessage> { priceMessage || haltMessage } </StyledMessage>
        <AmountInput 
          available={state.get('assets').get(originIx).get('balance').get('display')}
          // error={}
          icon={origin.icon}
          // helperText={originHelperText}
          onChange={e => primeSwap({type:'origin', value: e.target.value}, {})}
          selections={getDropdown(handleOriginSelect, originIx)}
          styles={inputStyles}
          symbol={origin.symbol}
          title={'From'}
          value={originValue}
        />
        <StyledSwapRow>
          <IconButton className={iconClasses.root} 
            onClick={e=> primeSwap({type:'switch'}, {type:'switch'})}
          >
            <SwapCallsIcon fontSize={'large'}/>
          </IconButton>
        </StyledSwapRow>
        <AmountInput 
          // error={}
          icon={target.icon}
          // helperText={targetHelperText}
          onChange={e => primeSwap({type:'target', value: e.target.value}, {})}
          selections={getDropdown(handleTargetSelect, targetIx)}
          styles={inputStyles}
          symbol={target.symbol}
          title={'To'}
          value={targetValue}
        /> 
      </StyledRows>
      <StyledActions>
        <Button 
          // disabled={( (targetValue == 0 || originValue == 0) || targetError || originError || (initiallyLocked && !unlocked))}
          disabled={( (targetValue == 0 || originValue == 0) || (initiallyLocked && !unlocked))}
          onClick={handleSwap}
          outlined={initiallyLocked && !unlocked}
        >
          Swap
        </Button> 
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
            <div style={{ marginRight: 6, fontFamily: 'Geomanist' }}> 
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