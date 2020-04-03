import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import BigNumber from 'bignumber.js'

import { bnAmount, getAllowances } from '../../../utils/web3Utils'

import ModalConfirmMetamask from '../../../components/ModalConfirmMetamask'
import SwappingModal from '../../Deposit/components/DepositingModal'
import ErrorModal from '../../Deposit/components/ErrorModal'
import SuccessModal from '../../Deposit/components/SuccessModal'

import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem';
import { withTheme } from '@material-ui/core/styles'

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
`

const StyledEndAdornment = styled.div`
  padding-left: 6px;
  padding-right: 12px;
`
const StyledSwapTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;
`
const StyledLabelBar = withTheme(styled.div`
  align-items: center;
  color: ${props => props.theme.palette.grey[500]};
  display: flex;
  height: 32px;
  justify-content: space-between;
  margin-top: 24px;
`)

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`
const StyledRows = styled.div`
  margin-bottom: 24px;
  margin-top: -24px;
`
const SwapTab = ({
  account,
  contracts,
  loihi,
  allowances,
  web3
}) => {

  console.log("Account", account)

  const [step, setStep] = useState('start')
  const [originSlot, setOriginSlot] = useState(0)
  const [targetSlot, setTargetSlot] = useState(3)
  const [originValue, setOriginValue] = useState(0)
  const [targetValue, setTargetValue] = useState(0)
  const [swapType, setSwapType] = useState('origin')

  const origin = contracts[originSlot]
  const target = contracts[targetSlot]

  const originLocked = allowances[origin.symbol.toLowerCase()] == 0
  const targetLocked = allowances[target.symbol.toLowerCase()] == 0
  const [originUnlocking, setOriginUnlocking] = useState(false)
  const [targetUnlocking, setTargetUnlocking] = useState(false)

  const primeSwap = async (swapPayload, slotPayload) => {

    let origin
    let target

    if (slotPayload.type == 'origin'){
      origin = contracts[slotPayload.value]
      target = contracts[targetSlot]
      setOriginSlot(slotPayload.value)
    } else if (slotPayload.type == 'target'){
      origin = contracts[originSlot]
      target = contracts[slotPayload.value]
      setTargetSlot(slotPayload.value)
    } else {
      origin = contracts[originSlot]
      target = contracts[targetSlot]
    }

    let thoseChickens
    const theseChickens = Number(swapPayload.value)
    if (swapPayload.type === 'origin') {

      thoseChickens = new BigNumber(await loihi.methods.viewOriginTrade(
        origin.options.address,
        target.options.address,
        bnAmount(theseChickens ? theseChickens : 0, origin.decimals).toString()
      ).call())

    } else {

      thoseChickens = new BigNumber(await loihi.methods.viewTargetTrade(
        origin.options.address,
        target.options.address,
        bnAmount(theseChickens ? theseChickens : 0, target.decimals).toString()
      ).call())

    }

    if (swapPayload.type == 'origin'){
      setOriginValue(theseChickens)
      setTargetValue(target.getDisplay(thoseChickens))
    } else {
      console.log("origin.getDisplay(thoseChickens)", origin.getDisplay(thoseChickens))
      setOriginValue(origin.getDisplay(thoseChickens))
      setTargetValue(theseChickens)
    }

    setSwapType(swapPayload.type)

  }

  const handleSwap = async (e) => {
    e.preventDefault()
    setStep('confirmingMetamask')

    let originInput, targetInput
    if (swapType == 'origin') {
      originInput = originValue
      targetInput = targetValue * .99
      console.log("ORIGIN")
    } else {
      console.log("TARGET")
      console.log("ORIGIN VALUE", originValue)
      originInput = originValue * 1.01
      targetInput = targetValue
    }

    console.log("targetValue", bnAmount(targetValue, target.decimals))
    console.log("originValue", originValue)
    console.log("target input     ", targetInput)
    console.log("bn target input  ", bnAmount(targetInput, target.decimals))
    console.log("origin input     ", originInput)
    console.log("bn origin input  ", bnAmount(originInput, origin.decimals))

    const tx = loihi.methods[swapType == 'origin' ? 'swapByOrigin' : 'swapByTarget'](
      origin.options.address,
      target.options.address,
      bnAmount(originInput, origin.decimals),
      bnAmount(targetInput, target.decimals),
      Math.floor((Date.now()/1000) + 900)
    )

    const gas = await tx.estimateGas({from: account })
    const gasPrice = await web3.eth.getGasPrice()

    tx.send({ from: account, gas: Math.floor(gas * 1.1), gasPrice})
      .once('transactionHash', hash => {
        setStep('swapping')
        console.log('transactionHash', hash)
      }).on('error', error => {
        setStep('error')
        console.log('error', error)
      }).on('receipt', receipt => {
        setStep('success')
        console.log('receipt', receipt)
      })

  }

  const handleUnlock = async (contract, setUnlocking) => {
    setStep('confirmingMetamask')
    // Should be abstracted to web3Utils / withWallet
    const tx = contract.methods.approve(loihi.options.address, "-1")
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
      .once('transactionHash', hash => {
        setStep('unlocking')
        setUnlocking(true)
      })
      .on('error', error => {
        setStep('error')
        setUnlocking(false)
      })
      .on('receipt', receipt => {
        setStep('success')
        setUnlocking(false)
      })
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
      <MenuItem ref={useRef()} key={0} value={0} > { contracts[0].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={1} value={1} > { contracts[1].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={2} value={2} > { contracts[2].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={3} value={3} > { contracts[3].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={4} value={4} > { contracts[4].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={5} value={5} > { contracts[5].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={6} value={6} > { contracts[6].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={7} value={7} > { contracts[7].symbol } </MenuItem>,
      <MenuItem ref={useRef()} key={8} value={8} > { contracts[8].symbol } </MenuItem>
  ]

  const getDropdown = (handler, value) => {
    return ( <TextField select
      children={ selections }
      onChange={e => handler(e)}
      value={value}
    /> )
  }

  return (
    <>
    { step == 'confirmingMetamask' && <ModalConfirmMetamask /> }
    { (step == 'swapping' || step == 'unlocking') && <SwappingModal/> }
    { step == 'success' && <SuccessModal onDismiss={() => setStep('none')}/> }
    { step == 'error' && <ErrorModal onDismiss={() => setStep('none')} />}

    <StyledSwapTab>
      <StyledRows>
        <AmountInput 
          icon={origin.icon}
          locked={originLocked}
          onChange={e => handleOriginInput(e)}
          onUnlock={e => handleOriginUnlock(e)}
          selections={getDropdown(handleOriginSelect, originSlot)}
          symbol={origin.symbol}
          unlocking={originUnlocking}
          value={originValue}
        />
        <AmountInput 
          icon={target.icon}
          locked={targetLocked}
          onChange={e => handleTargetInput(e)}
          onUnlock={e => handleTargetUnlock(e) }
          selections={getDropdown(handleTargetSelect, targetSlot)}
          symbol={target.symbol}
          unlocking={targetUnlocking}
          value={targetValue}
        /> 
        <Button onClick={handleSwap}>Swap</Button>
      </StyledRows>
      <div style={{ height: 634 }}>
        coming soon™
      </div>
    </StyledSwapTab>
    </>
  )
}

const AmountInput = ({
  available,
  icon,
  locked,
  onChange,
  onUnlock,
  symbol,
  unlocking,
  value,
  selections
}) => (
  <>
    <StyledLabelBar>
      <span>Available: {available} {symbol}</span>
    </StyledLabelBar>
    <TextField fullWidth
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
            <TokenIcon size={24}>
              <img src={icon} />
            </TokenIcon>
          </StyledStartAdornment>
        )
      }}
    />
  </>
)

export default SwapTab