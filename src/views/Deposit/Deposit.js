import React, { useState } from 'react'

import { bnAmount } from '../../utils/web3Utils'

import ModalConfirmMetamask from '../../components/ModalConfirmMetamask'

import withWallet from '../../containers/withWallet'

import DepositingModal from './components/DepositingModal'
import ErrorModal from './components/ErrorModal'
import StartModal from './components/StartModal'
import SuccessModal from './components/SuccessModal'

const Deposit = ({
  account,
  allowances,
  contracts,
  onDismiss,
  onUpdateAllowances,
  walletBalances,
  web3,
}) => {

  const [step, setStep] = useState('start')

  // should change to useReducer
  const [unlocking, setUnlocking] = useState({})

  const handleDeposit = async (
    daiValue,
    usdcValue,
    usdtValue,
    susdValue,
  ) => {
    setStep('confirmingMetamask')
    // Should be abstracted to web3Utils / withWallet
    const addresses = [
      contracts.dai.options.address,
      contracts.usdc.options.address,
      contracts.usdt.options.address,
      contracts.susd.options.address,
    ]
    const amounts = [
      bnAmount(daiValue, contracts.dai.decimals).toFixed(),
      bnAmount(usdcValue ? usdcValue : 0, contracts.usdc.decimals).toFixed(),
      bnAmount(usdtValue ? usdtValue : 0, contracts.usdt.decimals).toFixed(),
      bnAmount(susdValue ? susdValue : 0, contracts.susd.decimals).toFixed(),
    ]
    const tx = contracts.loihi.methods.selectiveDeposit(addresses, amounts, 1, Date.now() + 2000)
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
      .on('transactionHash', hash => {
        console.log(hash)
        setStep('depositing')
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(confirmationNumber)
        console.log(receipt)
        setStep('success')
      })
      .on('receipt', receipt => {
        console.log(receipt)
        setStep('success')
      })
      .on('error', error => {
        console.log(error)
        setStep('error')
      })
  }

  const handleUnlock = async (tokenKey) => {
    setStep('confirmingMetamask')

    // Should be abstracted to web3Utils / withWallet
    const tx = contracts[tokenKey].methods.approve(contracts.loihi.options.address, '-1')
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
      .on('transactionHash', hash => {
        setStep('start')
        setUnlocking({ ...unlocking, [tokenKey]: true })
      })
      .on('confirmation', (confirmationNumber, receipt) =>{
        setUnlocking({ ...unlocking, [tokenKey]: false })
        onUpdateAllowances()
      })
      .on('error', error => {
        console.log(error)
        setStep('error')
        setUnlocking({ ...unlocking, [tokenKey]: false })
      })
  }

  return (
    <>
      {step === 'start' && (
        <StartModal
          allowances={allowances}
          contracts={contracts}
          onDismiss={onDismiss}
          onDeposit={handleDeposit}
          onUnlock={handleUnlock}
          unlocking={unlocking}
          walletBalances={walletBalances}
        />
      )}

      {step === 'confirmingMetamask' && (
        <ModalConfirmMetamask />
      )}

      {step === 'depositing' && (
        <DepositingModal />
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

export default withWallet(Deposit)