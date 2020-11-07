import React, { useContext, useState } from 'react'

import { fromJS } from 'immutable'

import ModalConfirm from '../../components/ModalConfirm'
import WithdrawingModal from '../../components/ModalAwaitingTx'

import DashboardContext from '../Dashboard/context'

import ModalError from '../../components/ModalError'
import StartModal from './components/StartModal'
import ModalSuccess from '../../components/ModalSuccess'

const Withdraw = ({ shellIx, onDismiss }) => {
  const { 
    engine,
    state
  } = useContext(DashboardContext)

  const [txHash, setTxHash] = useState('')
  const [step, setStep] = useState('start')
  const [localState, setLocalState] = useState(fromJS({
    assets: new Array(engine.shells[shellIx].assets.length).fill({
      error: '',
      input: ''
    }),
    error: '',
    feeTip: 'Your rate on this withdrawal will be...',
    proportional: false,
    zero: true
  }))
  
  let success = false 

  const handleTxHash = (hash) => ( setStep('withdrawing'), setTxHash(hash) )

  const handleConfirmation = () => ( success = true, engine.sync(), setStep('success') )

  const handleError = () => { if (!success) setStep('error') }

  const handleProportionalWithdraw = async (amount) => {

    setStep('confirmingMetamask')

    engine.proportionalWithdraw(
      shellIx,
      amount,
      handleTxHash,
      handleConfirmation,
      handleError
    )

  }

  const handleWithdraw = async (addresses, amounts) => {

    setStep('confirmingMetamask')

    engine.selectiveWithdraw(
      shellIx,
      addresses,
      amounts,
      handleTxHash,
      handleConfirmation,
      handleError
    )

  }
  
  return (
    <>
      {step === 'start' && (
        <StartModal
          engine={engine}
          localState={localState}
          onDismiss={onDismiss}
          onProportionalWithdraw={handleProportionalWithdraw}
          onWithdraw={handleWithdraw}
          setLocalState={setLocalState}
          shellIx={shellIx}
          state={state}
        />
      )}

      {step === 'confirmingMetamask' && (
        <ModalConfirm wallet={engine.wallet} />
      )}

      {step === 'withdrawing' && (
        <WithdrawingModal txHash={txHash} />
      )}

      {step === 'success' && (
        <ModalSuccess 
          buttonBlurb={'Finish'} 
          onDismiss={onDismiss} 
          title={'Withdrawal Successful.'} 
          txHash={txHash}
        />
      )}

      {step === 'error' && (
        <ModalError 
          buttonBlurb={'Finish'} 
          onDismiss={onDismiss} 
          title={'An error occurred.'} 
          txHash={txHash}
        />
      )}

    </>
  )
}

export default Withdraw