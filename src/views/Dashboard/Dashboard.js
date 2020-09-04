import React, { useState } from 'react'
import styled from 'styled-components'
import Intercom from 'react-intercom'
import cookie from 'js-cookie'
import randomWords from 'random-words'
import config from "../../kovan.config.json";

import Footer from '../../components/Footer'
import Header from '../../components/Header'

import withWallet from '../../containers/withWallet'

import Deposit from '../Deposit'
import Withdraw from '../Withdraw'

import DashboardContent from './components/DashboardContent'
import NetworkModal from './components/NetworkModal'
import SelectWalletModal from './components/SelectWalletModal'
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
  shell,
  hasMetamask,
  isUnlocked,
  network,
  liquidity,
  onEnable,
  selectWallet,
  updateAllState,
  updateAllowances,
  updateBalances,
  updateLiquidity,
  updateWalletBalances,
  walletBalances,
  walletSelected,
  web3,
  engine,
  state,
  login
}) => {

  console.log("---- engine -----", engine)
  console.log("---- state -----", state)
  
  let userId = cookie.get('userId')

  if (!userId) {

    userId = randomWords(3).join('-')

    cookie.set('userId', userId)

  } 

  const [depositModal, setDepositModal] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)

  console.log("selected", login.get('walletSelected'))

  console.log("checked", login.get('walletChecked'))

  const renderContent = () => {

    if (!login.get('walletSelected')) {

      if (!login.get('walletSelecting')) {

        return <SelectWalletModal selectWallet={selectWallet} />
      
      }

    } else if (!login.get('walletChecked')) {

      if (!login.get('walletChecking')) { }

    } else if (!web3) {

    } else if (network != config.network) {

      return <NetworkModal />

    } else if (!state.get('account') && !login.get('walletSelecting')) {

      return <UnlockModal />

    } else {

      return <DashboardContent />

    }

  }

  return (
    <>
      <DashboardContext.Provider value={{
        account,
        allowances,
        balances,
        contracts,
        shell,
        onEnable,
        updateAllState,
        updateAllowances,
        updateBalances,
        updateLiquidity,
        updateWalletBalances,
        presentDeposit: () => setDepositModal(true),
        presentWithdraw: () => setWithdrawModal(true),
        liquidity,
        walletBalances,
        web3,
        engine,
        state,
        login
      }}>
          {/* <Intercom appID='zr42wlxq' user_id={userId} /> */}
          <StyledDashboard>
            <Header />
            { renderContent() }
            <Footer />
          </StyledDashboard>
          {/* {depositModal && <Deposit onDismiss={() => setDepositModal(false)} />}
          {withdrawModal && <Withdraw onDismiss={() => setWithdrawModal(false)} />} */}
      </DashboardContext.Provider>
    </>
  )
}

export default withWallet(Dashboard)