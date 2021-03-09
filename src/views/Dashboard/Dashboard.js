import React from 'react'
import styled from 'styled-components'
import cookie from 'js-cookie'
import randomWords from 'random-words'

import Header from '../../components/Header'

import withWallet from '../../containers/withWallet'

import DashboardContent from './components/DashboardContent'

import DashboardContext from './context'
import Loader from '../../components/Loader';
import Spinner from './components/DistributionTab/Spinner.js';

const StyledDashboard = styled.div`
  align-items: center;
  background: radial-gradient(circle at center top,rgb(255 230 247) 0,rgb(255 218 254),rgba(203,0,255,.18)) no-repeat fixed;
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

  return (
    <>
      <DashboardContext.Provider value={{
        web3,
        engine,
        state,
      }}>
          <StyledDashboard>
            <Header />
            { loggedIn && web3 && (engine.shells.length && state.size ? <DashboardContent/> : <Spinner />)}
          </StyledDashboard>
      </DashboardContext.Provider>
    </>
  )
}

export default withWallet(Dashboard)
