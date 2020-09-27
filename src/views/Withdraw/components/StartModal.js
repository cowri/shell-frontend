import React, { useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'
import shellIcon from '../../../assets/logo.png'
import tinyShellIcon from '../../../assets/cowri-logo.svg'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import { bnAmount, displayAmount } from '../../../utils/web3Utils'

import BigNumber from 'bignumber.js'

const StyledInput = styled.div`
  margin: 24px 0;
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


const StartModal = ({
  engine, 
  localState,
  onProportionalWithdraw,
  onWithdraw,
  onDismiss,
  setLocalState,
  state
}) => {

  const errorStyles = {
    color: 'red',
    fontSize: '26px',
    fontWeight: 'bold'
  }
  
  const SAFETY_CHECK = <span style={errorStyles}> These amounts trigger Shell's Safety Check  </span>
  const EXCEEDS_BALANCE = <span style={errorStyles}> This withdrawal exceeds your Shell balance </span>

  const epsilonRemoved = (amount) => {

    const epsilon = new BigNumber(1).minus(0.000175)

    return amount.multipliedBy(epsilon)

  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (localState.get('proportional')) {

      onProportionalWithdraw(state.getIn([ 'shell', 'shells', 'raw' ]))

    } else {

      const {
        addresses,
        amounts
      } = getAddressesAndAmounts(localState)

      onWithdraw(addresses, amounts)

    }
  }

  const getAddressesAndAmounts = (currentState) => {

    const addresses = []

    const amounts = []

    currentState.get('assets').forEach( (asset, ix) => {

      const amount = asset.get('input')

      if (0 < amount) {

        const asset = engine.assets[ix]

        addresses.push(asset.address)

        amounts.push(asset.getRawFromDisplay(amount)) 

      }

    })

    return { addresses, amounts }

  }

  const primeProportionalWithdraw = (yes) => {

    if (yes) {
      
      console.log("proprotional withdraw")

      const shells = (
        <span style={{ display: 'inline-block', position: 'relative', paddingLeft: '17.5px' }}> 
          <img alt=""
            src={tinyShellIcon} 
            style={{position:'absolute', top:'2.5px', left: '5px', height: '20px' }} 
          /> 
          { state.getIn([ 'shell', 'shells', 'display' ])} 
        </span>
      )
      
      setLocalState(localState
        .update('assets', as => as.map( (a, ix) => a.set('input', state.getIn([ 'assets', ix, 'balanceInShell', 'display']))))
        .set('feeTip', <div> For this withdrawal you will burn { shells } and pay a 0.0175% fee to liquidity providers </div>)
        .set('proportional', true)
      )

    } else {

      setLocalState(localState
        .update('assets', as => as.map( a => a.set('input', '')))
        .set('feeTip', 'Your rate on this withdrawal will be...')
        .set('proportional', false)
      )

    }

  }

  const primeWithdraw = async (val, ix) => {

    if (isNaN(val)) return

    val = val === '' ? '' : Math.abs(+val)

    let newLocalState = localState.setIn(['assets', ix, 'input'], val)

    const { addresses, amounts } = getAddressesAndAmounts(newLocalState)

    const totalWithdraw = amounts.reduce( (a,c,i) => {

      const asset = engine.assets[engine.derivativeIx[addresses[i]]]

      return a.plus(asset.getNumeraireFromRaw(c))

    }, new BigNumber(0))

    if (totalWithdraw.isZero()) {

      return setLocalState(newLocalState
        .set('feeTip', 'Your rate for this withdrawal will be...')
        .delete('error')
      )

    }

    const shellsToBurn = await engine.shell.viewSelectiveWithdraw(addresses, amounts)

    if (shellsToBurn === false) {

      return setLocalState(newLocalState
        .set('error', SAFETY_CHECK)
        .delete('feeTip')
      )

    } else if (shellsToBurn.isGreaterThan(state.getIn(['shell', 'shells', 'numeraire']))) {

      const shellBalance = state.getIn([ 'shell', 'shells', 'display' ])

      return setLocalState(newLocalState
        .set('error', EXCEEDS_BALANCE)
        .delete('feeTip')
      )

    } else {

      newLocalState = newLocalState.delete('error')

    }

    const liquidityChange = totalWithdraw.dividedBy(state.getIn(['shell', 'totalLiq', 'numeraire']))

    const shellsChange = shellsToBurn.dividedBy(state.getIn(['shell', 'totalShells', 'numeraire']))

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange)).multipliedBy(100)

    const slippageMessage = slippage.isNegative()
      ? <span>and pay a { Math.abs(slippage.toFixed(4)) }% fee to liquidity providers </span>
      : <span>and earn a { slippage.toFixed(4) }% rebalancing subsidy </span>

    const shells = <div>
      You will burn 
      <span style={{position: 'relative', paddingRight: '17.5px'}}> 
        <img alt="" src={tinyShellIcon} style={{position:'absolute', top:'2.5px', right: '5px', height: '20px' }} /> 
        { engine.shell.getDisplayFromNumeraire(shellsToBurn, 2) }
      </span>
      { slippageMessage }
      Shells for this withdrawal
    </div>

    return setLocalState(newLocalState.set('feeTip', shells))

  }

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
  };

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

  const tokenInputs = engine.assets.map( (asset, ix) => { 
    
    return (
      <TokenInput
        disabled={localState.get('proportional')}
        icon={asset.icon}
        onChange={e => primeWithdraw(e.target.value, ix) }
        symbol={asset.symbol}
        value={localState.getIn([ 'assets', ix, 'input' ])}
      />
    )

  })

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Withdraw Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            <StyledShells>
                <StyledShellIcon src={shellIcon}/>
                <StyledShellBalance> { state.getIn([ 'shell', 'shells', 'display' ]) + ' Shells'} </StyledShellBalance>
            </StyledShells>
            <StyledWithdrawMessage> { localState.get('error') || localState.get('feeTip') } </StyledWithdrawMessage>
            { tokenInputs }
            <StyledWithdrawEverything>
              <Checkbox 
                checked={ localState.get('proportional') }
                className={ checkboxClasses.root }
                onChange={ e => primeProportionalWithdraw(e.target.checked) }
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
          style={ localState.get('error') ? { cursor: 'no-drop'} : null }
          // disabled={ localState.get('error') ? true : false } 
        >
          { localState.get('proportional') ? 'Withdraw Everything' : 'Withdraw' }
       </Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  disabled,
  error,
  icon,
  onChange,
  symbol,
  value
}) => (
  <StyledInput>
    <TextField fullWidth 
      disabled={disabled}
      error={error}
      min="0"
      onChange={onChange}
      onKeyDown={e => { if (e.keyCode === 189) e.preventDefault() }}
      placeholder="0"
      type="number"
      value={value}
      InputProps={{
        endAdornment: <StyledEndAdornment>{symbol}</StyledEndAdornment>,
        startAdornment: (
          <StyledStartAdornment>
            <TokenIcon size={24}> <img src={icon} alt="" /> </TokenIcon>
          </StyledStartAdornment>
        )
      }}
    />
  </StyledInput>
)

export default StartModal