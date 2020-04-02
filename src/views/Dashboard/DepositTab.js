import React, { useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'

import Button from '../../components/Button'
import Row from '../../components/Row'
import TokenIcon from '../../components/TokenIcon'

import DaiIcon from '../../components/icons/Dai'
import UsdcIcon from '../../components/icons/Usdc'

const StyledDepositTab = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

const StyledStartAdornment = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
`

const StyledEndAdornment = styled.div`
  padding-left: 6px;
  padding-right: 12px;
`

const StyledFormWrapper = styled.div`
  margin-bottom: 24px;
  width: 100%;
`
const StyledForm = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const DepositTab = () => {

  const [cDaiValue, setCDaiValue] = useState('')
  const [cUsdcValue, setCUsdcValue] = useState('')
  const [aDaiValue, setADaiValue] = useState('')
  const [aUsdcValue, setAUsdcValue] = useState('')

  const handleChange = (e, updateHandler) => {
    const { value } = e.target
    updateHandler(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('submit!')
  }

  return (
    <StyledDepositTab>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFormWrapper>
          <Row>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>cDAI</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon color="#00d395" size={36}>
                      <DaiIcon />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="Compound DAI"
              onChange={e => handleChange(e, setCDaiValue)}
              placeholder="0"
              value={cDaiValue}
            />
          </Row>

          <Row>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>cUSDC</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon color="#00d395" size={36} >
                      <UsdcIcon />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="Compound USD Coin"
              onChange={e => handleChange(e, setCUsdcValue)}
              placeholder="0"
              value={cUsdcValue}
            />
          </Row>

          <Row>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>aDAI</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon color="#b6509e" size={36} >
                      <DaiIcon />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="Aave DAI"
              onChange={e => handleChange(e, setADaiValue)}
              placeholder="0"
              value={aDaiValue}
            />
          </Row>

          <Row>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>aUSDC</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon color="#b6509e" size={32}>
                      <UsdcIcon />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="Aave USD Coin"
              onChange={e => handleChange(e, setAUsdcValue)}
              placeholder="0"
              value={aUsdcValue}
            />
          </Row>
        </StyledFormWrapper>
        <Button>Deposit</Button>
      </StyledForm>
    </StyledDepositTab>
  )
}

export default DepositTab