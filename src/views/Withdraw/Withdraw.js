import React, { useContext, useState } from 'react'

import { bnAmount } from '../../utils/web3Utils'

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
    onUpdateBalances,
    onUpdateReserves,
    onUpdateWalletBalances,
    reserves,
  } = useContext(DashboardContext)

  const [step, setStep] = useState('start')
  const [withdrawEverything, setWithdrawEverything] = useState(false)

  const handleWithdraw = async (addresses, amounts) => {

    setStep('confirmingMetamask')

    let tx
    if (withdrawEverything) {
      tx = contracts.loihi.methods.proportionalWithdraw(balances.shell.toFixed())
    } else {
      tx = contracts.loihi.methods.selectiveWithdraw(addresses, amounts, balances.shell.toFixed(), Date.now())
    }

    tx.send({ from: account })
     .once('transactionHash', () => setStep('withdrawing'))
      .once('confirmation', handleConfirmation)
      .on('error', () => setStep('error'))

    function handleConfirmation () {
      onUpdateBalances()
      onUpdateReserves()
      onUpdateWalletBalances()
      setStep('succes')
    }

  }

  return (
    <>
      {step === 'start' && (
        <StartModal
          balances={balances}
          contracts={contracts}
          onDismiss={onDismiss}
          onWithdraw={handleWithdraw}
          reserves={reserves}
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