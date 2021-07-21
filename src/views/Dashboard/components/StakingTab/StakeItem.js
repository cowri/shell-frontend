import React from 'react';
import { StakeItemContainer, StakeItemTd } from './styled.js';
import ReactTooltip from 'react-tooltip';

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
            <ReactTooltip />
            <StakeItemTd>
                {poolName}
            </StakeItemTd>
            <StakeItemTd data-tip={stake.totalLockedValueUsd + '$'}>
                {stake.totalLockedValue.display}
            </StakeItemTd>
            <StakeItemTd data-tip={stake.depositValueUsd + '$'}>
                {stake.userLockedValue.display}
                <span>(Balance: {stake.underlyingBalance.display})</span>
            </StakeItemTd>
            <StakeItemTd>
                {Number(stake.apr).toLocaleString('en-US', {minimumFractionDigits: 0})}%
            </StakeItemTd>
        </StakeItemContainer>
    )
}
