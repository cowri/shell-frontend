import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'
import config from '../../../mainnet.multiple.config.json'

import Button from '../../../components/Button'
import LabelledValue from '../../../components/LabelledValue'

import Overview from '../../../components/Overview'
import OverviewSection from '../../../components/OverviewSection'
import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import Deposit from '../../Deposit'
import Withdraw from '../../Withdraw'

import DashboardContext from '../context'
import {TabActions, TabContainer} from '../../../components/TabContainer/styled.js';

const StyledShellTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledTokenName = styled.span`
  align-items: center;
  display: flex;
  flex: 1;
  font-size: 22px;
  @media (max-width: 512px) {
    font-size: 18px;
  }
`


const Devider = styled.div`
  width: 40px;
  flex-shrink: 0;
  @media screen and (max-width: 512px) {
    width: 20px;
  }
`

const StyledSocialIcon = styled.a`
  align-items: center;
  color: #FFF;
  display: flex;
  height: 44px;
  justify-content: center;
  width: 44px;
  margin-left: auto;
`

const StyledBalance = styled.div`
  display: flex;
  flex: 1;
  font-size: 22px;
  justify-content: flex-start;
  @media (max-width: 512px) {
    font-size: 18px;
  }
`

const StyledActions = withTheme(styled.div`
  align-items: center;
  display: flex;
  padding: 10px 40px 0;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledRows = styled.div``

const ShellTab = ({ shellIx }) => {

  const {
    engine,
    state
  } = useContext(DashboardContext)

  const [ presentDeposit, setPresentDeposit ] = useState(false)
  const [ presentWithdraw, setPresentWithdraw ] = useState(false)

  const rows = engine.shells[shellIx].assets.map( (asset, ix) => {

    const liqTotal = state.getIn([ 'shells', shellIx, 'shell', 'liquiditiesTotal', ix, 'display' ])
    const liqOwned = state.getIn([ 'shells', shellIx, 'shell', 'liquiditiesOwned', ix, 'display' ])

    return (
      <Row>
        <StyledTokenName>
          <TokenIcon> <img alt="" src={asset.icon} /> </TokenIcon>
          <div style={{ width: 12 }} />
          <span>{asset.symbol}</span>
        </StyledTokenName>
        <StyledBalance className="number">
          { liqTotal }
        </StyledBalance>
        <StyledBalance style={{justifyContent: 'flex-end'}}>
          { liqOwned }
        </StyledBalance>
      </Row>
    )

  })

  const liqTotal = state.getIn([ 'shells', shellIx, 'shell', 'liquidityTotal', 'display' ])
  const liqOwned = state.getIn([ 'shells', shellIx, 'shell', 'liquidityOwned', 'display' ])


  return ( <>
    { presentDeposit && <Deposit shellIx={shellIx} onDismiss={() => setPresentDeposit(false)} />}
    { presentWithdraw && <Withdraw shellIx={shellIx} onDismiss={() => setPresentWithdraw(false)} />}
    <TabContainer>
      <Overview>
        <OverviewSection>
          <LabelledValue label="Pool Reserves" value={ liqTotal} />
        </OverviewSection>
        <OverviewSection>
          <LabelledValue label="Your Balance" value={ liqOwned } />
        </OverviewSection>
      </Overview>
      <StyledRows>
        <Row head>
          <span style={{ flex: 1 }}> Token </span>
          <span style={{ flex: 1, textAlign: 'left' }}> Pool Reserves </span>
          <span style={{ flex: 1, textAlign: 'right' }}> My Balances </span>
        </Row>
        { rows }
      </StyledRows>
      <TabActions>
        <Button onClick={setPresentDeposit} fullWidth>Deposit</Button>
        <Devider />
        <Button outlined onClick={setPresentWithdraw} fullWidth>Withdraw</Button>
      </TabActions>
    </TabContainer>
  </> )
}

export default ShellTab
