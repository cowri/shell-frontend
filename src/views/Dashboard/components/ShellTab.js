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

const StyledShellTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledTokenName = styled.span`
  align-items: center;
  display: flex;
  flex: 1.5;j
`

const StyledSocialIcon = styled.a`
  align-items: center;
  color: #FFF;
  display: flex;
  height: 44px;
  justify-content: center;
  margin: 10px;
  width: 44px;
  margin-left: auto;
`

const StyledBalance = styled.div`
  display: flex;
  flex: 1;
  font-size: 22px;
  font-family: Arial;
  justify-content: flex-end;
  text-align: right;
  @media (max-width: 512px) {
    font-size: 18px;
  }
`

const StyledActions = withTheme(styled.div`
  align-items: center;
  background-color: ${props => props.theme.palette.grey[50]};
  display: flex;
  height: 80px;
  padding: 0 24px;
  @media (max-width: 512px) {
    padding: 0 12px;
  }
`)

const StyledRows = styled.div`
  margin-bottom: 12px;
`

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
          <LabelledValue label={asset.symbol} value={asset.name} />
        </StyledTokenName>
        <StyledBalance className="number">
          { liqTotal }
        </StyledBalance>
        <StyledBalance>
          { liqOwned }
        </StyledBalance>
      </Row>
    )
    
  })

  const liqTotal = state.getIn([ 'shells', shellIx, 'shell', 'liquidityTotal', 'display' ]) 
  const liqOwned = state.getIn([ 'shells', shellIx, 'shell', 'liquidityOwned', 'display' ]) 
  
  let etherscan = config.network == 1 ? 'https://etherscan.io/address/' + config.shells[shellIx].shell
    : config.network == 41 ? 'https://kovan.etherscan.io/address/' + config.shells[shellIx].shell
    : ''


  return ( <>
    { presentDeposit && <Deposit shellIx={shellIx} onDismiss={() => setPresentDeposit(false)} />}
    { presentWithdraw && <Withdraw shellIx={shellIx} onDismiss={() => setPresentWithdraw(false)} />} 
    <StyledShellTab>
      <Overview>
        <OverviewSection>
          <LabelledValue label="Shell Reserves" value={ liqTotal} />
        </OverviewSection>
        <OverviewSection>
          <LabelledValue label="Your Balance" value={ liqOwned } />
        </OverviewSection>
      </Overview>
      <StyledRows>
        <Row head>
          <span style={{ flex: 1.5 }}> Token </span>
          <span style={{ flex: 1, textAlign: 'right' }}> Shell Reserves </span>
          <span style={{ flex: 1, textAlign: 'right' }}> My Balances </span>
        </Row>
        { rows }
      </StyledRows>
      <StyledActions>
        <Button onClick={setPresentDeposit}>Deposit</Button>
        <div style={{ width: 12 }} />
        <Button outlined onClick={setPresentWithdraw}>Withdraw</Button>
        <StyledSocialIcon target="_blank" href={etherscan} >
          <img src="./etherscan-logo-circle.svg" style={{width:'2em'}} alt="" />
        </StyledSocialIcon>
      </StyledActions>
    </StyledShellTab>
  </> )
}

export default ShellTab