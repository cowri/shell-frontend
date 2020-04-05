import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'

import BigNumber from 'bignumber.js'

import { bnAmount, displayAmount } from '../../../utils/web3Utils'

import DashboardContext from '../context'

import ModalConfirmMetamask from '../../../components/ModalConfirmMetamask'
import ModalError from '../../../components/ModalError'
import ModalSuccess from '../../../components/ModalSuccess'
import SwappingModal from '../../../components/ModalAwaitingTx'

import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'
import LabelledValue from '../../../components/LabelledValue'

import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import daiIcon from '../../../assets/dai.svg'
import cdaiIcon from '../../../assets/cdai.svg'
import chaiIcon from '../../../assets/chai.png'

import susdIcon from '../../../assets/susd.svg'
import asusdIcon from '../../../assets/aSUSD.svg'

import usdcIcon from '../../../assets/usdc.svg'
import cusdcIcon from '../../../assets/cusdc.svg'

import usdtIcon from '../../../assets/usdt.svg'
import ausdtIcon from '../../../assets/aUSDT.svg'

const StyledStartAdornment = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding-left: 22px;
  padding-right: 12px;
`
const StyledEndAdornment = styled.div`
  padding-left: 6px;
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
  // justify-content: flex-end;
  align-content: baseline;
  margin-top: 24px;
`)

const StyledTitle = styled.div`
  margin-left: 24px;
  font-size: 36px;
  align-items: center;
  // height: 32px;
  // margin-top:24px;
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

