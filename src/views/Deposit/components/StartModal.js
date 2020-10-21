import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'
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

const StyledDepositMessage = styled.div`
  padding: 20px 10px 10px 10px;
  font-size: 22px;
`

const StartModal = ({
  engine,
  onDeposit,
  onDismiss,
  onUnlock,
  state
}) => {
  
  const errorStyles = {
    color: 'red',
    fontSize: '26px',
    fontWeight: 'bold'
  }
  
  const SAFETY_CHECK = <span style={errorStyles}> These amounts trigger Shell's Safety Check  </span>
  const DEFAULT = <span> Your rate on this deposit will be... </span>

  const [ inputs, setInputs ] = useState(new List(new Array(engine.assets.length).fill('')))
  const [ errors, setErrors ] = useState(new List(new Array(engine.assets.length).fill('')))
  const [ error, setError ] = useState(null)
  const [ zero, setZero ] = useState(true)
  const [ unlocking, setUnlocking ] = useState(null)
  const [ feeTip, setFeeTip ] = useState(DEFAULT)
  const [ prompting, setPrompting ] = useState(false)
  
  const onInput = (v, i) => {
    
    setInputs(inputs.set(i,v))

    v = engine.assets[i].getNumeraireFromDisplay(v)
    
    if (v.isGreaterThan(state.getIn([ 'assets', i, 'balance', 'numeraire' ]))) {

      setErrors(errors.set(i, 'Amount is greater than your wallet\'s balance'))

    } else if (v.isGreaterThan(state.getIn([ 'assets', i, 'allowance', 'numeraire' ]))) {

      setErrors(errors.set(i, 'Amount is greater than Shell\'s allowance'))

    } else {
      
      setErrors(errors.set(i, ''))

    }

  }
  
  useEffect( () => {

    const total = inputs.reduce( (a,c) => a + c )
    
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
    
    const shellsToMint = await engine.shell.viewSelectiveDeposit(addresses, amounts)
    
    if (shellsToMint === false || shellsToMint.toString() === REVERTED) {

      setError(SAFETY_CHECK)
      setFeeTip(null)
      return 

    } 

    setError(null)

    const totalDeposit = amounts.reduce((a,c) =>  a.plus(c.numeraire), new BigNumber(0))

    const liquidityChange = totalDeposit.dividedBy(state.getIn([ 'shell', 'liquidityTotal', 'numeraire' ]))

    const shellsChange = shellsToMint.dividedBy(state.getIn([ 'shell', 'shellsTotal', 'numeraire' ]))

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))
    
    const fee = shellsToMint.multipliedBy(slippage)

    const slippageMessage = slippage.absoluteValue().isGreaterThan(0.0001)
      ? slippage.isNegative()
        ? ( <span> 
              and earn a rebalance subsidy of 
              <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
                <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
                { Math.abs(fee.toFixed(4)) } 
              </span>
            </span> 
        ):( <span> 
              and pay liquidity providers a fee of 
              <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
                <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
                { fee.toFixed(4) }
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
          { ' ' + engine.shell.getDisplayFromNumeraire(shellsToMint, 2) } 
        </span> 
      { slippageMessage }
    </div>
      
    setFeeTip(feeMessage)

  }
  

  const getAddressesAndAmounts = () => {

    const addresses = []
    const amounts = []

    inputs.forEach( (v,i) => {
      if (0 < v) {
        const asset = engine.assets[i]
        addresses.push(asset.address)
        amounts.push(asset.getAllFormatsFromDisplay(v))
      }
    })
    
    return { addresses, amounts }

  }

  const handleSubmit = (e) => {
    
    const { addresses, amounts } = getAddressesAndAmounts()

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

  const tokenInputs = engine.assets.map( (asset, ix) => {

    const assetState = state.get('assets').get(ix)

    let available = assetState.getIn(['allowance', 'numeraire'])
    
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
        icon={asset.icon}
        isError={ errors[ix] ? true : false }
        helperText={ errors[ix] }
        onAllowanceClick={ () => setUnlocking(ix) }
        onChange={payload => onInput(payload.value, ix) }
        styles={inputStyles}
        symbol={asset.symbol}
        value={inputs.get(ix)}
      />
    )

  })

  const isInputError = error || errors.find( c => !!c )
  
  return (
    <Modal onDismiss={onDismiss}>
      { prompting && <WarningModal 
          onCancel={ () => setPrompting(false) } 
          onContinue={handleSubmit} /> }
      { unlocking != null && <UnlockingModal
          coin={ state.getIn(['assets', unlocking]) }
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
        <Button disabled={ isInputError || zero } 
          style={{cursor: 'no-drop'}}
          onClick={ () => setPrompting(true) } > 
          Deposit 
        </Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  available,
  isError,
  icon,
  helperText,
  onChange,
  onAllowanceClick,
  styles,
  symbol,
  value
}) => {

  return ( <>
    <StyledLabelBar>
      <span onClick={onAllowanceClick} style={{cursor:'pointer'}} >  
        Shell's allowance:
        <span class="number"> ${available} </span>
        <span style={{ color: '#8a8a8a', textDecoration: 'underline' }} > click to change </span>
      </span> 
    </StyledLabelBar>
    <NumberFormat fullWidth
      customInput={TextField}
      defaultColor="red"
      error={isError}
      FormHelperTextProps={{className: styles.helperText}}
      helperText={helperText}
      inputMode={"numeric"}
      min="0"
      onValueChange={ onChange }
      placeholder="0"
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
  </>)
}


export default StartModal