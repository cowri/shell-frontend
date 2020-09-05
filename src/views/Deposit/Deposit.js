import React, { useContext, useState } from 'react'

import ModalConfirmMetamask from '../../components/ModalConfirmMetamask'
import DepositingModal from '../../components/ModalAwaitingTx'
import UnlockingModal from '../../components/ModalAwaitingTx'

import DashboardContext from '../Dashboard/context'

import ModalError from '../../components/ModalError'
import StartModal from './components/StartModal'
import ModalSuccess from '../../components/ModalSuccess'

import { fromJS } from 'immutable'
import BigNumber from 'bignumber.js'

const MAX_APPROVAL = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const ZERO = new BigNumber(0)

const Deposit = ({
    onDismiss
}) => {
  const { 
    engine,
    state
  } = useContext(DashboardContext)

  const [txHash, setTxHash] = useState('')
  const [step, setStep] = useState('start')
  const [localState, setLocalState] = useState(fromJS({
    assets: new Array(engine.assets.length).fill({
      error: false,
      input: ''
    }),
    error: '',
    feeTip: '',
    balTip: '',
  }))

  const handleDeposit = async (addresses, amounts) => {

    setLocalState(localState
      .delete('error')
      .set('step', 'confirmingMetamask')
    )

    engine.selectiveDeposit(
      addresses,
      amounts,
      (hash) => {
        setTxHash(hash)
        setStep('depositing')
      },
      () => {
        setStep('deposit-success')
        setLocalState(localState
          .delete('fee')
          .update('assets', assets => assets.map(asset => asset.set('input', ''))))
      },
      () => {
        setStep('error')
        setLocalState(localState
          .delete('fee')
          .update('assets', assets => assets.map(asset => asset.set('input', ''))))
      }
    )

  }

  const handleUnlock = async (index) => {

    setLocalState(localState.set('step', 'confirmingMetamask'))

    engine.unlock(
      index,
      MAX_APPROVAL,
      (hash) => {
        setStep('unlocking')
        setTxHash(hash)
      },
      () => setStep('unlocking-success'),
      () => setStep('error')
    )

  }

  const dismissSubmodal = () => {

    setTxHash('')
    setStep('start')

  }

  return (
    <>

      {step === 'start' && (
        <StartModal
          engine={engine}
          localState={localState}
          onDeposit={handleDeposit}
          onUnlock={handleUnlock}
          onDismiss={onDismiss}
          setLocalState={setLocalState}
          state={state}
        />
      )}

      {step === 'confirmingMetamask' && (
        <ModalConfirmMetamask />
      )}

      {step === 'depositing' && (
        <DepositingModal />
      )}

      {step === 'unlocking' && (
        <UnlockingModal txHash={txHash}/>
      )}

      {step === 'deposit-success' && (
        <ModalSuccess buttonBlurb={'Finish'} onDismiss={dismissSubmodal} title={'Deposit Successful.'} txHash={txHash} />
      )}

      {step === 'unlocking-success' && (
        <ModalSuccess buttonBlurb={'Finish'} onDismiss={dismissSubmodal} title={'Approval Successful.'} txHash={txHash} />
      )}

      {step === 'error' && (
        <ModalError buttonBlurb={'Finish'} onDismiss={dismissSubmodal} title={'An error occurred'} txHash={txHash} />
      )}
    </>
  )
}

export default Deposit