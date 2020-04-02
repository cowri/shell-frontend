import React, { useState } from 'react'

import Container from '../../components/Container'
import Surface from '../../components/Surface'
import Tab from '../../components/Tab'
import Tabs from '../../components/Tabs'

import DepositTab from './tabs/DepositTab'
import PoolTab from './tabs/PoolTab'

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('pool')

  return (
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
  )
}

export default DashboardContent