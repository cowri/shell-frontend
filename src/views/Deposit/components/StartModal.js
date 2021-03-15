import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'
import { makeStyles, withTheme } from '@material-ui/core/styles'

import tinyShellIcon from '../../../assets/logo.png'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import NumberFormat from 'react-number-format'

import WarningModal from './WarningModal'

import { List } from 'immutable'

import BigNumber from 'bignumber.js'

const REVERTED = '3.963877391197344453575983046348115674221700746820753546331534351508065746944e+57'
const MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935'


const Devider = styled.div`
  width: 40px;
  flex-shrink: 0;
  @media screen and (max-width: 512px) {
    width: 20px;
  }
`

const StyledStartAdornment = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  margin: 0 10px;
`

const StyledEndAdornment = styled.div`
  padding-left: 6px;
  padding-right: 6px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  @media screen and (min-width: 512px) {
    font-size: inherit;
  }
  span {
    margin: 0 0 0 5px;
    line-height: 1em;
  }
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

const MaxAmount = styled.div`
  margin: 0 5px 0 auto;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const StyledRows = styled.div`
  margin-bottom: 24px;
`

const StyledLabelBar = withTheme(styled.div`
  align-items: center;
  display: flex;
  height: 32px;
  justify-content: space-between;
  max-width: 460px;
  margin: 0 auto;
`)

const StyledDepositMessage = styled.div`
  padding: 20px 10px 10px 10px;
  font-size: 22px;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  max-width: 460px;
  margin: 0 auto;
`;

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

  const SAFETY_CHECK = <span style={errorStyles}> These amounts trigger pool's Safety Check  </span>
  const DEFAULT = <span> Your rate on this deposit will be... </span>

  const [ inputs, setInputs ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ errors, setErrors ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ errorsAllowance, setErrorsAllowance ] = useState(new List(new Array(engine.shells[shellIx].assets.length).fill('')))
  const [ error, setError ] = useState(null)
  const [ zero, setZero ] = useState(true)
  const [ unlocking, setUnlocking ] = useState(null)
  const [ feeTip, setFeeTip ] = useState(DEFAULT)
  const [ prompting, setPrompting ] = useState(false)

  const onInput = (v, i) => {

    setInputs(inputs.set(i,v))

    v = engine.shells[shellIx].assets[i].getNumeraireFromDisplay(v)

    if (v.isGreaterThan(state.getIn([ 'shells', shellIx, 'assets', i, 'balance', 'numeraire' ]))) {

      setErrors(errors.set(i, 'Amount is greater than your wallet\'s balance'))

    } else if (v.isGreaterThan(state.getIn([ 'shells', shellIx, 'assets', i, 'allowance', 'numeraire' ]))) {

      setErrors(errors.set(i, 'Amount is greater than current allowance. Approve tokens first.'))
      setErrorsAllowance(errorsAllowance.set(i, true))

    } else {

      setErrors(errors.set(i, ''))
      setErrorsAllowance(errors.set(i, ''))

    }

  }

  useEffect( () => {

    const total = inputs.reduce( (a,c) => a + c )

    if (total === 0) {

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

    const shellsToMint = await engine.shells[shellIx].viewSelectiveDeposit(addresses, amounts)

    if (shellsToMint === false || shellsToMint.toString() === REVERTED) {

      setError(SAFETY_CHECK)
      setFeeTip(null)
      return

    }

    setError(null)

    const totalDeposit = amounts.reduce((a,c) =>  a.plus(c.numeraire), new BigNumber(0))

    const liqTotal = state.getIn([ 'shells', shellIx, 'shell', 'liquidityTotal', 'numeraire' ])
    const liquidityChange = totalDeposit.dividedBy(liqTotal)

    const shellsTotal = state.getIn([ 'shells', shellIx, 'shell', 'shellsTotal', 'numeraire' ])
    const shellsChange = shellsToMint.dividedBy(shellsTotal)

    const slippage = new BigNumber(1).minus(shellsChange.dividedBy(liquidityChange))

    const fee = shellsToMint.multipliedBy(slippage)

    const slippageMessage = slippage.absoluteValue().isGreaterThan(0.0001)
      ? slippage.isNegative()
        ? ( <span>
              and earn a rebalance subsidy of
              <span style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                <img alt="" src={tinyShellIcon} style={{ width: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
                {" "}{ Math.abs(fee.toFixed(8)) }
              </span>
            </span>
        ):( <span>
              and pay liquidity providers a fee of
              <span style={{ paddingLeft: '4px', paddingRight: '4px' }}>
                <img alt="" src={tinyShellIcon} style={{ width: '20px', display: 'inline-block', verticalAlign: 'middle' }} />
                {" "}{ fee.toFixed(8) }
              </span>
            </span>
        )
      : ''

    const feeMessage = <div>
      You will mint
        <span style={{paddingLeft: '4px', paddingRight: '4px' }}>
          <img alt=""
            src={tinyShellIcon}
            style={{ width: '20px', display: 'inline-block', verticalAlign: 'middle' }}
          />
          { ' ' + engine.shells[shellIx].getDisplayFromNumeraire(shellsToMint) }
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
    inputBase: { paddingLeft: '20px', fontSize: '20px', height: '60px' },
    helperText: {
      color: 'red',
      fontSize: '13px',
      marginLeft: '10px',
      position: 'absolute',
      top: '100%',
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
        isError={ !!errors.get(ix) }
        isAllowanceError={errorsAllowance.get(ix)}
        helperText={ errors.get(ix) }
        onAllowanceClick={ () => setUnlocking(ix) }
        onChange={payload => onInput(payload.value, ix) }
        styles={inputStyles}
        symbol={asset.symbol}
        value={inputs.get(ix)}
        onUnlock={() => onUnlock(ix, MAX)}
      />
    )

  })

  return (
    <Modal onDismiss={onDismiss}>
      { prompting && <WarningModal
          tag={engine.shells[shellIx].tag}
          onCancel={ () => setPrompting(false) }
          onContinue={handleSubmit} /> }
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
        <Button fullWidth outlined onClick={onDismiss}> Cancel </Button>
        <Devider />
        <Button
          fullWidth
          onClick={ () => setPrompting(true) }
          disabled={errors.filter((error) => error).size}
        >
          Deposit
        </Button>
      </ModalActions>
    </Modal>
  )
}

const TokenInput = ({
  balance,
  isError,
  isAllowanceError,
  icon,
  helperText,
  onChange,
  onAllowanceClick,
  styles,
  symbol,
  value,
  onUnlock,
}) => {

  return ( <>
    <StyledLabelBar style={{ marginTop: '18px', marginBottom: '0px' }} >
      <MaxAmount onClick={() => onChange({value: balance})}>
        Max:
        <span className="number"> {balance} </span>
      </MaxAmount>
    </StyledLabelBar>
    <InputContainer>
      <NumberFormat
        fullWidth
        allowNegative={false}
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
          className: styles.inputBase,
          style: isError ? { color: 'red' } : null,
          endAdornment: (
            <StyledEndAdornment>
              {isAllowanceError ? (
                <Button
                  small
                  withInput
                  onClick={onUnlock}
                >
                  Approve
                </Button>
              ) : balance !== value && balance != '0' ? (
                <Button
                  small
                  withInput
                  onClick={() => onChange({value: balance})}
                >
                  MAX
                </Button>
              ) : null}
              <TokenIcon size='24'> <img alt={symbol} src={icon} /> </TokenIcon>
              <span>{symbol}</span>
            </StyledEndAdornment>
          ),
        }}
      />
    </InputContainer>
  </>)
}


export default StartModal
