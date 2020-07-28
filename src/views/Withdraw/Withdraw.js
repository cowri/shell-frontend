import React, { useContext, useState } from 'react'

import ModalConfirmMetamask from '../../components/ModalConfirmMetamask'
import WithdrawingModal from '../../components/ModalAwaitingTx'

import DashboardContext from '../Dashboard/context'

import ModalError from '../../components/ModalError'
import StartModal from './components/StartModal'
import ModalSuccess from '../../components/ModalSuccess'

const Withdraw = ({
  onDismiss
}) => {
  const { 
    account,
    balances,
    contracts,
    liquidity,
    loihi,
    updateAllState,
    updateBalances,
    updateLiquidity,
    updateWalletBalances,
  } = useContext(DashboardContext)

  const [step, setStep] = useState('start')
  const [withdrawEverything, setWithdrawEverything] = useState(false)

  const handleWithdraw = async (addresses, amounts) => {

    setStep('confirmingMetamask')

    const tx = withdrawEverything
      ? loihi.proportionalWithdraw(loihi.getRawFromNumeraire(balances.shells), Date.now() + 500)
      : loihi.selectiveWithdraw(addresses, amounts, loihi.getRawFromNumeraire(balances.shells), Date.now() + 500)

    tx.send({ from: account })
      .once('transactionHash', () => setStep('withdrawing'))
      .once('confirmation', handleConfirmation)
      .on('error', () => setStep('error'))

    function handleConfirmation () {
      setStep('success')
      updateAllState()
      // updateBalances()
      // updateLiquidity()
      // updateWalletBalances()
    }

  }

  return (
    <>
      {step === 'start' && (
        <StartModal
          balances={balances}
          contracts={contracts}
          liquidity={liquidity}
          loihi={loihi}
          onDismiss={onDismiss}
          onWithdraw={handleWithdraw}
          setWithdrawEverything={setWithdrawEverything}
          withdrawEverything={withdrawEverything}
        />
      )}

      {step === 'confirmingMetamask' && (
        <ModalConfirmMetamask />
      )}

      {step === 'withdrawing' && (
        <WithdrawingModal />
      )}

      {step === 'success' && (
        <ModalSuccess buttonBlurb={'Finish'} onDismiss={onDismiss} title={'Withdrawal Successful.'} />
      )}

      {step === 'error' && (
        <ModalError buttonBlurb={'Finish'} onDismiss={onDismiss} title={'An error occurred.'} />
      )}

    </>
  )
}

export default Withdraw