import React, {useContext, useEffect, useState} from 'react';
import Modal from '../../../../../components/Modal';
import ModalTitle from '../../../../../components/Modal/ModalTitle';
import ModalActions from '../../../../../components/Modal/ModalActions';
import {AmountInput} from '../../../../../components/AmountInput';
import Button from '../../../../../components/Button';
import BigNumber from 'bignumber.js';
import {ModalRow} from '../../../../../components/Modal/styled.js';

export function StackTabDepositModal({onDismiss, stack}) {
  const [depositValue, setDepositValue] = useState('0');
  const [error, setError] = useState('');

  const amountErrorMessage = 'Amount is greater than your wallet\'s balance';
  const allowanceErrorMessage = 'You must approve CMP-LP tokens';

  useEffect(() => {
    if (stack.balance && new BigNumber(depositValue.replace(/,/g,'')).gt(stack.balance.raw)) {
      setError(amountErrorMessage);
    } else if (new BigNumber(depositValue).gt(stack.allowance.raw)) {
      setError(allowanceErrorMessage);
    } else {
      setError('');
    }
  }, [stack, depositValue]);


  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalRow>
        <AmountInput
          balance={stack.underlyingBalance.display.toString()}
          // icon={asset.icon}
          isError={ !!error }
          isAllowanceError={error === allowanceErrorMessage}
          helperText={ error }
          onChange={payload => setDepositValue(payload.value) }
          // styles={inputStyles}
          symbol={'CMP-LP'}
          value={depositValue}
          onUnlock={() => stack.approve()}
        />
      </ModalRow>
      <ModalActions>
        <Button fullWidth disabled={error} onClick={() => stack.deposit(depositValue)}>Deposit</Button>
        <Button fullWidth outlined onClick={onDismiss}>Cancel</Button>
      </ModalActions>
    </Modal>
  )
}
