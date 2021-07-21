import React from 'react';
import { StakeItemContainer, StakeItemTd } from './styled.js';

export default function StakeItem({stake, showStake}) {

    let poolName

    if (stake.name === 'CMP') {
        poolName = stake.name
    } else if (stake.name === 'CMP/ETH') {
        poolName = <>
            UNI-V2&nbsp;
            <span>{stake.name}</span>
        </>
    } else {
        poolName = <>
            CMP-LP&nbsp;
            <span>{stake.name}</span>
        </>
    }
    return (
        <StakeItemContainer onClick={() => {
            showStake(stake.managerAddress)
        }}>
            <StakeItemTd>
                {poolName}
            </StakeItemTd>
            <StakeItemTd>
                {stake.totalLockedValue.display}
            </StakeItemTd>
            <StakeItemTd>
                {stake.userLockedValue.display}
                <span>(Balance: {stake.underlyingBalance.display})</span>
            </StakeItemTd>
            <StakeItemTd>
                {Number(stake.apr).toLocaleString('en-US', {minimumFractionDigits: 0})}%
            </StakeItemTd>
        </StakeItemContainer>
    )
}
