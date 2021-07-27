import React, {useContext, useEffect, useState} from 'react';
import ModalConfirm from '../Modal/ModalConfirm';
import DashboardContext from '../../views/Dashboard/context.js';
import ModalTx from '../Modal/ModalAwaitingTx/ModalAwaitingTx.js';
import ModalSuccess from '../Modal/ModalSuccess';
import ModalError from '../Modal/ModalError';
import useSubject from '../../hooks/useSubject.js';
import {currentTxStore} from '../../store/currentTxStore.js';
import AwaitingTxModal from '../Modal/ModalAwaitingTx/ModalAwaitingTx.js';

export function StatusModals({tx}) {
  const [step, setStep] = useState()
  const [txHash, setTxHash] = useState('')
  const value = useSubject(currentTxStore.currentTxValue)

  const {
    engine,
    state
  } = useContext(DashboardContext)

  useEffect(() => {
    setStep('confirming')
    tx(onTxHash, onConfirmation, onError, value)
  }, [])

  function onTxHash (hash) {
    setTxHash(hash)
    setStep('broadcasting')
  }

  function onConfirmation() {
    engine.sync();
    setStep('success');
  }

  function onError() {
    setStep('error');
  }

  return (
    <>
      { step === 'confirming' && <ModalConfirm wallet={engine.wallet} /> }
      { step === 'broadcasting' && <AwaitingTxModal txHash={txHash} /> }
      { step === 'success' && <ModalSuccess
        buttonBlurb={'Finish'}
        txHash={txHash}
        onDismiss={() => {setStep('none'); currentTxStore.setCurrentTx(null)}}
        title={'Swap Successful.'}
      /> }
      { step === 'error' && <ModalError
        buttonBlurb={'Finish'}
        onDismiss={() => {setStep('none'); currentTxStore.setCurrentTx(null)}}
        title={'An error occurred.'}
      /> }
    </>
  )
}
