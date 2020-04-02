import React, { useState } from 'react'
import styled from 'styled-components'

import Container from '../../components/Container'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Surface from '../../components/Surface'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'

import DepositTab from './DepositTab'
import PoolTab from './PoolTab'

const StyledDashboard = styled.div`
  background: radial-gradient(circle at top, #00fff3 -0%, #0043ff, #000079);
  background-size: cover;
  background-position: center center;
  color: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pool')
  return (
    <StyledDashboard>
      <Header />
      <Container>
        <Surface>
          <Tabs>
            <Tab active={activeTab === 'pool'} onClick={() => setActiveTab('pool')}>
              Overview
            </Tab>
            <Tab active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')}>
              Deposit
            </Tab>
            <Tab active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')}>
              Withdraw
            </Tab>
            <Tab active={activeTab === 'swap'} onClick={() => setActiveTab('swap')}>
              Swap
            </Tab>
          </Tabs>

          {activeTab === 'pool' && <PoolTab />}
          {activeTab === 'deposit' && <DepositTab />}

        </Surface>
      </Container>
      <Footer />
    </StyledDashboard>
  )
}

export default Dashboard