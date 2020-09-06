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

const StyledFeeMessage = styled.div`
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

    const addresses = engine.assets.map( asset => asset.address )

    const amounts = engine.assets.map( (asset, ix) => {

      const input = currentState.get('assets').get(ix).get('input')

      return asset.getRawFromDisplay(input == '' ? 0 : input)

    })

    return { addresses, amounts }

  }

  const primeProportionalWithdraw = (yes) => {

    if (yes) {

      const shells = (
        <span style={{position: 'relative', paddingRight: '17.5px'}}> 
          { state.getIn([ 'shell', 'shells', 'display' ])} 
          <img alt=""
            src={tinyShellIcon} 
            style={{position:'absolute', top:'2.5px', right: '5px', height: '20px' }} 
          /> 
        </span>
      )
      
      setLocalState(localState
        .update('assets', as => as.map( (a, ix) => {
          a.set('input', state.getIn([ 'assets', ix, 'balanceInShell', 'display']))
        }))
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

    const { 
      addresses,
      amounts
    } = getAddressesAndAmounts(newLocalState)

    const sum = amounts.reduce((accu, val) => accu.plus(val), new BigNumber(0))

    if (sum.isZero()) return setLocalState(newLocalState.set('feeTip', 'Your rate for this withdrawal will be...'))

    const shellsToBurn = await engine.shell.viewSelectiveWithdraw(addresses, amounts)

    if (shellsToBurn === false) {

      return setLocalState(newLocalState
        .set('error', 'This withdrawal triggers Shell\'s Safety Check')
        .set('feeTip', 'Your rate for this withdrawal will be...')
      )

    } else if (shellsToBurn.isGreaterThan(state.getIn(['shell', 'shells', 'raw']))) {

      const shellBalance = state.getIn([ 'shell', 'shells', 'display' ])

      return setLocalState(newLocalState
        .set('error', 'Withdraw exceeds balance')
        .set('feeTip', 'You can not withdraw more than your ' + shellBalance + ' Shell balance'))

    } else {

      newLocalState = newLocalState.set('error', '')

    }

    const totalWithdraw = amounts.reduce( (a,c,i) => a.plus(engine.assets[i].getNumeraireFromRaw(c)), new BigNumber(0))

    const liquidityChange = totalWithdraw.dividedBy(state.getIn(['shell', 'totalLiq', 'numeraire']))

    const shellsChange = shellsToBurn.dividedBy(state.getIn(['shell', 'totalShells', 'numeraire']))

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange)).multipliedBy(100)

    const slippageMessage = slippage.isNegative()
      ? <span> and pay a { Math.abs(slippage.toFixed(4)) }% fee to liquidity providers </span>
      : <span> and earn a { slippage.toFixed(4) }% rebalancing subsidy </span>

    const shells = <div>
      You will burn 
      <span style={{position: 'relative', paddingRight: '17.5px'}}> 
        { engine.shell.getDisplayFromNumeraire(shellsToBurn, 2) }
        <img alt="" src={tinyShellIcon} style={{position:'absolute', top:'2.5px', right: '5px', height: '20px' }} /> 
      </span>
      { slippageMessage }
      for this withdrawal
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
        symbol="DAI"
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
            <StyledFeeMessage> { localState.get('feeTip') } </StyledFeeMessage>
            { tokenInputs }
            {/* <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={daiIcon}
              onChange={e => handleInput(e, 'dai', setDaiInputAmt) }
              symbol="DAI"
              value={daiInputAmt}
            />
            <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={usdcIcon}
              onChange={e => handleInput(e, 'usdc', setUsdcInputAmt) }
              symbol="USDC"
              value={usdcInputAmt}
            />
            <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={usdtIcon}
              onChange={e => handleInput(e, 'usdt', setUsdtInputAmt) }
              symbol="USDT"
              value={usdtInputAmt}
            />
            <TokenInput
              disabled={withdrawEverything}
              error={!!error.length}
              icon={susdIcon}
              onChange={e => handleInput(e, 'susd', setSusdInputAmt) }
              symbol="SUSD"
              value={susdInputAmt}
            /> */}
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
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Tooltip placement={'top'} title={ localState.get('error') } style={ localState.get('error') ? { cursor: 'no-drop'} : null }>
          <div>
            <Button disabled={ localState.get('error') ? true : false } onClick={handleSubmit}>{ localState.get('proportional') ? 'Withdraw Everything' : 'Withdraw' } </Button>
          </div>
        </Tooltip>
      </ModalActions>
      <Snackbar 
        anchorOrigin={{vertical: 'center', horizontal: 'center'}} 
        autoHideDuration={6000} 
        onClose={handleErrorSnackbarClose}
        style={{'marginTop': '65px'}}
        open={!!localState.get('error').length} 
      >
        <MuiAlert 
          elevation={6}
          onClose={handleErrorSnackbarClose}   
          severity={'error'} 
          variant="filled"
        >
          { localState.get('error') }
        </MuiAlert>
      </Snackbar>
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