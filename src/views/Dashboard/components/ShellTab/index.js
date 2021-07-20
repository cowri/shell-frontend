import React, { useContext, useState } from 'react'
import Button from '../../../../components/Button'
import LabelledValue from '../../../../components/LabelledValue'

import Overview from '../../../../components/Overview'
import OverviewSection from '../../../../components/OverviewSection'
import Row from '../../../../components/Row'

import Deposit from '../../../Deposit'
import Withdraw from '../../../Withdraw'

import DashboardContext from '../../context.js'
import {Devider, StyledActions, StyledRows, StyledShellTab} from './styled.js';
import {ShellTableRow} from './ShellTableRow.js';

export const ShellTab = ({ shellIx }) => {
  const {
    engine,
    state,
    loggedIn,
    selectWallet,
  } = useContext(DashboardContext)

  const [ presentDeposit, setPresentDeposit ] = useState(false)
  const [ presentWithdraw, setPresentWithdraw ] = useState(false)

  const rows = engine.shells[shellIx].assets.map( (asset, ix) => {

    const liqTotal = state.getIn([ 'shells', shellIx, 'shell', 'liquiditiesTotal', ix, 'display' ])
    const liqOwned = state.getIn([ 'shells', shellIx, 'shell', 'liquiditiesOwned', ix, 'display' ])

    return <ShellTableRow key={asset.symbol} asset={asset} liqTotal={liqTotal} liqOwned={liqOwned} />

  })

  const liqTotal = state.getIn([ 'shells', shellIx, 'shell', 'liquidityTotal', 'display' ])
  const liqOwned = state.getIn([ 'shells', shellIx, 'shell', 'liquidityOwned', 'display' ])


  return (
    <>
      { presentDeposit && <Deposit shellIx={shellIx} onDismiss={() => setPresentDeposit(false)} />}
      { presentWithdraw && <Withdraw shellIx={shellIx} onDismiss={() => setPresentWithdraw(false)} />}
      <StyledShellTab>
        <Overview>
          <OverviewSection>
            <LabelledValue label="Pool Reserves" value={ liqTotal} />
          </OverviewSection>
          {loggedIn && (
            <OverviewSection>
              <LabelledValue label="Your Balance" value={ liqOwned } />
            </OverviewSection>
          )}
        </Overview>
        <StyledRows>
          <Row head>
            <span style={{ flex: 1 }}> Token </span>
            <span style={{ flex: 1, textAlign: loggedIn ? 'left' : 'right' }}> Pool Reserves </span>
            {loggedIn && <span style={{ flex: 1, textAlign: 'right' }}> My Balances </span>}
          </Row>
          { rows }
        </StyledRows>
        <StyledActions>
          {loggedIn ? (
            <>
              <Button onClick={setPresentDeposit} fullWidth>Deposit</Button>
              <Devider />
              <Button outlined onClick={setPresentWithdraw} fullWidth>Withdraw</Button>
            </>
          ) : (
            <Button onClick={() => selectWallet()} fullWidth>Connect</Button>
          )}
        </StyledActions>
      </StyledShellTab>
   </>
  )
}
