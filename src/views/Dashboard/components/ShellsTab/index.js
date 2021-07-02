import React, { useContext } from 'react'
import Row from '../../../../components/Row'
import DashboardContext from '../../context.js'
import {PoolsTable, StyledInfoBlock, StyledShellsTab} from './styled.js';
import {ShellsTableRow} from './ShellsTabelRow.js';

export const ShellsTab = ({showShell}) => {
  const {
    engine,
    state,
    loggedIn,
  } = useContext(DashboardContext)

  let rows = []

  if (state.has('shells')) {
    for (let i = 0; i < engine.shells.length; i++) {
      let liqTotal = state.getIn(['shells',i,'shell','liquidityTotal','display'])
      let liqOwned = state.getIn(['shells',i,'shell','liquidityOwned','display'])

      liqTotal = liqTotal.slice(0, liqTotal.indexOf('.') === -1 ? undefined : liqTotal.indexOf('.'))
      liqOwned = liqOwned.slice(0, liqOwned.indexOf('.') === -1 ? undefined : liqOwned.indexOf('.'))

      rows.push(
        <ShellsTableRow
          key={i}
          showShell={() => showShell(i)}
          assets={engine.shells[i].assets}
          liqTotal={liqTotal}
          liqOwned={liqOwned}
        />
      )

    }
  }

  return (
    <StyledShellsTab>
      <StyledInfoBlock/>
      <PoolsTable>
        <Row head>
          <span style={{ flex: 1.3 }}>Pools</span>
          <span style={{ flex: 1.2, textAlign: loggedIn ? 'left' : 'right' }}>Liquidity</span>
          {loggedIn && <span style={{ flex: 1, textAlign: 'right' }}>Your Balance</span>}
        </Row>
        { rows }
      </PoolsTable>
    </StyledShellsTab>
  )
}
