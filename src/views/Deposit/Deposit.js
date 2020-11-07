import React, { useContext, useState } from 'react'

import ModalConfirm from '../../components/ModalConfirm'
import BroadcastingModal from '../../components/ModalAwaitingTx'

import DashboardContext from '../Dashboard/context'

import ModalError from '../../components/ModalError'
import StartModal from './components/StartModal'
import ModalSuccess from '../../components/ModalSuccess'

import { fromJS } from 'immutable'
import BigNumber from 'bignumber.js'

const MAX_APPROVAL = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

const ZERO = new BigNumber(0)

const Deposit = ({ shellIx, onDismiss }) => {
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
    feeTip: 'Your rate on this deposit will be...',
  }))
  
  const handleDeposit = async (addresses, amounts) => {

    setStep('confirming')

    setLocalState(localState.delete('error'))
    
    let success = false

    engine.selectiveDeposit(
      shellIx,
      addresses,
      amounts,
      function onTxHash (hash) {
        setTxHash(hash)
        setStep('broadcasting')
      },
      function onConfirmation () {
        success = true
        engine.sync()
        setStep('deposit-success')
        setLocalState(localState
          .delete('fee')
          .delete('prompting')
          .update('assets', assets => assets.map(asset => asset.set('input', ''))))
      },
      function onError (e) {
        if (!success) {
          setStep('error')
          setLocalState(localState
            .delete('fee')
            .delete('prompting')
            .update('assets', assets => assets.map(asset => asset.set('input', ''))))
        }
      }
    )
  }

  const handleUnlock = async (index, amount) => {
    
    setStep('confirming')

    engine.unlock(
      shellIx,
      index,
      amount.toString(),
      function onTxHash (hash) {
        setStep('broadcasting')
        setTxHash(hash)
      },
      function onConfirmation () {
        engine.sync()
        setStep('unlocking-success')
      },
      function onError () {
        setStep('error')
      }
    )

  }

  const dismissSubmodal = () => {

    setTxHash('')
    setStep('start')

  }

  return (
    <>

      { step === 'start' && <StartModal
          engine={engine}
          localState={localState}
          onDeposit={handleDeposit}
          onUnlock={handleUnlock}
          onDismiss={onDismiss}
          setLocalState={setLocalState}
          shellIx={shellIx}
          state={state}
        /> }

      { step === 'confirming' && <ModalConfirm wallet={engine.wallet} />}

      { step === 'broadcasting' && <BroadcastingModal txHash={txHash} />}

      { step === 'unlocking-success' && <ModalSuccess 
          buttonBlurb={'Finish'} 
          onDismiss={dismissSubmodal} 
          title={'Approval Successful.'} 
          txHash={txHash} /> }

      { step === 'deposit-success' && <ModalSuccess 
          buttonBlurb={'Finish'} 
          onDismiss={dismissSubmodal} 
          title={'Deposit Successful.'} 
          txHash={txHash} /> }

      { step === 'error' && <ModalError 
          buttonBlurb={'Finish'}
          onDismiss={dismissSubmodal}
          title={'An error occurred.'}
          txHash={txHash} /> }

    </>
  )
}

export default Deposit