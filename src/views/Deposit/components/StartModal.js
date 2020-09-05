import React, { useState } from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, withTheme } from '@material-ui/core/styles'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'
import shellIcon from '../../../assets/cowri-logo.svg'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import BigNumber from 'bignumber.js'

const MAX_APPROVAL = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const ZERO = new BigNumber(0)

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

const StyledFeeMessage = styled.div`
  margin: 10px auto;
  width: 82.5%;
  font-size: 19px;
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

  function applyTips (val, ix) {
    
    let newLocalState = localState.setIn(['assets', ix, 'input'], val)

    setLocalState(newLocalState)

    console.log("...VAL", val)
    val = engine.assets[ix].getNumeraireFromDisplay(val)

    console.log("VAL", val)

    const allowance = state.get('assets').get(ix).get('allowance').get('numeraire')
    const balance = state.get('assets').get(ix).get('balance').get('numeraire')

    if (val.isGreaterThan(balance)) {

      newLocalState = newLocalState.setIn(['assets', ix, 'error'], 'Amount is greater than your wallet\'s balance')

    } else if (val.isGreaterThan(allowance)) {

      newLocalState = newLocalState.setIn(['assets', ix, 'error'], 'Amount is greater than Shell\'s allowance')

    } else {

      newLocalState = newLocalState.setIn(['assets', ix, 'error' ], '')

    }

    return newLocalState
    
  }

  // const availableDai = walletBalances.dai ? contracts.dai.getDisplayFromNumeraire(walletBalances.dai, 4) : '--'
  // const availableUsdc = walletBalances.usdc ? contracts.usdc.getDisplayFromNumeraire(walletBalances.usdc, 4) : '--'
  // const availableUsdt = walletBalances.usdt ? contracts.usdt.getDisplayFromNumeraire(walletBalances.usdt, 4) : '--'
  // const availableSusd = walletBalances.susd ? contracts.susd.getDisplayFromNumeraire(walletBalances.susd, 4) : '--'

  const primeDeposit = async (val, ix) => {

    console.log("val", val)

    if (isNaN(val)) return

    val = val === '' ? '' : Math.abs(+val)

    let newLocalState = applyTips(val, ix)

    const { addresses, amounts } = getAddressesAndAmounts(newLocalState)

    const shellsToMint = await engine.shell.viewSelectiveDeposit(addresses, amounts)

    if (shellsToMint === false) {

      return setLocalState(newLocalState
        .set('error', "Deposit triggers Shell's Safety Check")
        .delete('feeTip')
      )

    } else {

      newLocalState = newLocalState.delete('error')

      setLocalState(newLocalState)

    }

    const totalDeposit = amounts.reduce( (a, c, i) => a.plus(engine.assets[i].getNumeraireFromRaw(c)), new BigNumber(0) )

    const liquidityChange = totalDeposit.dividedBy(state.get('shell').get('totalLiq').get('numeraire'))

    const shellsChange = shellsToMint.dividedBy(state.get('shell').get('totalShells').get('numeraire'))

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))

    const slippageMessage = slippage.absoluteValue().isGreaterThan(0.0001)
      ? slippage.isNegative()
        ? <span> and earn a { Math.abs(slippage.toFixed(4)) } % rebalancing subsidy </span> 
        : <span> and pay a { slippage.toFixed(4) } % fee to liquidity providers </span>
      : ''
    
    const feeMessage = <div>
      You will mint 
        <span style={{position: 'relative', paddingRight: '17.5px'}}> 
          { engine.shell.getDisplayFromNumeraire(shellsToMint, 2) } 
          <img alt="" 
            src={shellIcon} 
            style={{position:'absolute', top:'0px', right: '5px', height: '20px' }} 
          /> 
        </span> 
      { slippageMessage }
    </div>

    setLocalState(newLocalState.set('feeTip', feeMessage))

  }

  const getAddressesAndAmounts = (currentState) => {

    const addresses = engine.assets.map( asset => asset.address )

    const amounts = engine.assets.map( (asset, ix) => {

      const input = currentState.get('assets').get(ix).get('input')

      return asset.getRawFromDisplay(input == '' ? 0 : input)

    })

    return { addresses, amounts }

  }

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const { addresses, amounts } = getAddressesAndAmounts(localState)

    console.log("addresses", addresses)
 

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
        // onUnlock={e => onUnlock('dai')}
        styles={inputStyles}
        symbol={asset.symbol}
        value={localState.get('assets').get(ix).get('input')}
      />
    )

  })

  const isInputError = localState.get('error') == '' ? true : localState.get('assets').reduce( (x,y) => x ? true : y.get('error') == '' ? false : true, false)
  // const isInputError = localState.get('assets').reduce( (x,y) => (console.log("x,y", x,y.get('error')), y.get('error') ? true : false), false)

  console.log("isInputError", isInputError)

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalContent>
        <StyledForm onSubmit={handleSubmit}>
          <StyledRows>
            { tokenInputs }
          </StyledRows>
          <StyledFeeMessage> { localState.get('feeTip') } </StyledFeeMessage>
        </StyledForm>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={onDismiss}>Cancel</Button>
        <Button disabled={ isInputError } style={{cursor: 'no-drop'}} onClick={handleSubmit}> Deposit </Button>
      </ModalActions>
      <Snackbar 
        anchorOrigin={{vertical: 'center', horizontal: 'center'}} 
        autoHideDuration={6000} 
        onClose={handleErrorSnackbarClose}
        style={{'marginTop': '65px'}}
        open={localState.get('error') ? true : false} 
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