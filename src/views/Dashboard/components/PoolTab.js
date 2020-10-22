import React, { useContext } from 'react'
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import Button from '../../../components/Button'
import LabelledValue from '../../../components/LabelledValue'

import Overview from '../../../components/Overview'
import OverviewSection from '../../../components/OverviewSection'
import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import DashboardContext from '../context'

const StyledPoolTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const StyledTokenName = styled.span`
  align-items: center;
  display: flex;
  flex: 1.5;
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

const PoolTab = ({ buttonsDisabled }) => {
  
  const {
    presentDeposit,
    presentWithdraw,
    engine,
    state
  } = useContext(DashboardContext)

  const rows = state.has('assets') ? engine.assets.map( (asset, ix) => { 

    const liqTotal = state.getIn(['shell','liquiditiesTotal', ix, 'display'])

    const liqOwned = state.getIn(['shell','liquiditiesOwned', ix, 'display'])

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
    
  }) : [] 

  const liqTotal = state.has('shell') 
    ? state.getIn(['shell', 'liquidityTotal', 'display']) 
    : 0


  const liqOwned = state.has('shell') 
    ? state.getIn(['shell', 'liquidityOwned', 'display']) 
    : 0

  return (
    <StyledPoolTab>
      <Overview>
        <OverviewSection>
          <LabelledValue label="Pool Balance" value={ liqTotal} />
        </OverviewSection>
        <OverviewSection>
          <LabelledValue label="Your Balance" value={ liqOwned } />
        </OverviewSection>
      </Overview>
      <StyledRows>
        <Row head>
          <span style={{ flex: 1.5 }}> Token </span>
          <span style={{ flex: 1, textAlign: 'right' }}> Pool Balance </span>
          <span style={{ flex: 1, textAlign: 'right' }}> My Balance </span>
        </Row>
        { rows }
      </StyledRows>
      <StyledActions>
        <Button disabled={!state.has('assets')} onClick={presentDeposit}>Deposit</Button>
        <div style={{ width: 12 }} />
        <Button disabled={!state.has('assets')} outlined onClick={presentWithdraw}>Withdraw</Button>
      </StyledActions>
    </StyledPoolTab>
  )
}

export default PoolTab