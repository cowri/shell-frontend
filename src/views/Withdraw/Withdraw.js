import React, { useContext, useState } from 'react'

import { bnAmount } from '../../utils/web3Utils'

import ModalConfirmMetamask from '../../components/ModalConfirmMetamask'
import WithdrawingModal from '../../components/ModalAwaitingTx'

import DashboardContext from '../Dashboard/context'

import ErrorModal from './components/ErrorModal'
import StartModal from './components/StartModal'
import SuccessModal from './components/SuccessModal'

const Withdraw = ({
  onDismiss
}) => {
  const { 
    account,
    allowances,
    balances,
    contracts,
    onUpdateAllowances,
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
      .on('transactionHash', hash => { console.log("hello"); setStep('withdrawing') })
      .on('confirmation', (confirmation, receipt) => { console.log("confirmation", confirmation, receipt); setStep('success') })
      .on('receipt', receipt => { console.log("hello2"); setStep('success') })
      .on('error', error => { console.log("hello3"); setStep('error') })
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
        <SuccessModal onDismiss={onDismiss} />
      )}

      {step === 'error' && (
        <ErrorModal onDismiss={onDismiss} />
      )}
    </>
  )
}

export default Withdraw