import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { fromJS } from 'immutable'

import BigNumber from 'bignumber.js'

import DashboardContext from '../../context.js'

import ModalConfirm from '../../../../components/ModalConfirm'
import ModalError from '../../../../components/ModalError'
import ModalSuccess from '../../../../components/ModalSuccess'
import ModalTx from '../../../../components/ModalAwaitingTx'
import ModalUnlock from '../../../../components/ModalUnlock'
import NumberFormat from 'react-number-format'

import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, withTheme } from '@material-ui/core/styles'

import Button from '../../../../components/Button'

import TokenIcon from '../../../../components/TokenIcon'
import {SwapDirectionIcon} from './SwapDirectionIcon/SwapDirectionIcon.js';

const DEFAULT_MSG = "Your price for this trade will be..."
const MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

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
  max-width: 460px;
  margin: 0 auto;
  width: 90%;
`

const StyledTokenInfo = withTheme(styled.div`
`)

const StyledCoinHint = withTheme(styled.div`
  text-align: right;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`)

const StyledInput = styled.div`
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

const SwapTab = () => {

  const {
    state,
    engine
  } = useContext(DashboardContext)

  function getInitOriginIx() {
    const queryParams = new URLSearchParams(window.location.search);
    const ix = queryParams.get('token0');
    return ix || 0;
  }

  function getInitTargetIx() {
    const queryParams = new URLSearchParams(window.location.search);
    const ix = queryParams.get('token1');
    return ix || 1 + engine.assets[0].derivatives.length;
  }

  const [step, setStep] = useState('start')
  const [errorMessage, setErrorMessage] = useState('')
  const [originIx, setOriginIx] = useState(getInitOriginIx())
  const [targetIx, setTargetIx] = useState(getInitTargetIx())
  const [originValue, setOriginValue] = useState('1.00')
  const [targetValue, setTargetValue] = useState('')
  const [ixs, setIxs] = useState(fromJS({'shell': 0, 'derivative': 0}))
  const [swapType, setSwapType] = useState('origin')
  const [priceMessage, setPriceMessage] = useState(DEFAULT_MSG)
  const [haltMessage, setHaltMessage] = useState('')
  const [txHash, setTxHash] = useState('')


  const origin = engine.derivatives[originIx]
  const target = engine.derivatives[targetIx]

  const [unlocked, setUnlocked] = useState(
    !state.getIn(['shells', 0, 'derivatives', 0, 'allowance', 'numeraire'])?.isZero()
  )

  const sanitizeNumber = (number, decimals) => {
    number = number.replace(/,/g,'')
    if (number.indexOf('.') !== -1 && number.split('.')[1].length > decimals) {
      number = number.split('.')
      number[1] = number[1].substring(0, decimals)
      number = number.join('.')
    }
    return number
  }

  useEffect(() => {

    if ((swapType == 'origin' && originValue == '.') || (swapType == 'target' && targetValue == '.')) {

      setIxs(ixs.set('shell', null).set('derivative', null))
      return

    }

    if (swapType == 'origin' && ( originValue == '' || originValue.replace('.','') == 0 )) {

      setTargetValue('')
      setPriceMessage(DEFAULT_MSG)
      setHaltMessage('')
      return

    }

    if (swapType == 'target' && ( targetValue == '' || targetValue.replace('.','') == 0 )) {

      setOriginValue('')
      setPriceMessage(DEFAULT_MSG)
      setHaltMessage('')
      return

    }

    if (targetValue == '' && originValue == '') {

      setPriceMessage(DEFAULT_MSG)
      setHaltMessage('')
      return

    }


    ;(async function () {
      try {

        const method = swapType == 'origin' ? 'viewOriginSwap' : 'viewTargetSwap'

        const {
          originAmount,
          targetAmount,
          _shellIx,
          _shellDerivativeIx
        } = await engine[method](
          origin,
          target,
          swapType == 'origin' ? originValue : targetValue
        )

        swapType == 'origin'
          ? setTargetValue(targetAmount.display)
          : setOriginValue(originAmount.display)

        setIxs(ixs
          .set('shell', _shellIx)
          .set('derivative', _shellDerivativeIx))

        setPriceIndication(originAmount.numeraire, targetAmount.numeraire)
        setUnlocked(state.getIn([
          'shells',
          _shellIx,
          'derivatives',
          _shellDerivativeIx,
          'allowance',
          'numeraire'
        ]).isGreaterThanOrEqualTo(originAmount.numeraire))

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

    setHaltMessage(<span style={errorStyles}> This amount triggers pool's Safety Check </span>)

    setPriceMessage('')

  }

  async function setPriceIndication (originAmount, targetAmount) {

    const tPrice = targetAmount.dividedBy(originAmount).toFixed(4)

    const oSymbol = engine.derivatives[originIx].symbol
    const tSymbol = engine.derivatives[targetIx].symbol

    let left = (oSymbol === 'cUSDC' || oSymbol === 'cDAI' || oSymbol === 'CHAI')
      ? <span style={{fontSize: '24px'}}> <span> 1.00 </span> of { oSymbol } is worth </span>
      : <span style={{fontSize: '24px'}}> <span> 1.00 </span> { oSymbol } is worth </span>

    let right = (tSymbol === 'cUSDC' || tSymbol === 'cDAI' || tSymbol === 'CHAI')
      ? <span style={{fontSize: '24px'}}> <span> { Number(tPrice).toFixed(2) } </span> of { tSymbol } for this trade </span>
      : <span style={{fontSize: '24px'}}> <span> { Number(tPrice).toFixed(2) } </span> { tSymbol } for this trade </span>

    setPriceMessage(<span style={{fontWeight: 'bold'}}> {left} {right} </span>)
    setHaltMessage('')

  }

  const handleSwap = async (e) => {

    const noAllowance = state.getIn([
        'shells',
        ixs.get('shell'),
        'derivatives',
        ixs.get('derivative'),
        'allowance',
        'numeraire'
    ]).isLessThan(originValue)

    if (noAllowance) return setStep('unlocking')

    e.preventDefault()

    setStep('confirming')

    let method = swapType === 'origin' ? 'executeOriginSwap' : 'executeTargetSwap'

    let tx = engine[method](
      ixs.get('shell'),
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
      engine.shells[ixs.get('shell')].address,
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

    let success = false

    function onConfirmation () {
      success = true
      setStep('unlockSuccess')
      setUnlocked(true)
      engine.sync()
    }

    function onError () {

      if (!success) setStep('error')

    }

  }

  const handleOriginInput = e => {

    setSwapType('origin')
    setOriginValue(sanitizeNumber(e.target.value, origin.decimals))
    if (e.target.value == '') setTargetValue('')
    if (new BigNumber(e.target.value.replace(/,/g,'')).gt(balance)) {
      setErrorMessage('Amount is greater than your wallet\'s balance')
    } else {
      setErrorMessage('');
    }

  }

  const _handleOriginSelect = v => {

    setOriginIx(v)

    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('token0', v)
    window.history.replaceState(null, null, "?"+queryParams.toString());

    if (v == targetIx) {

      setTargetIx(originIx)

      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set('token1', originIx)
      window.history.replaceState(null, null, "?"+queryParams.toString());

    }

    const overlaps = engine.overlaps[engine.derivatives[v].symbol]

    if (overlaps.indexOf(target.symbol) == -1) {

      const find = asset => asset.symbol == overlaps[0]
      setTargetIx(engine.derivatives.findIndex(find))

      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set('token1', engine.derivatives.findIndex(find))
      window.history.replaceState(null, null, "?"+queryParams.toString());

    }

  }

  const handleTargetInput = e => {

    setSwapType('target')
    setTargetValue(sanitizeNumber(e.target.value, target.decimals))
    if (e.target.value == '') setOriginValue('')

  }

  const _handleTargetSelect = v => {

    setTargetIx(v)

    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('token1', v)
    window.history.replaceState(null, null, "?"+queryParams.toString());

  }

  const handleSwitch = () => {

    setOriginIx(targetIx)
    setTargetIx(originIx)

    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('token0', targetIx)
    queryParams.set('token1', originIx)
    window.history.replaceState(null, null, "?"+queryParams.toString());

  }

  const selectionCss = makeStyles({
    root: { 'fontFamily': 'Metric, Arial, sans-serif;', 'fontSize': '17.5px' }
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

  const getDropdown = (handler, selections, value) => {

    return ( <TextField select
      InputProps={{ className: selectionCss.root }}
      children={selections}
      onChange={e => handler(e.target.value)}
      value={value}
    /> )

  }

  let toolTipMsg = ''

  if (!unlocked) {

    toolTipMsg = 'You must unlock ' + origin.symbol + ' to swap'

  }

  const inputStyles = makeStyles({
    inputBase: { fontSize: '20px', height: '60px' },
    helperText: {
      color: 'red',
      fontSize: '13px',
      marginLeft: '10px',
      position: 'absolute',
      top: '100%',
    }
  })()

  let allowance
  let balance
  let asset

  if (ixs.get('shell') != null && ixs.get('derivative') != null) {
    asset = state.getIn([
      'shells',
      ixs.get('shell'),
      'derivatives',
      ixs.get('derivative')
    ])

    allowance = asset.getIn(['allowance'])
    balance = asset.getIn(['balance', 'numeraire']).toString()

    if ( allowance.get('numeraire').isGreaterThan(new BigNumber('100000000'))) {
      allowance = '100,000,000+'
    } else if ( allowance.get('numeraire').isGreaterThan(new BigNumber('10000000'))) {
      allowance = allowance.get('numeraire').toExponential()
    } else {
      allowance = allowance.get('display')
    }

  }

  return (
    <>

    <StyledSwapTab>

      { step === 'unlocking' && <ModalUnlock
          coin={state.getIn(['shells', ixs.get('shell'), 'derivatives', ixs.get('derivative') ])}
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
          balance={balance}
          icon={origin.icon}
          onChange={ handleOriginInput }
          selections={getDropdown(_handleOriginSelect, selections, originIx)}
          styles={inputStyles}
          symbol={origin.symbol}
          title='From'
          value={originValue}
          error={!!errorMessage}
          helperText={errorMessage}
        />
        <SwapDirectionIcon onClick={handleSwitch} />
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
    </StyledSwapTab>
      {asset && (+asset.getIn(['allowance']).get('numeraire').toString() > +originValue ?
          (<Button
            fullWidth
            disabled={!targetValue || !originValue || errorMessage}
            onClick={handleSwap}
            style={{ marginTop: '40px' }}
          >
            Execute
          </Button>)
          : (
            <Button onClick={() => handleUnlock(MAX)} fullWidth>
              Approve {origin.symbol}
            </Button>
          ))}
    <div style={{ width: 12 }} />
  </>
  )
}


const AmountInput = ({
  balance,
  icon,
  error,
  helperText,
  onChange,
  styles,
  value,
  selections
}) => {

  return (
    <StyledInput>
      <StyledTokenInfo>
        { balance ?
          <StyledCoinHint onClick={() => onChange({target: {value: balance}})}>
            Max:
            <span className="number">&nbsp;{ balance }</span>
          </StyledCoinHint> : null }
      </StyledTokenInfo>
      <NumberFormat
        fullWidth
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
          startAdornment: (
            <StyledStartAdornment>
              <TokenIcon > <img src={icon} alt="" /> </TokenIcon>
            </StyledStartAdornment>
          ),
          endAdornment: (
            <div style={{ marginRight: 6, fontFamily: 'Metric, Arial, sans-serif;' }}>
              { selections }
            </div>
          ),
        }}
      />
    </StyledInput>
  )
}

export default SwapTab
