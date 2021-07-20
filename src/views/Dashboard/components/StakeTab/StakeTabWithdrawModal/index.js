import React, {useEffect, useState} from 'react';
import Modal from '../../../../../components/Modal';
import ModalTitle from '../../../../../components/Modal/ModalTitle';
import ModalActions from '../../../../../components/Modal/ModalActions';
import {AmountInput} from '../../../../../components/AmountInput';
import Button from '../../../../../components/Button';
import BigNumber from 'bignumber.js';
import {ModalRow} from '../../../../../components/Modal/styled.js';
import {Devider} from '../../ShellTab/styled.js';

export function StakeTabWithdrawModal({onDismiss, stake}) {
  const [withdrawValue, setWithdrawValue] = useState('0');
  const [error, setError] = useState('');

  const amountErrorMessage = 'Amount is greater than your wallet\'s balance';
  const allowanceErrorMessage = 'You must approve CMP-LP tokens';

  useEffect(() => {
    if (stake.balance && new BigNumber(withdrawValue.replace(/,/g,'')).gt(stake.balance.raw)) {
      setError(amountErrorMessage);
    } else {
      setError('');
    }
  }, [stake, withdrawValue]);

  function withdrawAction() {
    if (withdrawValue === stake.userLockedValue.display) stake.exit();
    else stake.withdraw(withdrawValue)
  }


  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Withdraw Funds</ModalTitle>
      <ModalRow>
        <AmountInput
          balance={stake.userLockedValue.display}
          icon={stake.icon}
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
