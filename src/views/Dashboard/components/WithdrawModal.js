import React, { useState } from 'react'
import styled from 'styled-components'

import TextField from '@material-ui/core/TextField'

import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalContent from '../../../components/ModalContent'
import ModalTitle from '../../../components/ModalTitle'
import Row from '../../../components/Row'
import TokenIcon from '../../../components/TokenIcon'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'

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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

const WithdrawModal = ({ onWithdraw, onDismiss }) => {

  const [daiValue, setDaiValue] = useState('')
  const [susdValue, setSusdValue] = useState('')
  const [usdcValue, setUsdcValue] = useState('')
  const [usdtValue, setUsdtValue] = useState('')

  const handleChange = (e, updateHandler) => {
    const { value } = e.target
    updateHandler(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(daiValue, susdValue, usdcValue, usdtValue)
  }

  return (
    <Modal onDismiss={onDismiss}>
      <ModalTitle>Withdraw Funds</ModalTitle>
      <StyledForm onSubmit={handleSubmit}>
        <ModalContent>
          <Row hideBorder>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>DAI</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={daiIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="DAI"
              onChange={e => handleChange(e, setDaiValue)}
              placeholder="0"
              value={daiValue}
            />
          </Row>

          <Row hideBorder>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>USDC</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={usdcIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="USD Coin"
              onChange={e => handleChange(e, setUsdcValue)}
              placeholder="0"
              value={usdcValue}
            />
          </Row>

          <Row hideBorder>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>USDT</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={usdtIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="Tether"
              onChange={e => handleChange(e, setUsdtValue)}
              placeholder="0"
              value={usdtValue}
            />
          </Row>

          <Row hideBorder>
            <TextField
              fullWidth
              InputProps={{
                endAdornment: <StyledEndAdornment>SUSD</StyledEndAdornment>,
                startAdornment: (
                  <StyledStartAdornment>
                    <TokenIcon size={24}>
                      <img src={susdIcon} />
                    </TokenIcon>
                  </StyledStartAdornment>
                )
              }}
              label="Synthetix USD"
              onChange={e => handleChange(e, setSusdValue)}
              placeholder="0"
              value={susdValue}
            />
          </Row>
        </ModalContent>
        <ModalActions>
          <Button outlined onClick={onDismiss}>Cancel</Button>
          <Button>Withdraw</Button>
        </ModalActions>
      </StyledForm>
    </Modal>
  )
}

export default WithdrawModal