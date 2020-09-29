import React, { useState } from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField'
import { makeStyles, withTheme } from '@material-ui/core/styles'

import shellIcon from '../../../assets/cowri-logo.svg'
import tinyShellIcon from '../../../assets/shell_icon_24.svg'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import WarningModal from './WarningModal'

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
  localState,
  onDeposit,
  onDismiss,
  onUnlock,
  setLocalState,
  state
}) => {
  
  const errorStyles = {
    color: 'red',
    fontSize: '26px',
    fontWeight: 'bold'
  }
  
  const SAFETY_CHECK = <span style={errorStyles}> These amounts trigger Shell's Safety Check  </span>

  function applyTips (val, ix) {
    
    let newLocalState = localState.setIn(['assets', ix, 'input'], val)

    setLocalState(newLocalState)

    val = engine.assets[ix].getNumeraireFromDisplay(val)

    const allowance = state.getIn([ 'assets', ix, 'allowance', 'numeraire' ])

    const balance = state.getIn([ 'assets', ix, 'balance', 'numeraire' ])

    if (val.isGreaterThan(balance)) {

      newLocalState = newLocalState.setIn(['assets', ix, 'error'], 'Amount is greater than your wallet\'s balance')

    } else if (val.isGreaterThan(allowance)) {

      newLocalState = newLocalState.setIn(['assets', ix, 'error'], 'Amount is greater than Shell\'s allowance')

    } else {

      newLocalState = newLocalState.setIn(['assets', ix, 'error' ], '')

    }

    return newLocalState
    
  }

  const primeDeposit = async (val, ix) => {

    if (isNaN(val)) return

    val = val === '' ? '' : Math.abs(+val)

    let newLocalState = applyTips(val, ix)

    const { addresses, amounts } = getAddressesAndAmounts(newLocalState)
    
    const totalDeposit = amounts.reduce( (a, c, i) => {

      const asset = engine.assets[engine.derivativeIx[addresses[i]]]

      return a.plus(asset.getNumeraireFromRaw(c))

    }, new BigNumber(0))

    if (totalDeposit.isZero()) {

      return setLocalState(newLocalState
        .set('feeTip', 'Your rate on this deposit will be...')
        .set('zero', true)
        .delete('error')
      )

    } else {

      newLocalState = newLocalState.set('zero', false)

    }

    const shellsToMint = await engine.shell.viewSelectiveDeposit(addresses, amounts)
    
    if (shellsToMint === false || shellsToMint.toString() === REVERTED) {

      return setLocalState(newLocalState
        .set('error', SAFETY_CHECK)
        .delete('feeTip')
      )

    } else {

      newLocalState = newLocalState.delete('error')

    }

    const liquidityChange = totalDeposit.dividedBy(state.getIn([ 'shell', 'totalLiq', 'numeraire' ]))

    const shellsChange = shellsToMint.dividedBy(state.getIn([ 'shell', 'totalShells', 'numeraire' ]))

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))

    const slippageMessage = slippage.absoluteValue().isGreaterThan(0.0001)
      ? slippage.isNegative()
        ? <span> and earn a { Math.abs(slippage.toFixed(4)) }% rebalancing subsidy </span> 
        : <span> and pay a { slippage.toFixed(4) }% fee to liquidity providers </span>
      : ''
    
    const feeMessage = <div>
      You will mint 
        <span style={{position: 'relative', paddingLeft: '16.5px'}}>
          <img alt="" 
            src={tinyShellIcon} 
            style={{position:'absolute', top:'1px', left: '0px' }} 
          /> 
          { ' ' + engine.shell.getDisplayFromNumeraire(shellsToMint, 2) } 
        </span> 
      { slippageMessage }
    </div>

    setLocalState(newLocalState.set('feeTip', feeMessage))

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

  const handleSubmit = (e) => {
    
    const { addresses, amounts } = getAddressesAndAmounts(localState)

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
    const localAssetState = localState.get('assets').get(ix)

    return (
      <TokenInput
        available={assetState.get('balance').get('display')}
        icon={asset.icon}
        isError={ localAssetState.get('error') ? true : false }
        helperText={localAssetState.get('error')}
        locked={assetState.get('allowance').get('raw').isZero()}
        onChange={e => primeDeposit(e.target.value, ix)}
        onUnlock={e => onUnlock(ix) }
        styles={inputStyles}
        symbol={asset.symbol}
        value={localState.get('assets').get(ix).get('input')}
      />
    )

  })

  const isInputError = localState.has('error') 
    ? true 
    : localState.get('assets').reduce( (x,y) => x ? true : y.get('error') == '' ? false : true, false)

  return (
    <Modal onDismiss={onDismiss}>
      {
        localState.get('prompting') && (
          <WarningModal 
            onCancel={() => setLocalState(localState.delete('prompting')) } 
            onContinue={handleSubmit} 
          />
        )
      }
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={ () => setLocalState(localState.set('prompting', true))}>
          <StyledRows>
            <StyledDepositMessage> { localState.get('error') || localState.get('feeTip') } </StyledDepositMessage>
            { tokenInputs }
          </StyledRows>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Button disabled={ isInputError || localState.get('zero') } style={{cursor: 'no-drop'}} onClick={() => setLocalState(localState.set('prompting', true))}> Deposit </Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  available,
  isError,
  icon,
  helperText,
  locked,
  onChange,
  onUnlock,
  styles,
  symbol,
  unlocking,
  value
}) => {

  return ( <>
    
    
    <StyledLabelBar>
      <span>  Shell's allowance:
        <span class="number"> ${available} </span>
      </span> 
    </StyledLabelBar>
    <TextField fullWidth
      defaultColor="red"
      disabled={locked}
      error={isError}
      
      FormHelperTextProps={{className: styles.helperText}}
      helperText={helperText}
      onChange={onChange}
      placeholder="0"
      type="number"
      value={value}
      onKeyDown={e => { if (e.keyCode === 189) e.preventDefault() }}
      InputProps={{
        style: isError ? { color: 'red' } : null,
        min: "0",
        endAdornment: locked ? (
          <div style={{ marginRight: 6 }}>
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
          </div>
        ) : (
          <StyledEndAdornment>{symbol}</StyledEndAdornment>
        ),
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