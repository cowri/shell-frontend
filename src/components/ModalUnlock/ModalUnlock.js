
import React, { useState } from 'react'
import styled from 'styled-components'
import { makeStyles, withTheme } from '@material-ui/core/styles'
import Checkbox from "@material-ui/core/Checkbox"
import TextField from '@material-ui/core/TextField'
import NumberFormat from 'react-number-format'

import Button from '../Button'
import Modal from '../Modal'
import ModalActions from '../ModalActions'

import BigNumber from 'bignumber.js'

const MAX = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const ModalContent = withTheme(styled.div`
  flex: 1;
  padding: 0px 40px 20px;
  margin-top: -10px;
  font-size: 24px;
`)

const ModalTitle = withTheme(styled.div`
  font-size: 1.75rem;
  margin-bottom: 6px;
  margin-top: 24px;
  padding: 0 24px;
`)

const UnlimitedCheckbox = styled.div`
  position: relative;
  height: 25px;
  padding: 20px;
  & .MuiIconButton-root {
    position: relative;
    top: 0px;
    right: 0px;
  }
`

const ModalUnlock = ({
  coin,
  handleUnlock,
  handleCancel
}) => {
  
  const [ amount, setAmount ] = useState('')
  const [ unlimited, setUnlimited ] = useState(false)
  
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
  
  const decimals = coin.get('decimals')
  
  let current = coin.getIn(['allowance', 'numeraire'])
  
  if ( current.isGreaterThan(new BigNumber('100000000'))) {
    current = '100,000,000+'
  } else if ( current.isGreaterThan(new BigNumber(10000000))) {
    current = current.toExponential()
  } else {
    current = coin.getIn(['allowance', 'display'])
  }

  return (
    <Modal>
      <ModalTitle> Unlock { coin.get('symbol') } </ModalTitle>
      <ModalContent>
        <p> Shell's current allowance is { current } </p>
        <NumberFormat
          value={ unlimited ? MAX : amount }
          disabled={ unlimited }
          inputMode={ "numeric" }
          inputProps={{style: { fontSize: '22px', textAlign: 'center' } } }
          customInput={TextField}
          prefix={'$'}
          type="text"
          thousandSeparator={true}
          onValueChange={ payload => setAmount(payload.value) }
        />
        <UnlimitedCheckbox>
          <Checkbox 
            checked={ unlimited }
            className={ checkboxClasses.root }
            onChange={ () => ( setAmount(''), setUnlimited(!unlimited) ) }
          />
          Unlimited Approval
        </UnlimitedCheckbox>
      </ModalContent>
      <ModalActions>
        <Button outlined onClick={ handleCancel }> Cancel </Button>
        <Button onClick={ () => handleUnlock(unlimited ? amount : new BigNumber(amount).multipliedBy(new BigNumber(10 ** decimals )).toFixed()) }> Continue </Button>
      </ModalActions>
    </Modal>
  )

}

export default ModalUnlock
