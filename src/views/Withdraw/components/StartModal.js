import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles'

import shellIcon from '../../../assets/logo.png'

import tinyShellIcon from '../../../assets/logo.png'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import NumberFormat from 'react-number-format'

import { List } from 'immutable'

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
    top: 0;
    right: 0;
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

  const SAFETY_CHECK = <span style={errorStyles}> These amounts trigger pool's Safety Check  </span>
  const EXCEEDS_BALANCE = <span style={errorStyles}> This withdrawal exceeds your LP balance </span>
  const DEFAULT = <span> Your rate for this withdrawal will be... </span>

  const [ inputs, setInputs ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ errors, setErrors ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ feeTip, setFeeTip ] = useState(DEFAULT)
  const [ proportional, setProportional ] = useState(false)
  const [ zero, setZero ] = useState(true)
  const [ error, setError ] = useState(null)

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
      if (0 < v) {
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
          <span style={{ paddingLeft: '16.5px' }}>
            <img alt=""
              src={tinyShellIcon}
              style={{ width: '20px', display: 'inline-block', verticalAlign: 'middle' }}
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

    } else {

      setInputs(inputs.map( () => '' ))
      setErrors(errors.map ( () => null ))
      setFeeTip(DEFAULT)
      setProportional(false)
      setZero(true)

    }

  }

  const onInput = (v, i) => {

    const updatedInputs = inputs.set(i,v)

    setInputs(updatedInputs)

    const total = updatedInputs.reduce( (a,c) => a + c )

    if (total === 0) {

      setZero(true)
      setError(null)
      setFeeTip(DEFAULT)

    }

  }

  const primeWithdraw = async () => {

    if (zero) return

    const { addresses, amounts } = getAddressesAndAmounts()

    const totalWithdraw = amounts.reduce( (a, c) => a.plus(c.numeraire), new BigNumber(0) )

    const shellsToBurn = await engine.shells[shellIx].viewSelectiveWithdraw(addresses, amounts)

    if (shellsToBurn === false || shellsToBurn.toString() === REVERTED) {

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

    const fee = shellsToBurn.multipliedBy(slippage)

    const slippageMessage = slippage.isNegative()
      ? ( <span>
            and pay a liquidity provider fee of
            <span style={{ paddingLeft: '23px', paddingRight: '4px' }}>
              <img alt="" src={tinyShellIcon} style={{ width: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
              &nbsp;{ isNaN(fee.toFixed(8)) ? '0.00' : Math.abs(fee.toFixed(8)) }
            </span>
          </span>
      ) : ( <span >
            and earn a rebalancing subsidy of
            <span style={{ paddingLeft: '23px', paddingRight: '4px' }}>
              <img alt="" src={tinyShellIcon} style={{ width: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
              &nbsp;{ isNaN(fee.toFixed(8)) ? '0.00' : fee.toFixed(8) }
            </span>
          </span>
        )

    const shells = (
      <div>
        You will burn
        <span style={{ paddingLeft: '16.5px', paddingRight: '4px' }}>
          <img alt="" src={tinyShellIcon} style={{ width: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
          &nbsp;{ ' ' + engine.shells[shellIx].getDisplayFromNumeraire(shellsToBurn) }
        </span>
        { slippageMessage }
      </div>
    )

    setFeeTip(shells)
    setError(null)

  }

  useEffect( () => {

    const total = inputs.reduce( (a,c) => a + c )

    if (total === 0) {

      setZero(true)
      setError(null)
      setFeeTip(DEFAULT)

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
        onChange={ payload => onInput(payload.value, ix) }
        symbol={asset.symbol}
        value={inputs.get(ix)}
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
                <StyledShellBalance> { state.getIn([ 'shells', shellIx, 'shell', 'shellsOwned', 'display' ]) + ' LP tokens'} </StyledShellBalance>
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
  onChange,
  symbol,
  value
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
  </StyledInput>
)

export default StartModal
