import React, { useState } from 'react'

import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import DepositTab from './DepositTab'
import PoolTab from './PoolTab'

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('pool')

  return (
    <Container>
      <Surface>
        <Tabs>
          <Tab active={activeTab === 'pool'} onClick={() => setActiveTab('pool')}>
            Overview
          </Tab>
          <Tab />
          <Tab />
          <Tab />
        </Tabs>

        {activeTab === 'pool' && <PoolTab />}
        {activeTab === 'deposit' && <DepositTab />}

      </Surface>
    </Container> 
  )
}

/*
          <Tab active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')}>
            Deposit
          </Tab>
          <Tab active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')}>
            Withdraw
          </Tab>
          <Tab active={activeTab === 'swap'} onClick={() => setActiveTab('swap')}>
            Swap
          </Tab>
*/

export default DashboardContent