import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import { makeStyles, withTheme } from '@material-ui/core/styles'

import tinyShellIcon from '../../../assets/shell_icon_24.svg'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'
import UnlockingModal from '../../../components/ModalUnlock'

import NumberFormat from 'react-number-format'

import WarningModal from './WarningModal'

import { List } from 'immutable'

import BigNumber from 'bignumber.js'

const REVERTED = '3.963877391197344453575983046348115674221700746820753546331534351508065746944e+57'

const StyledInput = styled.div`
  display: flex;
`
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
  display: flex;
  height: 32px;
  justify-content: space-between;
`)

const StyledWarning = styled.div`
  font-size: 19px;
  width: 82.5%;
  margin: 0 auto;
  margin-top: 2.5px;
  color: red;
`

const StyledDepositMessage = styled.div`
  padding: 20px 10px 10px 10px;
  font-size: 22px;
`

const StartModal = ({
  engine,
  onDeposit,
  onDismiss,
  onUnlock,
  shellIx,
  state
}) => {
  
  const errorStyles = {
    color: 'red',
    fontSize: '26px',
    fontWeight: 'bold'
  }
  
  const SAFETY_CHECK = <span style={errorStyles}> These amounts trigger Shell's Safety Check  </span>
  const DEFAULT = <span> Your rate on this deposit will be... </span>

  const [ inputs, setInputs ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ errors, setErrors ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ error, setError ] = useState(null)
  const [ zero, setZero ] = useState(true)
  const [ unlocking, setUnlocking ] = useState(null)
  const [ feeTip, setFeeTip ] = useState(DEFAULT)
  const [ prompting, setPrompting ] = useState(false)
  const [ maxed, setMaxed ] = useState(null)
  const [ maxedNoSlip, setMaxedNoSlip ] = useState(null)
  
  const depositSingleMax = async (ix) => {

    if (maxed == ix && maxedNoSlip != ix) {
      setMaxed(null)
      return setMaxedNoSlip(null)
    }
    
    
    let deposit = getMaxDeposit(ix).abs()
    
    const decimals = engine.shells[shellIx].assets[ix].decimals
    deposit = engine.shells[shellIx].assets[ix].getDisplayFromNumeraire(deposit, decimals)

    // console.log("deposit single max ~<>~~<>~<>~<>~<>~<>~<>~<>~<>~<>~")
    // console.log("deposit", deposit)

    setMaxed(ix)
    setMaxedNoSlip(null)
    setInputs(inputs.map( (v, i) => {
      const rv = i == ix ? deposit : ''
      // console.log("i", i, "v", v, "rv", rv)
      return rv
    }))
    
  }
  
  const getMaxDeposit = (ix) => {
    
    let deposit = state.getIn(['shells', shellIx, 'assets', ix, 'balance', 'numeraire'])
    
    let mint = engine.calculateSingleDeposit(shellIx, deposit, ix)
    
    if (mint) return deposit
    
    while (!mint) {

      deposit = deposit.times(new BigNumber('.99'))
      mint = engine.calculateSingleDeposit(shellIx, deposit, ix)
      

    }
    
    let down = new BigNumber('.00125')
    let upper = new BigNumber('1.0025')
    
    let pmint
    while (true) {

      pmint = mint ? mint : pmint
      
      const test = deposit.times(upper)
      
      
      mint = engine.calculateSingleDeposit(shellIx, test, ix)
      
      if (!mint) {
        
        upper = upper.minus(down)
        down = down.div(2)
        continue

      } 
      
      deposit = test
      
      if (pmint.minus(mint).abs().lte('.00000001')) {

        mint = mint.abs()
        break
      
      }

    }
    
    const digited = new BigNumber(10 ** (engine.shells[shellIx].assets[ix].decimals - 2))
    const one = new BigNumber(1).div(digited)
    
    return deposit.minus(one)
    
  }
  
  const getMaxDepositNoSlip = (deposit, ix) => {
    
    if (deposit.isZero()) return deposit

    const liqTotal = state.getIn(['shells', shellIx, 'shell', 'liquidityTotal', 'numeraire'])
    const shellsTotal = state.getIn(['shells', shellIx, 'shell', 'shellsTotal', 'numeraire'])
    const sweetspot = '.000001'
    
    let mint = engine.calculateSingleDeposit(shellIx, deposit, ix)
    let pmint = mint
    let liqChange = deposit.div(liqTotal)
    let shellsChange = mint.div(shellsTotal)
    let slip = new BigNumber(1).minus(shellsChange.div(liqChange))
    let pslip = slip
    
    if (slip.lte(sweetspot)) return deposit

    let pointer = new BigNumber('.975')
    let tuner = new BigNumber('.0125')
    
    while (true) {
      
      let test = deposit.times(pointer)
      
      pmint = mint
      mint = engine.calculateSingleDeposit(shellIx, test, ix).abs()
      liqChange = test.div(liqTotal)
      shellsChange = mint.div(shellsTotal)
      slip = new BigNumber(1).minus(shellsChange.div(liqChange))
      const fee = mint.times(slip)
      const pfee = pmint.times(pslip)
      
      if (slip.lte(sweetspot) || slip.minus(pslip).abs().lte(sweetspot)) {
        deposit = test
        break
      } else if (pointer.isZero()) {
        tuner = tuner.div(2)
        pointer = pointer.plus(tuner)
        continue
      } else {
        pointer = pointer.minus(tuner)
        pmint = mint
      }

      pslip = slip

    }
    
    return deposit

  }
  
  const depositMaxNoSlip = (ix) => {

    let deposit

    if (maxed == ix) {

      deposit = engine
        .shells[shellIx]
        .assets[ix]
        .getNumeraireFromDisplay(inputs.get(ix))

    } else deposit = getMaxDeposit(ix).abs()
    
    deposit = getMaxDepositNoSlip(deposit, ix)

    const decimals = engine.shells[shellIx].assets[ix].decimals
    deposit = engine.shells[shellIx].assets[ix].getDisplayFromNumeraire(deposit, decimals)
    
    setMaxed(ix)
    setMaxedNoSlip(ix)
    setInputs(inputs.map( (v,i) => i == ix ? deposit : ''))

  }
  
  const onInput = (v, i) => {
    
    // console.log("on input #######################")
    // console.log("v", v)
    // console.log("i", i)
    
    setInputs(inputs.set(i,v))

    v = engine.shells[shellIx].assets[i].getNumeraireFromDisplay(v)
    
    if (v.isGreaterThan(state.getIn([ 'shells', shellIx, 'assets', i, 'balance', 'numeraire' ]))) {

      setErrors(errors.set(i, 'Amount is greater than your wallet\'s balance'))

    } else if (v.isGreaterThan(state.getIn([ 'shells', shellIx, 'assets', i, 'allowance', 'numeraire' ]))) {

      setErrors(errors.set(i, 'Amount is greater than Shell\'s allowance'))

    } else {
      
      setErrors(errors.set(i, ''))

    }

  }
  
  useEffect( () => {
    

    const total = inputs.reduce( (a,c) => a + c )

    console.log("use effect ^^^^^^^^^^^^^^^^^^^^^^^^^")
    // console.log("inputs", inputs)
    // console.log("total", total)
    
    if (total == 0) {

      setZero(true)
      setError(null)
      setFeeTip(DEFAULT)

    } else {

      setZero(false);
      (async function () { await primeDeposit() })()

    }

  }, [ inputs, zero ])

  const primeDeposit = async () => {

    const { addresses, amounts } = getAddressesAndAmounts()
    
    // console.log("prime deposit _________________________")
    // console.log("addresses", addresses)
    // console.log("amounts", amounts)
    
    const mint = await engine.shells[shellIx].viewSelectiveDeposit(addresses, amounts)
    
    console.log("mint", mint.toFixed(10))

    if (mint === false || mint.toString() === REVERTED) {

      setError(SAFETY_CHECK)
      setFeeTip(null)
      return 

    } 

    setError(null)

    const totalDeposit = amounts.reduce((a,c) =>  a.plus(c.numeraire), new BigNumber(0))

    const liqTotal = state.getIn([ 'shells', shellIx, 'shell', 'liquidityTotal', 'numeraire' ])
    const liqChange = totalDeposit.dividedBy(liqTotal)

    const shellsTotal = state.getIn([ 'shells', shellIx, 'shell', 'shellsTotal', 'numeraire' ])
    const shellsChange = mint.dividedBy(shellsTotal)

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liqChange))
    
    const fee = mint.multipliedBy(slippage)

    const slippageMessage = slippage.absoluteValue().isGreaterThan(0.0001)
      ? slippage.isNegative()
        ? ( <span> 
              and earn a rebalance subsidy of 
              <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
                <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
                { Math.abs(fee.toFixed(8)) } 
              </span>
            </span> 
        ):( <span> 
              and pay liquidity providers a fee of 
              <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
                <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
                { fee.toFixed(8) }
              </span>
            </span>
        )
      : ''
    
    const feeMessage = <div>
      You will mint 
        <span style={{position: 'relative', paddingLeft: '16.5px', paddingRight: '4px' }}>
          <img alt="" 
            src={tinyShellIcon} 
            style={{position:'absolute', top:'1px', left: '1px' }} 
          /> 
          { ' ' + engine.shells[shellIx].getDisplayFromNumeraire(mint) } 
        </span> 
      { slippageMessage }
    </div>
      
    setFeeTip(feeMessage)

  }
  

  const getAddressesAndAmounts = () => {
    
    console.log("get addresses and amounts /\_/\_/\_/\_/\_/\_/\_/\_/\_/\_")

    const addresses = []
    const amounts = []

    inputs.forEach( (v,i) => {

      if (0 < Number(v.replace(/,/g,''))) {
        const asset = engine.shells[shellIx].assets[i]
        addresses.push(asset.address)
        amounts.push(asset.getAllFormatsFromDisplay(v))
      }
    })
    
    return { addresses, amounts }

  }

  const handleSubmit = (e) => {
    
    const { addresses, amounts } = getAddressesAndAmounts()
    
    for (let ix = 0; ix < engine.shells[shellIx].assets.length; ix++) {

      const asset = engine.shells[shellIx].assets[ix]

      const exists = addresses.indexOf(asset.address)

      if (exists >= 0) {

        const allowance = state.getIn([
          'shells', shellIx, 
          'assets', ix, 
          'allowance', 'raw'
        ])
        
        if (allowance.isZero()) return setUnlocking(ix)
        if (allowance.isLessThan(amounts[exists].raw)) return setUnlocking(ix)

      }

    }
    
    onDeposit(addresses, amounts)

  }

  const inputStyles = makeStyles({
    // inputBase: { fontSize: '22px', height: '60px' },
    helperText: {
      color: 'red', 
      fontSize: '13px',
      marginLeft: '10px'
    }
  })()

  const tokenInputs = engine.shells[shellIx].assets.map( (asset, ix) => {

    const assetState = state.getIn([ 'shells', shellIx, 'assets', ix ])
    
    let balance = assetState.getIn([ 'balance', 'numeraire']).toString()

    let available = assetState.getIn([ 'allowance', 'numeraire' ])
    
    if (available.isGreaterThan(new BigNumber(100000000))) {
      available = '100,000,000+'
    } else if ( available.isGreaterThan(new BigNumber(10000000))) {
      available = available.toExponential()
    } else {
      available = assetState.getIn(['allowance', 'display'])
    }

    return (
      <TokenInput
        available={available}
        balance={balance}
        icon={asset.icon}
        isMaxed={maxed == ix}
        isMaxedNoSlip={maxedNoSlip == ix}
        isError={ errors[ix] ? true : false }
        helperText={ errors[ix] }
        onAllowanceClick={ () => setUnlocking(ix) }
        onChange={payload => onInput(payload.value, ix) }
        styles={inputStyles}
        symbol={asset.symbol}
        value={inputs.get(ix)}
        depositMax={() => depositSingleMax(ix)}
        depositMaxNoSlip={() => depositMaxNoSlip(ix) }
      />
    )

  })

  return (
    <Modal width="500px" onDismiss={onDismiss}>
      { prompting && <WarningModal 
          tag={engine.shells[shellIx].tag}
          onCancel={ () => setPrompting(false) } 
          onContinue={handleSubmit} /> }
      { unlocking != null && <UnlockingModal
          coin={ state.getIn(['shells', shellIx, 'assets', unlocking]) }
          handleCancel={ () => setUnlocking(null) }
          handleUnlock={ amount => ( setUnlocking(null), onUnlock(unlocking, amount) ) } /> }
      <ModalTitle> Deposit Funds </ModalTitle>
      <ModalContent>
        <StyledForm>
          <StyledRows>
            <StyledDepositMessage> { error || feeTip } </StyledDepositMessage>
            { tokenInputs }
          </StyledRows>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}> Cancel </Button>
        <Button style={{cursor: 'no-drop'}}
          onClick={ () => setPrompting(true) } > 
          Deposit 
        </Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  available,
  balance,
  depositMax,
  depositMaxNoSlip,
  icon,
  isMaxed,
  isMaxedNoSlip,
  isError,
  helperText,
  onChange,
  onAllowanceClick,
  styles,
  symbol,
  value
}) => {

  return ( <>
    <StyledLabelBar style={{ marginTop: '12px', marginBottom: '-10px' }} >
      <span>  
        Your wallet's balance:
        <span class="number"> {balance} </span>
      </span> 
    </StyledLabelBar>
    <StyledLabelBar>
      <span onClick={onAllowanceClick} style={{cursor:'pointer'}} >  
        Shell's allowance:
        <span class="number"> {available} </span>
        <span style={{ textDecoration: 'underline' }} > click to change </span>
      </span> 
    </StyledLabelBar>
    <StyledInput>
      <NumberFormat fullWidth
        allowNegative={false}
        customInput={TextField}
        defaultColor="red"
        error={isError}
        FormHelperTextProps={{className: styles.helperText}}
        helperText={helperText}
        inputMode={"numeric"}
        min="0"
        onValueChange={ onChange }
        onChange={ () => console.log(">>>>>>>>>>>>>> we have a change <<<<<<<<<<<<<<<") }
        placeholder="0"
        style={{width: '90%', marginRight: '5px'}}
        thousandSeparator={true}
        type="text"
        value={value}
        InputProps={{
          style: isError ? { color: 'red' } : null,
          endAdornment: <StyledEndAdornment>{symbol}</StyledEndAdornment>,
          startAdornment: (
            <StyledStartAdornment>
              <TokenIcon size={24}> <img alt="" src={icon} /> </TokenIcon>
            </StyledStartAdornment>
          )
        }}
      />
      <Button small
        outlined={!isMaxed}
        style={{height: '40px', margin: 'auto', marginLeft: '5px'}}
        onClick={depositMax}
      > Max </Button>
      <Button small
        outlined={!isMaxedNoSlip}
        style={{height: '40px', width: '140px', margin: 'auto', marginLeft: '5px'}}
        onClick={depositMaxNoSlip}
      > No Slippage </Button>
    </StyledInput>
  </>)
}


export default StartModal