import React, { useContext, useState } from 'react'

import ModalConfirmMetamask from '../../components/ModalConfirmMetamask'
import DepositingModal from '../../components/ModalAwaitingTx'
import UnlockingModal from '../../components/ModalAwaitingTx'

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
    onUpdateLiquidity,
    onUpdateWalletBalances,
    reserves,
    walletBalances
  } = useContext(DashboardContext)

  const [step, setStep] = useState('start')
  const [txHash, setTxHash] = useState('')

  // should change to useReducer
  const [unlocking, setUnlocking] = useState({})

  const handleDeposit = async (addresses, amounts) => {
    setStep('confirmingMetamask')

    const tx = contracts.loihi.methods.selectiveDeposit(addresses, amounts, 0, Date.now() + 2000)
    
    tx.send({ from: account })
      .on('transactionHash', () => setStep('depositing'))
      .once('confirmation', handleConfirmation)
      .on('error', () => setStep('error'))

    function handleConfirmation () {
      setStep('deposit-success')
      onUpdateBalances()
      onUpdateLiquidity()
      onUpdateWalletBalances()
    }

  }

  const handleUnlock = async (tokenKey) => {
    setStep('confirmingMetamask')

    // Should be abstracted to web3Utils / withWallet
    const tx = contracts[tokenKey].methods.approve(contracts.loihi.options.address, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
    tx.send({ from: account })
      .once('transactionHash', txHash)
      .once('confirmation', confirmation)
      .on('error', error)

      function txHash (hash) {
        setTxHash(hash)
        setUnlocking({ ...unlocking, [tokenKey]: true })
        setStep('unlocking')
      }

      function confirmation () {
        setUnlocking({...unlocking, [tokenKey]: false })
        onUpdateAllowances()
        setStep('unlocking-success')
      }

      function error () {
        setUnlocking({ ...unlocking, [tokenKey]: false })
        setStep('error')
      }
  }

  const onUnlockSuccessDismiss = () => setStep('start')

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

      {step === 'unlocking' && (
        <UnlockingModal txHash={txHash}/>
      )}

      {step === 'deposit-success' && (
        <ModalSuccess buttonBlurb={'Finish'} onDismiss={onDismiss} title={'Deposit Successful.'} />
      )}

      {step === 'unlocking-success' && (
        <ModalSuccess buttonBlurb={'Finish'} onDismiss={onUnlockSuccessDismiss} title={'Approval Successful.'} />
      )}

      {step === 'error' && (
        <ModalError buttonBlurb={'Finish'} onDismiss={onDismiss} title={'An error occurred'} />
      )}
    </>
  )
}

export default Deposit