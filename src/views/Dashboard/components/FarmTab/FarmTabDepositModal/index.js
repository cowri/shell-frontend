import React, {useEffect, useState} from 'react';
import Modal from '../../../../../components/Modal';
import ModalTitle from '../../../../../components/Modal/ModalTitle';
import ModalActions from '../../../../../components/Modal/ModalActions';
import {AmountInput} from '../../../../../components/AmountInput';
import Button from '../../../../../components/Button';
import {ModalRow} from '../../../../../components/Modal/styled.js';
import {Devider} from '../../ShellTab/styled.js';
import BN from '../../../../../utils/BN.js'
import {currentTxStore} from '../../../../../store/currentTxStore.js';

export function FarmTabDepositModal({onDismiss, farm, setTx}) {
  const [depositValue, setDepositValue] = useState('0');
  const [error, setError] = useState('');

  const amountErrorMessage = 'Amount is greater than wallet balance';
  const allowanceErrorMessage = 'Approval required';

  useEffect(() => {
    if (farm.balance && BN(depositValue.replace(/,/g,'')).gt(farm.balance.raw)) {
      setError(amountErrorMessage);
    } else if (BN(depositValue).gt(farm.allowance.raw)) {
      setError(allowanceErrorMessage);
    } else {
      setError('');
    }
  }, [farm, depositValue]);

  function depositAction() {
    currentTxStore.setCurrentTx(() => farm.deposit, depositValue)
    onDismiss();
  }


  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Deposit Funds</ModalTitle>
      <ModalRow>
        <AmountInput
          balance={farm.underlyingBalance.numeraire.toFixed(4)}
          isError={ !!error }
          isAllowanceError={error === allowanceErrorMessage}
          helperText={ error }
          onChange={payload => setDepositValue(payload.value) }
          symbol={farm.name.includes('CMP') ? farm.name :'CMP-LP'}
          value={depositValue}
          onUnlock={() => farm.approve()}
        />
      </ModalRow>
      <ModalActions>
        <Button fullWidth disabled={error} onClick={depositAction}>Deposit</Button>
        <Devider />
        <Button fullWidth outlined onClick={onDismiss}>Cancel</Button>
      </ModalActions>
    </Modal>
  )
}
