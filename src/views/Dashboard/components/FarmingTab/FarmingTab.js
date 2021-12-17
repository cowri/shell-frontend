import React, {useContext, useEffect, useState} from 'react';
import {TabHeading, TabContainer} from '../../../../components/TabContainer/styled.js';
import DashboardContext from '../../context.js';
import {StakeItemContainer, StakeItemTd} from './styled.js';
import FarmItem from './FarmItem.js';
import config from '../../../../config.js';
import {chainId} from '../../../../constants/chainId.js';

export default function FarmingTab({showFarm, type}) {

  const {
    state,
    loggedIn,
  } = useContext(DashboardContext)

  const [deprecatedPools, setDeprecatedPools] = useState([])
  const [actualPools, setActualPools] = useState([])

  useEffect(() => {
    const _deprecatedPools = []
    const _actualPools = []
    state.get('farming') && state.get('farming')[type] && Object.values(state.get('farming')[type]).forEach((el) => {
      console.log('hello##########')
      if (el.deprecated) _deprecatedPools.push(el)
      else _actualPools.push(el)
    })
    setActualPools(_actualPools)
    setDeprecatedPools(_deprecatedPools)
  }, [state])

  return (
    <TabContainer>
      <TabHeading>{type === 'stakes' ? 'CMP Staking' : 'Liquidity farming'}</TabHeading>
      <StakeItemContainer th>
        <StakeItemTd>Pool</StakeItemTd>
        <StakeItemTd>Assets</StakeItemTd>
        {loggedIn && <StakeItemTd>My deposit</StakeItemTd>}
        <StakeItemTd>APR</StakeItemTd>
      </StakeItemContainer>
      {state.get('locking') && type === 'stakes' && (
        <StakeItemContainer onClick={() => {
          showFarm(config.veCMPDistributionAddress[chainId])
        }}>
          <StakeItemTd>veCMP</StakeItemTd>
          <StakeItemTd>{state.get('locking').stats.totalLocked.display}</StakeItemTd>
          {loggedIn && (
            <StakeItemTd>
              {state.get('locking').stats.locked.display}
              <span>(Balance: {state.get('locking').tokens[config.cmpAddress[chainId]].balance.display})</span>
            </StakeItemTd>
          )}
          <StakeItemTd>{state.get('locking').aprStats.apr}</StakeItemTd>
        </StakeItemContainer>
      )}
      {
        actualPools.sort((a, b) => {
            if (a.name.length > b.name.length) return -1;
            if (a.name.length < b.name.length) return 1;
            if (a.name > b.name) return -1;
            if (a.name < b.name) return 1;
            return 0
          }
        ).map((pool) => (
          <FarmItem farm={pool} key={pool.managerAddress} showFarm={showFarm} loggedIn={loggedIn} />
        ))
      }
      {
        deprecatedPools.length && (
          <>
            <br />
            <br />
            <br />
            <br />
            <TabHeading>Deprecated pools</TabHeading>
            <StakeItemContainer th>
              <StakeItemTd>Pool</StakeItemTd>
              <StakeItemTd>Assets</StakeItemTd>
              {loggedIn && <StakeItemTd>My deposit</StakeItemTd>}
              <StakeItemTd>APR</StakeItemTd>
            </StakeItemContainer>
            {
              deprecatedPools.map((pool) => (
                <FarmItem farm={pool} key={pool.managerAddress} showFarm={showFarm} loggedIn={loggedIn} />
              ))
            }
          </>
        )
      }
    </TabContainer>
  )
}
