import React, { useState } from 'react'

import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import PoolTab from './PoolTab'
import SwapTab from './SwapTab'

const DashboardContent = ({
  account,
  allowances,
  contracts,
  web3
}) => {
  const [activeTab, setActiveTab] = useState('pool')

  return (
    <Container>
      <Surface>
        <Tabs>
          <Tab active={activeTab === 'pool'} onClick={() => setActiveTab('pool')}>
            Pool
          </Tab>
          <Tab active={activeTab === 'swap'} onClick={() => setActiveTab('swap')}>
            Swap
          </Tab>
        </Tabs>

        {activeTab === 'pool' && <PoolTab /> }
        {activeTab === 'swap' && <SwapTab /> }

      </Surface>
    </Container> 
  )
}

export default DashboardContent