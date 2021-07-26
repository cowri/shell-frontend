import React from 'react';
import { StakeItemContainer, StakeItemTd } from './styled.js';
import ReactTooltip from 'react-tooltip';

export default function FarmItem({farm, showFarm, loggedIn}) {

  let poolName

  if (farm.name === 'CMP') {
    poolName = farm.name
  } else if (farm.name === 'CMP/ETH') {
    poolName = <>
      UNI-V2&nbsp;
      <span>{farm.name}</span>
    </>
  }  else if (farm.name === 'CMP/BNB') {
    poolName = <>
      Cake-LP&nbsp;
      <span>{farm.name}</span>
    </>
  } else {
    poolName = <>
      CMP-LP&nbsp;
      <span>{farm.name}</span>
    </>
  }

  const apr = isNaN(farm.apr) ? farm.apr : `${Number(farm.apr).toLocaleString('en-US', {minimumFractionDigits: 0})}%`

  return (
    <>
      <ReactTooltip />
      <StakeItemContainer onClick={() => {
        showFarm(farm.managerAddress)
      }}>
        <StakeItemTd>
          {poolName}
        </StakeItemTd>
        <StakeItemTd data-tip={farm.totalLockedValueUsd + '$'}>
          {farm.totalLockedValue.display}
        </StakeItemTd>
        {loggedIn && (
          <StakeItemTd data-tip={farm.depositValueUsd + '$'}>
            {farm.userLockedValue.display}
            <span>(Balance: {farm.underlyingBalance.display})</span>
          </StakeItemTd>
        )}
        <StakeItemTd>
          {apr}
        </StakeItemTd>
      </StakeItemContainer>
    </>
  )
}
