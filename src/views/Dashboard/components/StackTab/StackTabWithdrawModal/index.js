import React, {useContext, useEffect, useState} from 'react';
import Modal from '../../../../../components/Modal';
import ModalTitle from '../../../../../components/Modal/ModalTitle';
import ModalActions from '../../../../../components/Modal/ModalActions';
import {AmountInput} from '../../../../../components/AmountInput';
import Button from '../../../../../components/Button';
import BigNumber from 'bignumber.js';
import {ModalRow} from '../../../../../components/Modal/styled.js';
import {Devider} from '../../ShellTab/styled.js';

export function StackTabWithdrawModal({onDismiss, stack}) {
  const [withdrawValue, setWithdrawValue] = useState('0');
  const [error, setError] = useState('');

  const amountErrorMessage = 'Amount is greater than your wallet\'s balance';
  const allowanceErrorMessage = 'You must approve CMP-LP tokens';

  useEffect(() => {
    if (stack.balance && new BigNumber(withdrawValue.replace(/,/g,'')).gt(stack.balance.raw)) {
      setError(amountErrorMessage);
    } else {
      setError('');
    }
  }, [stack, withdrawValue]);

  function withdrawAction() {
    if (withdrawValue === stack.userLockedValue.display) stack.exit();
    else stack.withdraw(withdrawValue)
  }


  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Withdraw Funds</ModalTitle>
      <ModalRow>
        <AmountInput
          balance={stack.userLockedValue.display}
          icon={stack.icon}
          isError={ !!error }
          isAllowanceError={error === allowanceErrorMessage}
          helperText={ error }
          onChange={payload => setWithdrawValue(payload.value) }
          // styles={inputStyles}
          symbol={'CMP-LP'}
          value={withdrawValue}
          onUnlock={() => () => console.log('unlock')}
        />
      </ModalRow>
      <ModalActions>
        <Button fullWidth disabled={error} onClick={withdrawAction}>Withdraw</Button>
        <Devider />
        <Button fullWidth outlined onClick={onDismiss}>Cancel</Button>
      </ModalActions>
    </Modal>
  )
}
