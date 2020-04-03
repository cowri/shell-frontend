import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import BigNumber from 'bignumber.js'

import { bnAmount } from '../../../utils/web3Utils'

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
  contracts,
  loihi
}) => {

  const [step, setStep] = useState('start')
  const [originSlot, setOriginSlot] = useState(0)
  const [targetSlot, setTargetSlot] = useState(3)
  const [originAmount, setOriginAmount] = useState(0)
  const [targetAmount, setTargetAmount] = useState(0)
  const [swapType, setSwapType] = useState('origin')

  const origin = contracts[originSlot]
  const target = contracts[targetSlot]

  const primeSwap = async (value, type) => {
    console.log("prime swap", value, type)
    setSwapType(type)
    const theseChickens = Number(value)

    console.log("origin slot", originSlot)
    console.log("target slot", targetSlot)

    const origin = contracts[originSlot]
    const target = contracts[targetSlot]

    let thoseChickens
    if (type === 'origin') {
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
    console.log("Those chickens", thoseChickens)
    window.thoseChickens = thoseChickens
    if (type == 'origin'){
      setOriginAmount(theseChickens)
      setTargetAmount(target.getDisplay(thoseChickens))
    } else {
      setOriginAmount(origin.getDisplay(thoseChickens))
      setTargetAmount(theseChickens)
    }
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
      onChange={e => { e.preventDefault(); handler(e.target.value) }}
      value={value}
    /> )
  }

  const handleOriginSelect = (value) => {
    if (value != targetSlot) {
      setOriginSlot(value)
      console.log("swap type from origin select", swapType)
      if (swapType == 'origin') primeSwap(originAmount, 'origin')
      else primeSwap(targetAmount, 'target')
    }
  }

  const handleTargetSelect = (value) => {
    if (value != originSlot) {
      setTargetSlot(value)
      console.log("swap type from target select", swapType)
      if (swapType == 'origin') primeSwap(originAmount, 'origin')
      else primeSwap(targetAmount, 'target')
    }
  }

  return (
    <StyledSwapTab>
      <StyledRows>
        <AmountInput 
          icon={origin.icon}
          onChange={e => { e.preventDefault(); primeSwap(e.target.value, 'origin') } }
          symbol={origin.symbol}
          value={originAmount}
          selections={getDropdown(handleOriginSelect, originSlot)}
        />
        <AmountInput 
          icon={target.icon}
          onChange={e => { e.preventDefault(); primeSwap(e.target.value, 'target') } }
          symbol={target.symbol}
          value={targetAmount}
          selections={getDropdown(handleTargetSelect, targetSlot)}
        /> 
      </StyledRows>
      <div style={{ height: 634 }}>
        coming soon™
      </div>
    </StyledSwapTab>
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
    <TextField
      disabled={locked}
      fullWidth
      InputProps={{
        endAdornment: (
          <div style={{ marginRight: 6 }}>
            { selections }
            { locked ? (
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
      onChange={onChange}
      placeholder="0"
      value={value}
    />
  </>
)

export default SwapTab