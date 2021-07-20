import TokenIcon from '../../../../components/TokenIcon';
import Row from '../../../../components/Row';
import React, {useContext} from 'react';
import {StyledBalance, StyledTokenName} from './styled.js';
import DashboardContext from '../../context.js';

export const ShellTableRow = ({asset, liqOwned, liqTotal}) => {
  const {
    loggedIn
  } = useContext(DashboardContext)

  return (
    <Row>
      <StyledTokenName>
        <TokenIcon> <img alt="" src={asset.icon} /> </TokenIcon>
        <div style={{ width: 12 }} />
        <span>{asset.symbol}</span>
      </StyledTokenName>
      <StyledBalance loggedIn={loggedIn} className="number">
        { liqTotal }
      </StyledBalance>
      {loggedIn && <StyledBalance style={{justifyContent: 'flex-end'}}>
        { liqOwned }
      </StyledBalance>}
    </Row>
  )
}
