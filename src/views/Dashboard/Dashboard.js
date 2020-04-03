import React, { useState } from 'react'
import styled from 'styled-components'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

import withWallet from '../../containers/withWallet'

import Deposit from '../Deposit'

import DashboardContent from './components/DashboardContent'
import NetworkModal from './components/NetworkModal'
import UnlockModal from './components/UnlockModal'

import DashboardContext from './context'

const StyledDashboard = styled.div`
  align-items: center;
  background: radial-gradient(circle at top, #00fff3 -0%, #0043ff, #000079);
  background-size: cover;
  background-position: center center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Dashboard = ({
  account,
  allowances,
  balances,
  contracts,
  hasMetamask,
  isUnlocked,
  networkId,
  reserves,
  onEnable,
  onUpdateAllowances,
  onUpdateBalances,
  onUpdateWalletBalances,
  walletBalances,
  web3,
}) => {

  const [depositModal, setDepositModal] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)

  const renderContent = () => {
    if (!hasMetamask) {
      return <span style={{ color: '#FFF' }}>Metamask not found.</span>
    }
    if (networkId !== 1) {
      return <NetworkModal />
    }
    if (!isUnlocked) {
      return <UnlockModal />
    }

    console.log("allowances", allowances)

    return <DashboardContent 
      account={account}
      allowances={allowances}
      balances={balances}
      contracts={contracts}
      hasMetaMask={hasMetamask}
      isUnlocked={isUnlocked}
      networkId={networkId}
      reserves={reserves}
      onEnable={onEnable}
      onUpdateAllowances={onUpdateAllowances}
      onUpdateBalances={onUpdateBalances}
      onUpdateWalletBalances={onUpdateWalletBalances}
      walletBalances={walletBalances}
      web3={web3}
    />
  }

  return (
    <>
      <DashboardContext.Provider value={{
        account,
        allowances,
        balances,
        contracts,
        onEnable,
        onUpdateAllowances,
        onUpdateBalances,
        onUpdateWalletBalances,
        presentDeposit: () => setDepositModal(true),
        presentWithdraw: () => setWithdrawModal(true),
        reserves,
        walletBalances,
        web3,
      }}>
        <StyledDashboard>
          <Header />
          {renderContent()}
          <Footer />
        </StyledDashboard>
      </DashboardContext.Provider>

      {depositModal && <Deposit onDismiss={() => setDepositModal(false)} />}
    </>
  )
}

export default withWallet(Dashboard)