import React, {forwardRef, useContext, useEffect, useImperativeHandle, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import {ShellTab} from './ShellTab'
import {ShellsTab} from './ShellsTab';
import SwapTab from './SwapTab/SwapTab.js'

import DashboardContext from '../context'
import Footer from '../../../components/Footer';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons/faArrowCircleLeft.js';
import FarmingTab from './FarmingTab/FarmingTab.js';
import {FarmTab} from './FarmTab';


const DashboardContent = forwardRef((props, ref) => {

  const { state } = useContext(DashboardContext)

  const [activeTab, setActiveTab] = useState('swap')
  const [shellsTab, setShellsTab] = useState('shells')
  const [stakesTab, setStakesTab] = useState('stakeList')
  const [farmsTab, setFarmsTab] = useState('farmList')
  const [selectedStakeAddress, setSelectedStakeAddress] = useState(null)
  const [selectedFarmAddress, setSelectedFarmAddress] = useState(null)
  const [shellIx, setShellIx] = useState(null)

  useImperativeHandle(ref, () => ({

    goToIndexTab() {
      tabClickAction('swap')
    }

  }));

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const currentTab = queryParams.get('tab');
    const currentShellId = queryParams.get('shellId');
    if (currentTab) {
      if (currentTab !== 'shell') {
        setActiveTab(currentTab)
      } else {
        setActiveTab(currentTab)
        setShellIx(currentShellId || 0)
      }
    }
  }, [])

  const showShell = (ix) => {
    setActiveTab('shell')
    setShellsTab('shell')
    setShellIx(ix)
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tab', 'shell')
    queryParams.set('shellId', ix)
    window.history.replaceState(null, null, `?${queryParams}`)
  }

  function showStake(stakeAddress) {
    setActiveTab('stake')
    setStakesTab('stakeList')
    setSelectedStakeAddress(stakeAddress)
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tab', 'stake')
    queryParams.set('address', stakeAddress)
    window.history.replaceState(null, null, `?${queryParams}`)
  }

  function showFarm(farmAddress) {
    setActiveTab('farm')
    setFarmsTab('farmList')
    setSelectedFarmAddress(farmAddress)
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tab', 'farm')
    queryParams.set('address', farmAddress)
    window.history.replaceState(null, null, `?${queryParams}`)
  }

  const shellTabClick = () => {
    if (activeTab === 'shell') {
      setShellsTab('shells')
      setActiveTab('shells')
      storeTabTypeToUrl('shells')
    } else {
      setActiveTab(shellsTab)
      storeTabTypeToUrl(shellsTab)
    }
  }

  const stakeTabClick = () => {
    if (activeTab === 'stake') {
      setStakesTab('stakeList')
      setActiveTab('stakeList')
      storeTabTypeToUrl('stakeList')
    } else {
      setActiveTab(stakesTab)
      storeTabTypeToUrl(stakesTab)
    }
  }

  const farmTabClick = () => {
    if (activeTab === 'farm') {
      setFarmsTab('farmList')
      setActiveTab('farmList')
      storeTabTypeToUrl('farmList')
    } else {
      setActiveTab(farmsTab)
      storeTabTypeToUrl(farmsTab)
    }
  }

  function tabClickAction(tabName) {
    setActiveTab(tabName)
    storeTabTypeToUrl(tabName)
  }

  function storeTabTypeToUrl(tabName) {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tab', tabName)
    queryParams.delete('shellId')
    queryParams.delete('address')
    window.history.replaceState(null, null, `?${queryParams}`)
  }

  return (
    <>
      <Container>
        <Surface>
          <Tabs>
            <Tab
              active={activeTab === 'swap'}
              disabled={!state.has('shells')}
              onClick={() => tabClickAction('swap')}
            >
              Swap
            </Tab>
            <Tab
              active={activeTab === 'shell' || activeTab === 'shells'}
              disabled={!state.has('shells')}
              onClick={shellTabClick}
            >
              { activeTab !== 'shell'
                ? 'Pools'
                : (
                  <a style={{display: 'flex', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '10px' }}/>
                    <span>Back to pools</span>
                  </a>
                )
              }
            </Tab>
            <Tab
              active={activeTab === 'farmList' || activeTab === 'farm'}
              onClick={farmTabClick}
            >
              { activeTab !== 'farm'
                ? 'Farm'
                : (
                  <a style={{display: 'flex', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '10px' }}/>
                    <span>Farm</span>
                  </a>
                )
              }
            </Tab>
            <Tab
              active={activeTab === 'stakeList' || activeTab === 'stake'}
              onClick={stakeTabClick}
            >
              { activeTab !== 'stake'
                ? 'Stake'
                : (
                  <a style={{display: 'flex', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '10px' }}/>
                    <span>Stake</span>
                  </a>
                )
              }
            </Tab>
          </Tabs>
          { activeTab === 'shells' && <ShellsTab showShell={showShell} /> }
          { activeTab === 'shell' && <ShellTab shellIx={shellIx} /> }
          { activeTab === 'swap' && <SwapTab /> }
          { activeTab === 'stakeList' && <FarmingTab type="stakes" showFarm={showStake} />}
          { activeTab === 'stake' && <FarmTab type="stakes" stakeAddress={selectedStakeAddress}/>}
          { activeTab === 'farmList' && <FarmingTab type="farms" showFarm={showFarm} />}
          { activeTab === 'farm' && <FarmTab type="farms" farmAddress={selectedFarmAddress}/>}
        </Surface>
      </Container>
      <Footer shellIx={shellIx}/>
    </>
  )
})

export default DashboardContent
