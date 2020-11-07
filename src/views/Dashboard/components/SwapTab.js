import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import BigNumber from 'bignumber.js'

import DashboardContext from '../context'

import ModalConfirm from '../../../components/ModalConfirm'
import ModalError from '../../../components/ModalError'
import ModalSuccess from '../../../components/ModalSuccess'
import ModalTx from '../../../components/ModalAwaitingTx'
import ModalUnlock from '../../../components/ModalUnlock'
import NumberFormat from 'react-number-format'

import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import SwapCallsIcon from '@material-ui/icons/SwapCalls';
import { makeStyles, withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'

import TokenIcon from '../../../components/TokenIcon'

const MAX = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
const DEFAULT_MSG = "Your price for this trade will be..."

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
  cursor: pointer;
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
  const [targetIx, setTargetIx] = useState(1 + engine.assets[0].derivatives.length)
  const [originValue, setOriginValue] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [shellIx, setShellIx] = useState(null)
  const [shellDerivativeIx, setShellDerivativeIx] = useState(null)
  const [swapType, setSwapType] = useState('origin')
  const [priceMessage, setPriceMessage] = useState(DEFAULT_MSG)
  const [haltMessage, setHaltMessage] = useState('')
  const [txHash, setTxHash] = useState('')
  
  const origin = engine.derivatives[originIx]
  const target = engine.derivatives[targetIx]

  const haltCheckMessage = 'amount triggers halt check'
  const insufficientBalanceMessage = 'amount is greater than your wallet\'s balance'

  const initiallyLocked = state.getIn(['assets', originIx, 'allowance', 'raw']) == 0
  const [unlocked, setUnlocked] = useState(false)

  const sanitizeNumber = (number, decimals) => {
    number = number.replace(/,/g,'')
    if (number.indexOf('.') != -1 && number.split('.')[1].length > decimals) {
      number = number.split('.')
      number[1] = number[1].substring(0, decimals)
      number = number.join('.')
    }
    return number
  }
  
  useEffect(() => {

    if ((swapType == 'origin' && originValue == '.') || (swapType == 'target' && targetValue == '.')) {
      
      setShellIx(null)
      setShellDerivativeIx(null)
      return 

    }

    if (swapType == 'origin' && ( originValue == '' || originValue.replace('.','') == 0 )) {

      setTargetValue('')
      setPriceMessage(DEFAULT_MSG)
      setHaltMessage('')
      setShellIx(null)
      setShellDerivativeIx(null)
      return

    }

    if (swapType == 'target' && ( targetValue == '' || targetValue.replace('.','') == 0 )) {

      setOriginValue('')
      setPriceMessage(DEFAULT_MSG)
      setHaltMessage('')
      setShellIx(null)
      setShellDerivativeIx(null)
      return

    }

    if (targetValue == '' && originValue == '') {

      setPriceMessage(DEFAULT_MSG)
      setHaltMessage('')
      setShellIx(null)
      setShellDerivativeIx(null)
      return

    }

    ;(async function () { 
      try {
        
        const method = swapType == 'origin' ? 'viewOriginSwap' : 'viewTargetSwap'

        const { 
          originAmount,
          targetAmount,
          shellIx,
          shellDerivativeIx
        } = await engine[method](
          origin, 
          target, 
          swapType == 'origin' ? originValue : targetValue
        )

        swapType == 'origin' 
          ? setTargetValue(targetAmount.display)
          : setOriginValue(originAmount.display)
          
        setPriceIndication(originAmount.numeraire, targetAmount.numeraire)
        setShellIx(shellIx)
        setShellDerivativeIx(shellDerivativeIx)

      } catch (e) {

        swapType == 'origin'
          ? setTargetValue('')
          : setOriginValue('')
        
        setHaltIndication()

      }
    })()

  }, [ originValue, targetValue, originIx, targetIx ])
  
  function setHaltIndication () {
    
    const errorStyles = { color: 'red', fontSize: '26px', fontWeight: 'bold' }

    setHaltMessage(<span style={errorStyles}> This amount triggers Shell's Safety Check </span>)

    setPriceMessage('')

  } 

  async function setPriceIndication (originAmount, targetAmount) {

    const tPrice = targetAmount.dividedBy(originAmount).toFixed(4)

    const oSymbol = engine.derivatives[originIx].symbol
    const tSymbol = engine.derivatives[targetIx].symbol

    let left = (oSymbol === 'cUSDC' || oSymbol === 'cDAI' || oSymbol === 'CHAI') 
      ? <span> <span> 1.00 </span> of { oSymbol } is worth </span>
      : <span> <span> 1.00 </span> { oSymbol } is worth </span>

    let right = (tSymbol === 'cUSDC' || tSymbol === 'cDAI' || tSymbol === 'CHAI')
      ? <span> <span> { tPrice } </span> of { tSymbol } for this trade </span>
      : <span> <span> { tPrice } </span> { tSymbol } for this trade </span>
      
    setPriceMessage(<span> {left} {right} </span>)
    setHaltMessage('')

  }

  const handleSwap = async (e) => {

    e.preventDefault()

    setStep('confirming')
    
    let method = swapType === 'origin' ? 'executeOriginSwap' : 'executeTargetSwap'
    
    let tx = engine[method](
      shellIx, 
      origin, 
      target, 
      sanitizeNumber(originValue, origin.decimals), 
      sanitizeNumber(targetValue, target.decimals)
    )

    tx.send({ from: state.get('account') })
      .once('transactionHash', handleTransactionHash)
      .once('confirmation', handleConfirmation)
      .on('error', handleError)
    
    let success = false

    function handleTransactionHash (hash) {
      
      setTxHash(hash)
      setStep('broadcasting')

    }

    function handleConfirmation (conf) {

      success = true
      
      swapType === 'origin' 
        ? setOriginValue('') 
        : setTargetValue('')

      setPriceMessage(DEFAULT_MSG)
      setStep('success')
      engine.sync()

    }

    function handleError (e) {
      
      if (!success) setStep('error')

    }

  }
  
  const handleUnlock = async (amount) => {

    setStep('confirming')

    const tx = origin.approve(
      engine.shells[shellIx].address,
      amount.toString()
    )

    tx.send({ from: state.get('account') })
      .once('transactionHash', onTxHash)
      .once('confirmation', onConfirmation)
      .on('error', onError)

    function onTxHash (hash) {
      setTxHash(hash)
      setStep('broadcasting')
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
  
  const handleOriginInput = e => {

    setSwapType('origin')
    setOriginValue(sanitizeNumber(e.target.value, origin.decimals))
    if (e.target.value == '') setTargetValue('')
    
  }
  
  const _handleOriginSelect = v => {
    
    const allowance = state.getIn(['assets', v, 'allowance', 'raw'])

    setUnlocked(allowance != 0)

    setOriginIx(v)

    if (v == targetIx) {

      setTargetIx(originIx)

    }

    const overlaps = engine.overlaps[engine.derivatives[v].symbol]

    if (overlaps.indexOf(target.symbol) == -1) {

      const find = asset => asset.symbol == overlaps[0]
      setTargetIx(engine.derivatives.findIndex(find))

    }

  }
  
  const handleTargetInput = e => {

    setSwapType('target')
    setTargetValue(sanitizeNumber(e.target.value, target.decimals))
    if (e.target.value == '') setOriginValue('')
    
  }
  
  const _handleTargetSelect = v => {
    
    setTargetIx(v)
    
  }

  const handleSwitch = () => {
    
    setOriginIx(targetIx)
    setTargetIx(originIx)
    
  }

  const selectionCss = makeStyles({
    root: { 'fontFamily': 'Geomanist', 'fontSize': '17.5px' }
  })()

  const selections = engine.derivatives.map( (asset, ix) => {

      return <MenuItem className={selectionCss.root} key={ix} value={ix} > { asset.symbol } </MenuItem>
      
  })

  const targetSelections = engine.derivatives.reduce( (a, c, i) => {

    if (engine.overlaps[c.symbol].indexOf(origin.symbol) != -1) {
      a.push( 
        <MenuItem className={selectionCss.root} key={i} value={i} > 
          { c.symbol } 
        </MenuItem>
      )
    }

    return a

  }, [])

  const getDropdown = (handler, selections,value) => {

    return ( <TextField select
      InputProps={{ className: selectionCss.root }}
      children={selections}
      onChange={e => handler(e.target.value)}
      value={value}
    /> )

  }

  const iconClasses = makeStyles({
      root: { position: 'absolute', right: '12.5px', top: '-25px' }
    }, { name: 'MuiIconButton' }
  )()

  let toolTipMsg = ''

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
  
  let allowance
  
  if (shellIx != null && shellDerivativeIx != null) {

    allowance = state.getIn([
      'shells', 
      shellIx,
      'derivatives',
      shellDerivativeIx, 
      'allowance', 
      'numeraire'
    ])
    
    if ( allowance.isGreaterThan(new BigNumber('100000000'))) {
      allowance = '100,000,000+'
    } else if ( allowance.isGreaterThan(new BigNumber(10000000))) {
      allowance = allowance.toExponential()
    } else {
      allowance = state.getIn([
        'shells', 
        shellIx, 
        'derivatives',
        shellDerivativeIx,
        'allowance', 
        'display'
      ])
    }

  }
    
  
  
  const unlockOrigin = () => setStep('unlocking')
    
  return (

    <StyledSwapTab>

      { step === 'unlocking' && <ModalUnlock 
          coin={state.getIn(['assets', originIx])} 
          handleUnlock={handleUnlock} 
          handleCancel={ () => setStep('none') } 
        /> }

      { step === 'confirming' && <ModalConfirm wallet={engine.wallet} /> }
    
      { step === 'broadcasting' && <ModalTx txHash={txHash} /> }

      { step === 'success' && <ModalSuccess 
          buttonBlurb={'Finish'} 
          txHash={txHash} 
          onDismiss={() => setStep('none')} 
          title={'Swap Successful.'}
        /> }

      { step === 'unlockSuccess' && <ModalSuccess 
        buttonBlurb={'Finish'} 
        onDismiss={() => setStep('none')} 
        title={'Unlocking Successful.'}
        /> }

      { step === 'error' && <ModalError 
        buttonBlurb={'Finish'} 
        onDismiss={() => setStep('none')} 
        title={'An error occurred.'} 
        /> }

      <StyledRows>
        <StyledMessage> { priceMessage || haltMessage } </StyledMessage>
        <AmountInput 
          allowance={allowance}
          icon={origin.icon}
          onChange={ handleOriginInput }
          selections={getDropdown(_handleOriginSelect, selections, originIx)}
          styles={inputStyles}
          symbol={origin.symbol}
          title='From'
          unlock={unlockOrigin}
          value={originValue}
        />
        <StyledSwapRow>
          <IconButton className={iconClasses.root} onClick={handleSwitch} >
            <SwapCallsIcon fontSize={'large'}/>
          </IconButton>
        </StyledSwapRow>
        <AmountInput 
          icon={target.icon}
          onChange={ handleTargetInput }
          selections={getDropdown(_handleTargetSelect, targetSelections, targetIx)}
          styles={inputStyles}
          symbol={target.symbol}
          title='To'
          value={targetValue}
        /> 
      </StyledRows>
      <StyledActions>
        <Button 
          disabled={( (targetValue == 0 || originValue == 0) || (initiallyLocked && !unlocked))}
          onClick={handleSwap}
          outlined={initiallyLocked && !unlocked}
        >
          Swap
        </Button> 
        <div style={{ width: 12 }} />
        { (initiallyLocked && !unlocked) ? <Button onClick={ () => setStep('unlocking') }> Unlock { origin.symbol } </Button> : null } 
      </StyledActions>
    </StyledSwapTab>
  )
}


const AmountInput = ({
  allowance,
  icon,
  error,
  helperText,
  onChange,
  styles,
  title,
  unlock,
  value,
  selections
}) => {
  
  return (
    <StyledInput>
      <StyledLabelBar>
        <StyledTitle> { title } </StyledTitle>
        { allowance ? <StyledAvailability onClick={unlock}> 
              Shell's allowance: {allowance + ' '}  
              <span style={{textDecoration: 'underline', color: '#8a8a8a'}}>click to change </span>
            </StyledAvailability> : null }
      </StyledLabelBar>
      <NumberFormat fullWidth
        allowNegative={false}
        customInput={TextField}
        error={error}
        FormHelperTextProps={{className: styles.helperText}}
        helperText={helperText}
        inputMode="numeric"
        min="0"
        onChange={onChange}
        placeholder="0"
        thousandSeparator={true}
        type="text"
        value={value}
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