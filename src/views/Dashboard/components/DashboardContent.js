import React, {useContext, useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Container from '../../../components/Container'
import Surface from '../../../components/Surface'
import Tab from '../../../components/Tab'
import Tabs from '../../../components/Tabs'

import ShellTab from './ShellTab'
import ShellsTab from './ShellsTab'
import SwapTab from './SwapTab/SwapTab.js'

import DashboardContext from '../context'
import Footer from '../../../components/Footer';
import {faArrowCircleLeft} from '@fortawesome/free-solid-svg-icons/faArrowCircleLeft.js';
import StakingTab from './StakingTab/StakingTab.js';
import {StackTab} from './StackTab';


const DashboardContent = () => {

  const { state } = useContext(DashboardContext)

  const [activeTab, setActiveTab] = useState('shells')
  const [shellsTab, setShellsTab] = useState('shells')
  const [stacksTab, setStacksTab] = useState('stacks')
  const [selectedStackAddress, setSelectedStackAddress] = useState(null)
  const [shellIx, setShellIx] = useState(null)

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

  function showStack(stackAddress) {
    setActiveTab('stack')
    setStacksTab('stack')
    setSelectedStackAddress(stackAddress)
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set('tab', 'stack')
    queryParams.set('address', stackAddress)
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

  const stackTabClick = () => {
    if (activeTab === 'stack') {
      setStacksTab('stacks')
      setActiveTab('stacks')
      storeTabTypeToUrl('stacks')
    } else {
      setActiveTab(stacksTab)
      storeTabTypeToUrl(stacksTab)
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
              active={activeTab === 'swap'}
              disabled={!state.has('shells')}
              onClick={() => tabClickAction('swap')}
            >
              Swap
            </Tab>
            <Tab
              active={activeTab === 'stacks' || activeTab === 'stack'}
              onClick={stackTabClick}
            >
              { activeTab !== 'stack'
                ? 'Yield'
                : (
                  <a style={{display: 'flex', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} style={{ marginRight: '10px' }}/>
                    <span>Yield</span>
                  </a>
                )
              }
            </Tab>
          </Tabs>
          { activeTab === 'shells' && <ShellsTab showShell={showShell} /> }
          { activeTab === 'shell' && <ShellTab shellIx={shellIx} /> }
          { activeTab === 'swap' && <SwapTab /> }
          { activeTab === 'stacks' && <StakingTab showStack={showStack} />}
          { activeTab === 'stack' && <StackTab stackAddress={selectedStackAddress}/>}
        </Surface>
      </Container>
      <Footer shellIx={shellIx}/>
    </>
  )
}

export default DashboardContent