const StyledRows = styled.div`
  margin-bottom: 24px;
  margin-top: 24px;
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
    onUpdateAllowances,
    onUpdateBalances,
    onUpdateWalletBalances,
    walletBalances,
    web3
  } = useContext(DashboardContext)

  const erc20s = contracts.erc20s
  const loihi = contracts.loihi

  const [step, setStep] = useState('start')
  const [originSlot, setOriginSlot] = useState(0)
  const [targetSlot, setTargetSlot] = useState(3)
  const [originValue, setOriginValue] = useState('0')
  const [targetValue, setTargetValue] = useState('0')
  const [originError, setOriginError] = useState(false)
  const [targetError, setTargetError] = useState(false)
  const [originHelperText, setOriginHelperText] = useState('')
  const [targetHelperText, setTargetHelperText] = useState('')
  const [swapType, setSwapType] = useState('origin')
  const [slippage, setSlippage] = useState(0)

  const origin = erc20s[originSlot]
  const target = erc20s[targetSlot]
  const originAvailable = walletBalances[origin.symbol.toLowerCase()]
    ? displayAmount(walletBalances[origin.symbol.toLowerCase()], origin.decimals, 4) : 0
  const targetAvailable = walletBalances[target.symbol.toLowerCase()]
    ? displayAmount(walletBalances[target.symbol.toLowerCase()], target.decimals, 4) : 0

  const originLocked = allowances[origin.symbol.toLowerCase()] == 0
  const targetLocked = allowances[target.symbol.toLowerCase()] == 0
  const [originUnlocking, setOriginUnlocking] = useState(false)
  const [targetUnlocking, setTargetUnlocking] = useState(false)

  const primeSwap = async (swapPayload, slotPayload) => {

    let origin
    let target

    if (slotPayload.type == 'origin'){
      origin = erc20s[slotPayload.value]
      target = erc20s[targetSlot]
      setOriginSlot(slotPayload.value)
    } else if (slotPayload.type == 'target'){
      origin = erc20s[originSlot]
      target = erc20s[slotPayload.value]
      setTargetSlot(slotPayload.value)
    } else {
      origin = erc20s[originSlot]
      target = erc20s[targetSlot]
    }

    const val = swapPayload.value !== '' 
      ? String(+swapPayload.value.replace(/[A-Za-z!@#$%^&*()?<∞>;:-=,._+\\|`~/]/g, ''))
      : '0'
    
    if (val == '0') {
      setSlippage(0)
      setOriginValue('0')
      setTargetValue('0')
      return
    }

    let theseChickens = swapPayload.type == 'origin'
      ? bnAmount(val, origin.decimals)
      : bnAmount(val, target.decimals)

    if (swapPayload.type == 'origin') setOriginValue(displayAmount(theseChickens, origin.decimals))
    else setTargetValue(displayAmount(theseChickens, target.decimals))

    let thoseChickens
    if (swapPayload.type === 'origin') {

      thoseChickens = new BigNumber(await loihi.methods.viewOriginTrade(
        origin.options.address,
        target.options.address,
        theseChickens.toFixed()
      ).call())
      
    } else {

      thoseChickens = new BigNumber(await loihi.methods.viewTargetTrade(
        origin.options.address,
        target.options.address,
        theseChickens.toFixed()
      ).call())


    }

    setSwapType(swapPayload.type)

    const reverted = '3.963877391197344453575983046348115674221700746820753546331534351508065746944e+75'
    const availableOrigin = walletBalances[origin.symbol.toLowerCase()]


    if (swapPayload.type == 'origin') {

      setTargetHelperText('')
      setTargetError(false)

      if (thoseChickens.comparedTo(reverted) == 0) {
        setSlippage('∞')
        setOriginError(true)
        setOriginHelperText('Amount triggers halt check')
        setTargetValue('∞')
        return
      } 

      setSlippage(await getSlippage(theseChickens, thoseChickens))
      
      if (theseChickens.isGreaterThan(availableOrigin)) {
        setOriginError(true)
        setOriginHelperText("This amount is greater than your wallet's balance.")
        setTargetValue(target.getDisplay(thoseChickens))
      } else {
        setOriginError(false)
        setOriginHelperText('')
        setTargetValue(target.getDisplay(thoseChickens))
      }

    } else if (swapPayload.type == 'target') {

      setOriginHelperText('')
      setOriginError(false)

      if (thoseChickens.comparedTo(reverted) == 0) {
        setSlippage('∞')
        setOriginValue('∞')
        setTargetError(true)
        setTargetHelperText('Amount triggers halt check')
        return 
      }

      setSlippage(await getSlippage(theseChickens, thoseChickens))
      
      if (thoseChickens.isGreaterThan(availableOrigin)) {
        setOriginValue(origin.getDisplay(thoseChickens))
        setTargetHelperText("Origin amount is greater than your wallet's balance.")
        setTargetError(true)
      } else {
        setOriginValue(origin.getDisplay(thoseChickens))
        setTargetHelperText('')
        setTargetError(false)
      }

    }

    async function getSlippage (theseChickens, thoseChickens) {

      const theseRoosters = new BigNumber(swapPayload.type === 'origin'
        ? await origin.adapter.methods.viewNumeraireAmount(theseChickens.toFixed()).call()
        : await origin.adapter.methods.viewNumeraireAmount(thoseChickens.toFixed()).call()
      )

      const thoseRoosters = new BigNumber(swapPayload.type === 'origin'
        ? await target.adapter.methods.viewNumeraireAmount(thoseChickens.toFixed()).call()
        : await target.adapter.methods.viewNumeraireAmount(theseChickens.toFixed()).call()
      )

      const one = new BigNumber(1)
      const proportion = theseRoosters.dividedBy(thoseRoosters)
      return one.minus(proportion).multipliedBy(new BigNumber(100)).toFixed(4)

    }


  }

  const handleSwap = async (e) => {
    e.preventDefault()
    setStep('confirmingMetamask')

    let originInput, targetInput
    if (swapType == 'origin') {
      originInput = originValue
      targetInput = Math.floor(targetValue * .99)
    } else {
      originInput = Math.floor(originValue * 1.01)
      targetInput = targetValue
    }

    const tx = loihi.methods[swapType == 'origin' ? 'swapByOrigin' : 'swapByTarget'](
      origin.options.address,
      target.options.address,
      bnAmount(originInput, origin.decimals).toFixed(),
      bnAmount(targetInput, target.decimals).toFixed(),
      Math.floor((Date.now()/1000) + 900)
    )

    const gas = await tx.estimateGas({from: account })
    const gasPrice = await web3.eth.getGasPrice()

    tx.send({ from: account, gas: Math.floor(gas * 1.1), gasPrice})
      .once('transactionHash', () =>  setStep('swapping'))
      .once('confirmation', handleConfirmation)
      .on('error', handleError)

    function handleConfirmation () {
      setOriginValue('0')
      setTargetValue('0')
      setOriginSlot(0)
      setTargetSlot(3)
      setStep('success')
    }

    function handleError () {
      onUpdateBalances()
      onUpdateWalletBalances()
      setOriginValue('0')
      setTargetValue('0')
      setOriginSlot(0)
      setTargetSlot(3)
      setStep('error')
    }

  }

  const handleUnlock = async (contract, setUnlocking) => {
    setStep('confirmingMetamask')
    // Should be abstracted to web3Utils / withWallet
    const tx = contract.methods.approve(loihi.options.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935")
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
      .once('transactionHash', onTxHash)
      .once('confirmation', onConfirmation)
      .on('error', onError)

    function onTxHash () {
      setStep('unlocking')
      setUnlocking(true)
    }

    function onConfirmation () {
      setStep('unlockSuccess')
      setUnlocking(false)
      onUpdateAllowances()
    }

    function onError () {
      setStep('error')
      setUnlocking(false)
    }

  }

  const handleOriginUnlock = async (e) => {
    e.preventDefault()
    handleUnlock(origin, setOriginUnlocking)
  }

  const handleTargetUnlock = e => {
    e.preventDefault()
    handleUnlock(target, setTargetUnlocking)
  }


  const handleOriginSelect = e => {
    e.preventDefault()
    if (e.target.value != targetSlot) {
      const swapPayload = { type: swapType, value: swapType == 'origin' ? originValue : targetValue }
      const slotPayload = { type: 'origin', value: e.target.value }
      primeSwap(swapPayload, slotPayload)
    }
  }

  const handleTargetSelect = e => {
    e.preventDefault()
    if (e.target.value != originSlot) {
      const swapPayload = { type: swapType, value: swapType == 'origin' ? originValue : targetValue }
      const slotPayload = { type: 'target', value: e.target.value }
      primeSwap(swapPayload, slotPayload)
    }
  }

  const handleOriginInput = e => {
    e.preventDefault()
    const swapPayload = { value: e.target.value, type: 'origin' }
    primeSwap(swapPayload, {})
  }

  const handleTargetInput = e => {
    e.preventDefault()
    const swapPayload = { value: e.target.value, type: 'target' }
    primeSwap(swapPayload, {})
  }

  const selections = [
      <MenuItem ref={useRef()} key={0} value={0} > { erc20s[0].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={1} value={1} > { erc20s[1].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={2} value={2} > { erc20s[2].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={3} value={3} > { erc20s[3].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={4} value={4} > { erc20s[4].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={5} value={5} > { erc20s[5].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={6} value={6} > { erc20s[6].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={7} value={7} > { erc20s[7].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={8} value={8} > { erc20s[8].symbol } </MenuItem>
  ]

  const getDropdown = (handler, value) => {
    return ( <TextField select
      children={ selections }
      onChange={e => handler(e)}
      value={value}
    /> )
  }

  return (
    <StyledSwapTab>
      { step == 'confirmingMetamask' && <ModalConfirmMetamask /> }
      { (step == 'swapping' || step == 'unlocking') && <SwappingModal/> }
      { step == 'success' && <ModalSuccess buttonBlurb={'Finish'} onDismiss={() => setStep('none')} title={'Swap Successful.'}/> }
      { step == 'unlockSuccess' && <ModalSuccess buttonBlurb={'Finish'} onDismiss={() => setStep('none')} title={'Unlocking Successful.'}/> }
      { step == 'error' && <ModalError buttonBlurb={'Finish'} onDismiss={() => setStep('none')} title={'An error occurred.'} />}
      <StyledRows>
        <AmountInput 
          available={originAvailable}
          error={originError}
          icon={origin.icon}
          helperText={originHelperText}
          locked={originLocked}
          onChange={e => handleOriginInput(e)}
          onUnlock={e => handleOriginUnlock(e)}
          selections={getDropdown(handleOriginSelect, originSlot)}
          symbol={origin.symbol}
          title={'From'}
          unlocking={originUnlocking}
          value={originValue}
        />
        <AmountInput 
          available={targetAvailable}
          error={targetError}
          icon={target.icon}
          helperText={targetHelperText}
          locked={targetLocked}
          onChange={e => handleTargetInput(e)}
          onUnlock={e => handleTargetUnlock(e)}
          selections={getDropdown(handleTargetSelect, targetSlot)}
          symbol={target.symbol}
          title={'To'}
          unlocking={targetUnlocking}
          value={targetValue}
        /> 
        <>
          { slippage == 0 ? '' : slippage < 0 ? 'slippage: ' + slippage : 'anti-slippage:' + slippage }
        </>
      </StyledRows>
      <StyledActions>
        <Button onClick={handleSwap}>Swap</Button>
      </StyledActions>
    </StyledSwapTab>
  )
}

const AmountInputStyles = makeStyles({ root: { color: 'pink', fontSize: '30px' } })

const AmountInput = ({
  available,
  icon,
  error,
  helperText,
  locked,
  onChange,
  onUnlock,
  symbol,
  title,
  unlocking,
  value,
  selections
}) => {
  const classes = AmountInputStyles()

  return (
    <StyledInput>
      <StyledLabelBar>
        <StyledTitle> { title } </StyledTitle>
        <StyledAvailability>Available: {available} {symbol}</StyledAvailability>
      </StyledLabelBar>
      <TextField fullWidth
        error={error}
        FormHelperTextProps={{className: classes.root}}
        helperText={helperText}
        onChange={onChange}
        placeholder="0"
        value={value}
        InputProps={{
          endAdornment: (
            <div style={{ marginRight: 6 }}>
              { selections }
              { locked ? (
                <Button outlined small
                  disabled={unlocking}
                  onClick={onUnlock}
                >
                  {unlocking ? (
                    <>
                      <CircularProgress size={18} />
                      <span style={{ marginLeft: 6 }}>Unlocking</span>
                    </>
                  ) : 'Unlock'}
                </Button>
              ) : null }
            </div>
          ),
          startAdornment: (
            <StyledStartAdornment>
              <TokenIcon >
                <img src={icon} />
              </TokenIcon>
            </StyledStartAdornment>
          )
        }}
      />
    </StyledInput>
  )
}

export default SwapTab