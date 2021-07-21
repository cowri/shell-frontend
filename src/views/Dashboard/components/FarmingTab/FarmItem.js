import React from 'react';
import { StakeItemContainer, StakeItemTd } from './styled.js';

export default function FarmItem({farm, showFarm}) {

    let poolName

    if (farm.name === 'CMP') {
        poolName = farm.name
    } else if (farm.name === 'CMP/ETH') {
        poolName = <>
            UNI-V2&nbsp;
            <span>{farm.name}</span>
        </>
    } else {
        poolName = <>
            CMP-LP&nbsp;
            <span>{farm.name}</span>
        </>
    }
    return (
        <StakeItemContainer onClick={() => {
            showFarm(farm.managerAddress)
        }}>
            <StakeItemTd>
                {poolName}
            </StakeItemTd>
            <StakeItemTd>
                {farm.totalLockedValue.display}
            </StakeItemTd>
            <StakeItemTd>
                {farm.userLockedValue.display}
                <span>(Balance: {farm.underlyingBalance.display})</span>
            </StakeItemTd>
            <StakeItemTd>
                {Number(farm.apr).toLocaleString('en-US', {minimumFractionDigits: 0})}%
            </StakeItemTd>
        </StakeItemContainer>
    )
}
