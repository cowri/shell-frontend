import React, {useContext} from 'react';
import {TabHeading, TabContainer} from '../../../../components/TabContainer/styled.js';
import DashboardContext from '../../context.js';
import {StakeItemContainer, StakeItemTd} from './styled.js';
import FarmItem from './FarmItem.js';

export default function FarmingTab({showFarm, type}) {

  const {
    state,
    loggedIn,
  } = useContext(DashboardContext)

  return (
    <TabContainer>
      <TabHeading>{type === 'stakes' ? 'CMP Staking' : 'Liquidity farming'}</TabHeading>
      <StakeItemContainer th>
        <StakeItemTd>Pool</StakeItemTd>
        <StakeItemTd>Assets</StakeItemTd>
        {loggedIn && <StakeItemTd>My deposit</StakeItemTd>}
        <StakeItemTd>APR</StakeItemTd>
      </StakeItemContainer>
      {
        state.get('farming') && state.get('farming')[type] && Object.values(state.get('farming')[type]).sort((a, b) => {
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
    </TabContainer>
  )
}
