import React, {useContext, useEffect, useState} from 'react';
import {TabHeading} from '../../../../../components/TabContainer/styled.js';
import {FarmParams} from '../styled.js';
import DashboardContext from '../../../context.js';
import BN from '../../../../../utils/BN.js';
import {LockingBlock} from './LockingBlock';

export const LockingTab = () => {
  const {
    state,
    loggedIn,
    selectWallet,
  } = useContext(DashboardContext)
  const [lockingStore, setLockingStore] = useState(null)

  useEffect(() => {
    setLockingStore(state.get('locking'))
  }, [state])


  const averageLockTime = lockingStore
    ? BN(lockingStore.stats.totalMinted.raw)
      .times(4)
      .div(lockingStore.stats.totalLocked.raw)
      .toFixed(2)
    : 'Loading...'

  if (state.get('locking') && lockingStore && !lockingStore.loading)
    return (
      <>
        <TabHeading><span>ve</span>CMP</TabHeading>
        <FarmParams>
          <tbody>
            <tr>
              <td><span>TVL</span><br />{lockingStore.stats.totalLocked.display}</td>
              <td><span>Total veCMP</span><br />{lockingStore.stats.totalMinted.display}</td>
            </tr>
            <tr>
              <td><span>Average lock time</span><br />{averageLockTime}</td>
              <td><span>APR (last 4 weeks):</span><br />{lockingStore.aprStats.feeAPYAverage}%</td>
            </tr>
          </tbody>
        </FarmParams>
        {lockingStore && <LockingBlock lockingStore={lockingStore}/>}
      </>
    )
  else return null
}
