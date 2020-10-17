import React from 'react'
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

import BigNumber from 'bignumber.js'

const REVERTED = '3.963877391197344453575983046348115674221700746820753546331534351508065746944e+57'

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

const ONE = new BigNumber(1)

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

  const handleSubmit = (e) => {
    
    e.preventDefault()

    if (localState.get('proportional')) {
      
      const totalShells = state.getIn([ 'shell', 'shellsTotal', 'raw' ])
      
      onProportionalWithdraw(totalShells)

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

        amounts.push(asset.getAllFormatsFromDisplay(amount)) 

      }

    })

    return { addresses, amounts }

  }

  const primeProportionalWithdraw = (yes) => {

    if (yes) {

      const fee = engine.shell.getDisplayFromNumeraire(
        engine.shell.epsilon.multipliedBy(100)
      )
      
      const feeMessage = <div>
        You will burn
        <span style={{ position: 'relative', paddingLeft: '16.5px' }}> 
          <img alt=""
            src={tinyShellIcon} 
            style={{position:'absolute', top:'1px', left: '0px' }} 
          /> 
          { ' ' + state.getIn([ 'shell', 'shellsTotal', 'display' ]) } 
        </span>
        <span> and pay a {fee}% fee to liquidity providers for this withdrawal </span>
      </div>


      setLocalState(localState
        .update('assets', assets => { 
          return assets.map( (asset, ix) => {
            let amount = state.getIn(['assets', ix, 'liquidityOwned', 'numeraire'])
            amount = amount.multipliedBy(ONE.minus(engine.shell.epsilon))
            amount = engine.shell.getDisplayFromNumeraire(amount)
            console.log("amount", amount)
            return asset.set('input', amount)
          })
        })
        .set('feeTip', feeMessage)
        .set('proportional', true)
        .delete('zero')
      )

    } else {

      setLocalState(localState
        .update('assets', as => as.map( a => a.set('input', '')))
        .set('feeTip', 'Your rate on this withdrawal will be...')
        .set('proportional', false)
        .set('zero', true)
      )

    }

  }

  const primeWithdraw = async (val, ix) => {

    if (isNaN(val)) return

    val = val === '' ? '' : Math.abs(+val)

    let newLocalState = localState.setIn(['assets', ix, 'input'], val)

    const { addresses, amounts } = getAddressesAndAmounts(newLocalState)
    
    console.log("addresses", addresses)
    console.log("amounts", amounts)

    const totalWithdraw = amounts.reduce( (accu, curr, i) => {
      console.log("engine.derivative ix",engine.derivativeIx[addresses[i]])

      const asset = engine.derivatives[engine.derivativeIx[addresses[i]]]

      return accu.plus(curr.numeraire)

    }, new BigNumber(0))

    if (totalWithdraw.isZero()) {
      
      return setLocalState(newLocalState
        .set('feeTip', 'Your rate for this withdrawal will be...')
        .set('zero', true)
        .delete('error')
      )

    } else {
      
      newLocalState = newLocalState.set('zero', false)
      
    }

    const shellsToBurn = await engine.shell.viewSelectiveWithdraw(addresses, amounts)
    
    if (shellsToBurn === false || shellsToBurn.toString() == REVERTED) {

      return setLocalState(newLocalState
        .set('error', SAFETY_CHECK)
        .delete('feeTip')
      )

    } else if (shellsToBurn.isGreaterThan(state.getIn(['shell', 'shellsTotal', 'numeraire']))) {

      return setLocalState(newLocalState
        .set('error', EXCEEDS_BALANCE)
        .delete('feeTip')
      )

    } else {

      newLocalState = newLocalState.delete('error')

    }

    const liquidityChange = totalWithdraw.dividedBy(state.getIn(['shell', 'liquidityTotal', 'numeraire']))

    const shellsChange = shellsToBurn.dividedBy(state.getIn(['shell', 'shellsTotal', 'numeraire']))

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))
    
    const fee = shellsToBurn.multipliedBy(slippage)
    
    const slippageMessage = slippage.isNegative()
      ? ( <span> 
            and pay a liquidity provider fee of 
            <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
              <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
              { Math.abs(fee.toFixed(4)) } 
            </span>
          </span>
      ) : ( <span > 
            and earn a rebalancing subsidy of 
            <span style={{ position: 'relative', paddingLeft: '23px', paddingRight: '4px' }}>
              <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '1px' }} /> 
              { fee.toFixed(4) } 
            </span>
          </span> 
        )

    const shells = <div>
      You will burn 
      <span style={{position: 'relative', paddingLeft: '16.5px', paddingRight: '4px' }}> 
        <img alt="" src={tinyShellIcon} style={{ position:'absolute', top:'1px', left: '0px' }} /> 
        { ' ' + engine.shell.getDisplayFromNumeraire(shellsToBurn, 2) }
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
                <StyledShellBalance> { state.getIn([ 'shell', 'shellsTotal', 'display' ]) + ' Shells'} </StyledShellBalance>
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
          disabled={ localState.get('error') || localState.get('zero') } 
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