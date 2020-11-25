import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles'

import shellIcon from '../../../assets/logo.png'

import tinyShellIcon from '../../../assets/shell_icon_24.svg'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import NumberFormat from 'react-number-format'

import { List } from 'immutable'

import BigNumber from 'bignumber.js'

BigNumber.config({ DECIMAL_PLACES: 18 })

const REVERTED = '3.963877391197344453575983046348115674221700746820753546331534351508065746944e+57'

const StyledInput = styled.div`
  margin: 24px 0;
  display: flex;
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
const StyledWithdrawMessage = styled.div`
  padding: 20px 10px 10px 10px;
  font-size: 22px;
`
const errorStyles = {
  color: 'red',
  fontSize: '26px',
  fontWeight: 'bold'
}

const ONE = new BigNumber(1)

const StartModal = ({
  engine, 
  onProportionalWithdraw,
  onWithdraw,
  onDismiss,
  shellIx,
  state
}) => {

  const SAFETY_CHECK = <span style={errorStyles}> These amounts trigger Shell's Safety Check  </span>
  const EXCEEDS_BALANCE = <span style={errorStyles}> This withdrawal exceeds your Shell balance </span>
  const DEFAULT = <span> Your rate for this withdrawal will be... </span>
  
  const [ inputs, setInputs ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ errors, setErrors ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ fees, setFees ] = useState(new Array(engine.shells[shellIx].assets.length).fill(null))
  const [ maxed, setMaxed ] = useState(null)
  const [ maxedNoSlip, setMaxedNoSlip ] = useState(null)
  const [ feeTip, setFeeTip ] = useState(DEFAULT)
  const [ proportional, setProportional ] = useState(false)
  const [ zero, setZero ] = useState(true)
  const [ error, setError ] = useState(null)
  
  const withdrawSingleMax = async (ix) => {
    
    if (maxed == ix && maxedNoSlip != ix) {
      setMaxed(null)
      return setMaxedNoSlip(null)
    } 
    
    let withdraw = getMaxWithdraw(ix).absoluteValue()
    
    const decimals = engine.shells[shellIx].assets[ix].decimals
    withdraw = engine.shells[shellIx].assets[ix].getDisplayFromNumeraire(withdraw, decimals)
    
    setMaxed(ix)
    setMaxedNoSlip(null)
    setProportional(false)  
    setInputs(inputs.map( (v, i) => i == ix ? withdraw : ''))

  }
  
  const getMaxWithdraw = (ix) => {
    
    const totalLiq = state.getIn(['shells', shellIx, 'shell', 'liquidityTotal', 'numeraire'])
    const totalShells = state.getIn([ 'shells', shellIx, 'shell', 'shellsTotal', 'numeraire'])
    const ownedShells = state.getIn([ 'shells', shellIx, 'shell', 'shellsOwned', 'numeraire'])
    const percentToBurn = ownedShells.dividedBy(totalShells)
    
    let withdraw = totalLiq.multipliedBy(percentToBurn)
    
    let shellsToBurn = engine.calculateSingleWithdraw(shellIx, withdraw, ix)
    
    while (!shellsToBurn || (shellsToBurn && shellsToBurn.isGreaterThan(ownedShells))) {
      
      withdraw = withdraw.multipliedBy(new BigNumber('.99'))
      shellsToBurn = engine.calculateSingleWithdraw(shellIx, withdraw, ix)

    }
    
    let down = new BigNumber('.0125')
    let upper =new BigNumber('1.025')

    let priorShellsToBurn = shellsToBurn
    while (true) {

        priorShellsToBurn = shellsToBurn 
          ? shellsToBurn 
          : priorShellsToBurn

        const test = withdraw.multipliedBy(upper)

        shellsToBurn = engine.calculateSingleWithdraw(shellIx, test, ix)

        if (shellsToBurn) shellsToBurn = shellsToBurn.absoluteValue()
        
        if (!shellsToBurn || shellsToBurn.isGreaterThan(ownedShells)) {

          upper = upper.minus(down)
          down = down.dividedBy(2)

        } else if (shellsToBurn.isLessThanOrEqualTo(ownedShells)) {

          withdraw = test

          if (shellsToBurn.isEqualTo(ownedShells)) break
          if (priorShellsToBurn.minus(shellsToBurn).absoluteValue()
            .isLessThanOrEqualTo('.00000001')) break

        } 

    }
    
    return withdraw

  }
  
  const withdrawMaxNoSlip = (ix) => {

    let withdraw

    if (maxed == ix) {

      withdraw = engine
        .shells[shellIx]
        .assets[ix]
        .getNumeraireFromDisplay(inputs.get(ix))

    } else withdraw = getMaxWithdraw(ix).absoluteValue()
    
    let downer = new BigNumber('.975')
    let upper = new BigNumber('.0125')

    const liqTotal = state.getIn(['shells', shellIx, 'shell', 'liquidityTotal', 'numeraire'])
    const shellsTotal = state.getIn(['shells', shellIx, 'shell', 'shellsTotal', 'numeraire'])
    const epsilon = engine.shells[shellIx].epsilon
    
    
    let priorShellsToBurn = engine.calculateSingleWithdraw(shellIx, withdraw, ix).absoluteValue()
    let shellsToBurn
    
    while (true) {

      const test = withdraw.multipliedBy(downer)
      
      shellsToBurn = engine.calculateSingleWithdraw(shellIx, test, ix).absoluteValue()
      const liquidityChange = test.dividedBy(liqTotal)
      const shellsChange = shellsToBurn.dividedBy(shellsTotal)
      let slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))

      
      if (slippage.isNegative()) {
        const diff = slippage.plus(epsilon).absoluteValue()
        
        if (priorShellsToBurn && priorShellsToBurn.minus(shellsToBurn).absoluteValue().isLessThanOrEqualTo('.00000001')) break
        if (diff.absoluteValue().isLessThanOrEqualTo('.0000000001')) {

          downer = downer.plus(upper)
          upper = upper.dividedBy(2)

        } else {

          priorShellsToBurn = shellsToBurn
          withdraw = test

        } 

      } else break
      
    }
    
    const decimals = engine.shells[shellIx].assets[ix].decimals
    withdraw = engine.shells[shellIx].assets[ix].getDisplayFromNumeraire(withdraw, decimals)
    
    // console.log("!<>#<!#><!#>!<# withdraw !<>!<!><>!<>!<@!><@!", withdraw)

    setMaxed(ix)
    setMaxedNoSlip(ix)
    setProportional(false)  
    setInputs(inputs.map( (v, i) => i == ix ? withdraw : ''))
    
  }

  const handleSubmit = (e) => {
    
    e.preventDefault()

    if (proportional) {
      
      const totalShells = state.getIn([ 'shells', shellIx, 'shell', 'shellsOwned', 'raw' ])

      onProportionalWithdraw(totalShells)

    } else {

      const { addresses, amounts } = getAddressesAndAmounts()

      onWithdraw(addresses, amounts)

    }
  }

  const getAddressesAndAmounts = () => {

    const addresses = []
    const amounts = []

    inputs.forEach( (v,i) => {

      if (v.replace('.','') != '') {
        const asset = engine.shells[shellIx].assets[i]
        addresses.push(asset.address)
        amounts.push(asset.getAllFormatsFromDisplay(v))
      }

    })
    
    return { addresses, amounts }

  }

  const primeProportionalWithdraw = (event) => {

    if (event.target.checked) {

      const fee = engine.shells[shellIx].epsilon.multipliedBy(100).toString()
      
      const feeMessage = (
        <div>
          You will burn
          <span style={{ position: 'relative', paddingLeft: '16.5px' }}> 
            <img alt=""
              src={tinyShellIcon} 
              style={{position:'absolute', top:'1px', left: '0px' }} 
            /> 
            { ' ' + state.getIn([ 'shells', shellIx, 'shell', 'shellsOwned', 'display' ]) } 
          </span>
          <span> and pay a {fee}% fee to liquidity providers for this withdrawal </span>
        </div>
      )
        
      const updatedInputs = inputs.map( (v, i) => {
        return engine.shells[shellIx].getDisplayFromNumeraire(
          state.getIn([ 'shells', shellIx, 'shell', 'liquiditiesOwned', i, 'numeraire'])
            .multipliedBy(ONE.minus(engine.shells[shellIx].epsilon)))
      })

      setInputs(updatedInputs)
      setErrors(errors.map( () => null ))
      setFeeTip(feeMessage)
      setZero(false)
      setProportional(true)
      setMaxed(null)
      setMaxedNoSlip(null)

    } else {
      
      setInputs(inputs.map( () => '' ))
      setErrors(errors.map ( () => null ))
      setFeeTip(DEFAULT)
      setProportional(false)
      setZero(true)
      setMaxed(null)
      setMaxedNoSlip(null)

    }

  }
  
  const onInput = (v, i) => {

    if (maxed != null && inputs.get(i).replace(/,/g,'') != v) {
      setMaxed(null)
      setMaxedNoSlip(null)
    }

    const updatedInputs = inputs.set(i,v)
      
    setInputs(updatedInputs)

    const total = updatedInputs.reduce( (a,c) => a + c )
    
    if (total == 0) {
      
      setZero(true)
      setError(null)
      setFeeTip(DEFAULT)
    
    }

  }
  
  const primeWithdraw = async () => {

    if (zero) return

    var { addresses, amounts } = getAddressesAndAmounts()
    
    const totalWithdraw = amounts.reduce( (a, c) => a.plus(c.numeraire), new BigNumber(0) )
    
    if (totalWithdraw.isZero()) return
      
    let amts = []

    inputs.forEach( (v,i) => {
      const asset = engine.shells[shellIx].assets[i]
      amts.push(asset.getNumeraireFromDisplay(v))
    })
      
    const shellsToBurn = await engine.shells[shellIx].viewSelectiveWithdraw(addresses, amounts)
    const calculatedShellsToBurn = engine.calculateWithdraw(shellIx, amts)
    
    if (shellsToBurn === false || shellsToBurn.toString() == REVERTED) {
      
      setError(SAFETY_CHECK)
      setFeeTip(null)
      return

    } else if (shellsToBurn.isGreaterThan(state.getIn(['shells', shellIx, 'shell', 'shellsOwned', 'numeraire']))) {
      
      setError(EXCEEDS_BALANCE)
      setFeeTip(null)
      return

    } 

    const liqTotal = state.getIn(['shells', shellIx, 'shell', 'liquidityTotal', 'numeraire'])
    const liquidityChange = totalWithdraw.dividedBy(liqTotal)
    
    const shellsTotal = state.getIn(['shells', shellIx, 'shell', 'shellsTotal', 'numeraire'])
    const shellsChange = shellsToBurn.dividedBy(shellsTotal)

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))
    
    // console.log("<^><^><^><^><^><^><^><^><^><^>")
    // console.log("calculatedShellsToBurn", calculatedShellsToBurn.toString())
    // console.log("shellsToBurn", shellsToBurn.toString())
    // console.log("total withdraw", totalWithdraw.toString())
    // console.log("shellsTotal", shellsTotal.toString())
    // console.log("shellsChange", shellsChange.toString())
    // console.log("liq total", liqTotal.toString())
    // console.log("liq change", liquidityChange.toString())
    
    console.log("slippage", slippage.toString())
    
    const fee = shellsToBurn.multipliedBy(slippage)
    
    const slippageMessage = slippage.isNegative()
      ? ( <span> 
            and pay a liquidity provider fee of 
            <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
              <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
              { Math.abs(fee.toFixed(8)) } 
            </span>
          </span>
      ) : ( <span > 
            and earn a rebalancing subsidy of 
            <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
              <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
              { fee.toFixed(8) } 
            </span>
          </span> 
        )

    const shells = (
      <div>
        You will burn 
        <span style={{position: 'relative', paddingLeft: '16.5px', paddingRight: '4px' }}> 
          <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '0px' }} /> 
          { ' ' + engine.shells[shellIx].getDisplayFromNumeraire(shellsToBurn) }
        </span>
        { slippageMessage }
      </div>
    )
        
    setFeeTip(shells)
    setError(null)

  }

  useEffect( () => {

    const total = inputs.reduce( (a,c) => a + c )
    
    if (total == 0) {
      
      setZero(true)
      setError(null)
      setFeeTip(DEFAULT)
      return
      
    } else if (!proportional) {
      
      setZero(false);

      (async function () {
        if (!proportional) await primeWithdraw()
      })()
      
    }
    
  }, [ inputs, zero ])


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

  const tokenInputs = engine.shells[shellIx].assets.map( (asset, ix) => { 

    return (
      <TokenInput
        disabled={proportional}
        icon={asset.icon}
        isMaxed={maxed == ix}
        isMaxedNoSlip={maxedNoSlip == ix}
        onChange={ payload => onInput(payload.value, ix) }
        onValueChange={ value => console.log("val change", value) }
        symbol={asset.symbol}
        value={inputs.get(ix)}
        withdrawMax={() => withdrawSingleMax(ix)}
        withdrawMaxNoSlip={() => withdrawMaxNoSlip(ix)}
      />
    )

  })
  
  console.log("maxed", maxed)
  
  return (
    <Modal width="500px" onDismiss={onDismiss}>
      <ModalTitle marginBottom="20px" >Withdraw Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            <StyledShells>
                <StyledShellIcon src={shellIcon}/>
                <StyledShellBalance> { state.getIn([ 'shells', shellIx, 'shell', 'shellsOwned', 'display' ]) + ' Shells'} </StyledShellBalance>
            </StyledShells>
            <StyledWithdrawMessage> { error || feeTip } </StyledWithdrawMessage>
              { tokenInputs }
            <StyledWithdrawEverything>
              <Checkbox 
                checked={ proportional }
                className={ checkboxClasses.root }
                onChange={ primeProportionalWithdraw }
              >
              </Checkbox>
                Withdraw Everything
            </StyledWithdrawEverything>
          </StyledRows>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button onClick={onDismiss} outlined >Cancel</Button>
        <Button onClick={handleSubmit}
          style={ error ? { cursor: 'no-drop'} : null }
          disabled={ error || zero } 
        >
          { proportional ? 'Withdraw Everything' : 'Withdraw' }
       </Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  disabled,
  error,
  icon,
  isMaxed,
  isMaxedNoSlip,
  onChange,
  symbol,
  value,
  withdrawMax,
  withdrawMaxNoSlip,
}) => (
  <StyledInput>
    <NumberFormat fullWidth
      allowNegative={false}
      customInput={TextField}
      disabled={disabled}
      error={error}
      inputMode={"numeric"}
      min="0"
      onValueChange={ onChange }
      placeholder="0"
      style={{width:'90%', marginRight: '5px'}}
      thousandSeparator={true}
      type="text"
      value={value}
      InputProps={{
        endAdornment: ( 
          <StyledEndAdornment>
            <span> {symbol} </span>
          </StyledEndAdornment>
        ),
        startAdornment: (
          <StyledStartAdornment>
            <TokenIcon size={24}> <img src={icon} alt="" /> </TokenIcon>
          </StyledStartAdornment>
        )
      }}
    />
    <Button 
      outlined={!isMaxed}
      small
      style={{height: '40px', margin: 'auto', marginLeft: '5px'}}
      onClick={withdrawMax}
    >
      Max 
    </Button>
    <Button 
      // disabled={!isMaxed}
      outlined={!isMaxedNoSlip}
      small
      style={{height: '40px', width: '140px', margin: 'auto', marginLeft: '5px'}}
      onClick={withdrawMaxNoSlip}
    >
      No Slippage
    </Button>
  </StyledInput>
)

export default StartModal
