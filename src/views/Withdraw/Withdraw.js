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
    allowances,
    balances,
    contracts,
    onUpdateAllowances,
    onUpdateBalances,
    onUpdateWalletBalances,
    walletBalances,
    web3
  } = useContext(DashboardContext)

  console.log("balances", balances)

  const [step, setStep] = useState('start')

  const handleWithdraw = async () => {
    setStep('confirmingMetamask')
    const shells = balances.shell.toFixed()
    const tx = contracts.loihi.methods.proportionalWithdraw(shells)
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.1), gasPrice: gasPrice})
      .once('transactionHash', () => setStep('withdrawing'))
      .once('confirmation', handleConfirmation)
      .on('error', () => setStep('error'))

    function handleConfirmation () {
      onUpdateBalances()
      onUpdateWalletBalances()
      setStep('succes')
    }

  }

  return (
    <>
      {step === 'start' && (
        <StartModal
          allowances={allowances}
          balances={balances}
          contracts={contracts}
          onDismiss={onDismiss}
          onWithdraw={handleWithdraw}
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