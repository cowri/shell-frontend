import React, {useContext, useRef} from 'react';
import styled from 'styled-components'
import cookie from 'js-cookie'
import randomWords from 'random-words'

import Header from '../../components/Header'

import WithWallet from '../../containers/withWallet'

import DashboardContent from './components/DashboardContent'

import DashboardContext from './context'
import Spinner from '../../components/Spiner/Spinner.js';
import useSubject from '../../hooks/useSubject.js';
import {currentTxStore} from '../../store/currentTxStore.js';
import {StatusModals} from '../../components/StatusModals';
import {IS_ETH, IS_FTM} from '../../constants/chainId.js';

const StyledDashboard = styled.div`
  background-size: cover;
  background: ${IS_FTM ? 'center / cover no-repeat url("/images/fantom/app-bg.jpg");': 'radial-gradient(circle at center top, rgb(255 230 247) 0, rgb(255 218 254), rgba(203, 0, 255, .18)) no-repeat fixed center;'}
  min-height: 100vh;
  position: relative;
  color: ${IS_FTM ? '#fff' : '#000'}
`

const Dashboard = ({
  web3,
  engine,
  state,
  loggedIn,
  selectWallet,
  disconnect,
}) => {

  const currentTx = useSubject(currentTxStore.currentTx)

  const dashboardRef = useRef(null);

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
        loggedIn,
        selectWallet,
        disconnect,
      }}>
        {currentTx && <StatusModals tx={currentTx} />}
        <StyledDashboard>
          <Header goToIndexTab={() => dashboardRef.current.goToIndexTab()}/>
          { (web3 && engine && engine.shells.length && state.size) ? (
              <DashboardContent
                ref={dashboardRef}
              />
          ) : (
            <Spinner />
          )}
        </StyledDashboard>
      </DashboardContext.Provider>
    </>
  )
}

export default WithWallet(Dashboard)
