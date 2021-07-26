import React, {useEffect, useState} from 'react';
import Modal from '../../../../../components/Modal';
import ModalTitle from '../../../../../components/Modal/ModalTitle';
import ModalActions from '../../../../../components/Modal/ModalActions';
import {AmountInput} from '../../../../../components/AmountInput';
import Button from '../../../../../components/Button';
import {ModalRow} from '../../../../../components/Modal/styled.js';
import {Devider} from '../../ShellTab/styled.js';
import BN from '../../../../../utils/BN.js';

export function FarmTabWithdrawModal({onDismiss, farm}) {
  const [withdrawValue, setWithdrawValue] = useState('0');
  const [error, setError] = useState('');

  const amountErrorMessage = 'Amount is greater than wallet balance';

  useEffect(() => {
    if (farm.balance && BN(withdrawValue.replace(/,/g,'')).gt(farm.balance.raw)) {
      setError(amountErrorMessage);
    } else {
      setError('');
    }
  }, [farm, withdrawValue]);

  function withdrawAction() {
    if (withdrawValue === farm.userLockedValue.display) farm.exit();
    else farm.withdraw(withdrawValue)
  }


  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Withdraw Funds</ModalTitle>
      <ModalRow>
        <AmountInput
          balance={farm.userLockedValue.display}
          icon={farm.icon}
          isError={ !!error }
          isAllowanceError={false}
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
