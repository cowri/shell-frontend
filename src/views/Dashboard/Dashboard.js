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
  web3,
  engine,
  state,
  loggedIn
}) => {

  let userId = cookie.get('userId')

  if (!userId) {

    userId = randomWords(3).join('-')

    cookie.set('userId', userId)

  } 

  const [depositModal, setDepositModal] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)

  return (
    <>
      <DashboardContext.Provider value={{
        presentDeposit: () => setDepositModal(true),
        presentWithdraw: () => setWithdrawModal(true),
        web3,
        engine,
        state,
      }}>
          {/* <Intercom appID='zr42wlxq' user_id={userId} /> */}
          <StyledDashboard>
            <Header />
            { loggedIn && web3 && <DashboardContent/> }
            <Footer />
          </StyledDashboard>
          {depositModal && <Deposit onDismiss={() => setDepositModal(false)} />}
          {withdrawModal && <Withdraw onDismiss={() => setWithdrawModal(false)} />}
      </DashboardContext.Provider>
    </>
  )
}

export default withWallet(Dashboard)