import React, { useContext, useState } from 'react'

import { bnAmount } from '../../utils/web3Utils'

import BigNumber from 'bignumber.js'

import ModalConfirmMetamask from '../../components/ModalConfirmMetamask'
import DepositingModal from '../../components/ModalAwaitingTx'

import withWallet from '../../containers/withWallet'

import DashboardContext from '../Dashboard/context'

import ModalError from '../../components/ModalError'
import StartModal from './components/StartModal'
import ModalSuccess from '../../components/ModalSuccess'

const Deposit = ({
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
    reserves,
    walletBalances,
    web3
  } = useContext(DashboardContext)

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
      bnAmount(daiValue ? daiValue : 0, contracts.dai.decimals).toFixed(),
      bnAmount(usdcValue ? usdcValue : 0, contracts.usdc.decimals).toFixed(),
      bnAmount(usdtValue ? usdtValue : 0, contracts.usdt.decimals).toFixed(),
      bnAmount(susdValue ? susdValue : 0, contracts.susd.decimals).toFixed(),
    ]

    const tx = contracts.loihi.methods.selectiveDeposit(addresses, amounts, 1, Date.now() + 2000)
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
      .on('transactionHash', () => setStep('depositing'))
      .once('confirmation', handleConfirmation)
      .on('error', () => setStep('error'))


    function handleConfirmation () {
      onUpdateBalances()
      onUpdateWalletBalances()
      setStep('succes')
    }

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
          balances={balances}
          contracts={contracts}
          onDismiss={onDismiss}
          onDeposit={handleDeposit}
          onUnlock={handleUnlock}
          reserves={reserves}
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
        <ModalSuccess buttonBlurb={'Finish'} onDismiss={onDismiss} title={'Deposit Successful.'} />
      )}

      {step === 'error' && (
        <ModalError buttonBlurb={'Finish'} onDismiss={onDismiss} title={'An error occurred'} />
      )}
    </>
  )
}

export default Deposit