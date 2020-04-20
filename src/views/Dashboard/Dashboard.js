import React, { useState } from 'react'
import styled from 'styled-components'
import Intercom from 'react-intercom'
import cookie from 'js-cookie'
import randomWords from 'random-words'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

import withWallet from '../../containers/withWallet'

import Deposit from '../Deposit'
import Withdraw from '../Withdraw'

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
  position: relative;
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
  onUpdateReserves,
  onUpdateWalletBalances,
  walletBalances,
  web3,
}) => {

  let userId = cookie.get('userId')
  if (!userId) {
    userId = randomWords(3).join('-')
    cookie.set('userId', userId)
  } 

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

    return <DashboardContent />
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
        onUpdateReserves,
        onUpdateWalletBalances,
        presentDeposit: () => setDepositModal(true),
        presentWithdraw: () => setWithdrawModal(true),
        reserves,
        walletBalances,
        web3,
      }}>
          <Intercom appID='zr42wlxq' user_id={userId} />
          <StyledDashboard>
            <Header />
            {renderContent()}
            <Footer />
          </StyledDashboard>
          {depositModal && <Deposit onDismiss={() => setDepositModal(false)} />}
          {withdrawModal && <Withdraw onDismiss={() => setWithdrawModal(false)} />}
      </DashboardContext.Provider>

    </>
  )
}

export default withWallet(Dashboard)