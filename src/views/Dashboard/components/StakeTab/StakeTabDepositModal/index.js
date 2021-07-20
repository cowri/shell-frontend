import React, {useEffect, useState} from 'react';
import Modal from '../../../../../components/Modal';
import ModalTitle from '../../../../../components/Modal/ModalTitle';
import ModalActions from '../../../../../components/Modal/ModalActions';
import {AmountInput} from '../../../../../components/AmountInput';
import Button from '../../../../../components/Button';
import BigNumber from 'bignumber.js';
import {ModalRow} from '../../../../../components/Modal/styled.js';
import {Devider} from '../../ShellTab/styled.js';

export function StakeTabDepositModal({onDismiss, stake}) {
  const [depositValue, setDepositValue] = useState('0');
  const [error, setError] = useState('');

  const amountErrorMessage = 'Amount is greater than your wallet\'s balance';
  const allowanceErrorMessage = 'You must approve CMP-LP tokens';

  useEffect(() => {
    if (stake.balance && new BigNumber(depositValue.replace(/,/g,'')).gt(stake.balance.raw)) {
      setError(amountErrorMessage);
    } else if (new BigNumber(depositValue).gt(stake.allowance.raw)) {
      setError(allowanceErrorMessage);
    } else {
      setError('');
    }
  }, [stake, depositValue]);


  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalRow>
        <AmountInput
          balance={stake.underlyingBalance.numeraire.toString()}
          isError={ !!error }
          isAllowanceError={error === allowanceErrorMessage}
          helperText={ error }
          onChange={payload => setDepositValue(payload.value) }
          symbol={'CMP-LP'}
          value={depositValue}
          onUnlock={() => stake.approve()}
        />
      </ModalRow>
      <ModalActions>
        <Button fullWidth disabled={error} onClick={() => stake.deposit(depositValue)}>Deposit</Button>
        <Devider />
        <Button fullWidth outlined onClick={onDismiss}>Cancel</Button>
      </ModalActions>
    </Modal>
  )
}
