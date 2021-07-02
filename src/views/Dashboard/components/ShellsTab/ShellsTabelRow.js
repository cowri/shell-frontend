import TokenIcon from '../../../../components/TokenIcon';
import BigNumber from 'bignumber.js';
import React, {useContext} from 'react';
import {ShellName, ShellNameBody, ShellNamePart, StyledBalance, StyledRow, Symbol, Weight} from './styled.js';
import DashboardContext from '../../context.js';

export const ShellsTableRow = ({showShell, liqTotal, liqOwned, assets}) => {
  const {
    loggedIn
  } = useContext(DashboardContext)

  return (
    <StyledRow onClick={showShell}>
      <ShellName>
        <ShellNameBody>
          {assets.map((asset) => (
            <ShellNamePart key={asset.symbol}>
              <Symbol>
                { asset.symbol }
              </Symbol>
              <TokenIcon size={24}> <img src={asset.icon} alt="" /> </TokenIcon>
              <Weight>
                { asset.weight.multipliedBy(new BigNumber(100)).toString() + '%' }
              </Weight>
            </ShellNamePart>
          ))}
        </ShellNameBody>
      </ShellName>
      <StyledBalance
        className="number"
        style={{justifyContent: loggedIn ? 'flex-start' : 'flex-end', flex: '1.2'}}
      >
        { liqTotal }
      </StyledBalance>
      {loggedIn && (
        <StyledBalance
          className="number"
          style={{justifyContent: 'flex-end', flex: '1'}}
        >
          { liqOwned }
        </StyledBalance>
      )}
    </StyledRow>
  )
}
