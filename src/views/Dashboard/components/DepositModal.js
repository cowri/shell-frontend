import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import { withTheme } from '@material-ui/core/styles'
import DoneIcon from '@material-ui/icons/Done'
import HourglassFullIcon from '@material-ui/icons/HourglassFull'
import WarningIcon from '@material-ui/icons/Warning'

import Button from '../../../components/Button'
import Loader from '../../../components/Loader'
import Modal from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalConfirmMetamask from '../../../components/ModalConfirmMetamask'
import ModalContent from '../../../components/ModalContent'
import ModalIcon from '../../../components/ModalIcon'
import ModalTitle from '../../../components/ModalTitle'
import TokenIcon from '../../../components/TokenIcon'

import daiIcon from '../../../assets/dai.svg'
import susdIcon from '../../../assets/susd.svg'
import usdcIcon from '../../../assets/usdc.svg'
import usdtIcon from '../../../assets/usdt.svg'

import { bnAmount, displayAmount } from '../../../utils/web3Utils'

import DashboardContext from '../context'

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

const StyledRows = styled.div`
  margin-bottom: 24px;
  margin-top: -24px;
`

const StyledLabelBar = withTheme(styled.div`
  align-items: center;
  color: ${props => props.theme.palette.grey[500]};
  display: flex;
  height: 32px;
  justify-content: space-between;
  margin-top: 24px;
`)

const DepositModal = ({ onDismiss }) => {
  const {
    account,
    allowances,
    contracts,
    onUpdateAllowances,
    walletBalances,
    web3,
  } = useContext(DashboardContext)

  const [step, setStep] = useState('start')

  const [daiValue, setDaiValue] = useState('')
  const [susdValue, setSusdValue] = useState('')
  const [usdcValue, setUsdcValue] = useState('')
  const [usdtValue, setUsdtValue] = useState('')

  // should change to useReducer
  const [unlocking, setUnlocking] = useState({})

  const availableDai = walletBalances.dai ? displayAmount(walletBalances.dai, contracts.dai.decimals, -1) : '--'
  const availableUsdc = walletBalances.usdc ? displayAmount(walletBalances.usdc, contracts.usdc.decimals, -1) : '--'
  const availableUsdt = walletBalances.usdt ? displayAmount(walletBalances.usdt, contracts.usdt.decimals, -1) : '--'
  const availableSusd = walletBalances.susd ? displayAmount(walletBalances.susd, contracts.susd.decimals, -1) : '--'

  const handleChange = (e, updateHandler) => {
    const { value } = e.target
    if (!isNaN(value)) {
      updateHandler(value)
    }
  }

  const handleDeposit = async () => {
    setStep('confirmingMetamask')

    const addresses = [
      contracts.dai.options.address,
      contracts.usdc.options.address,
      contracts.usdt.options.address,
      contracts.susd.options.address,
    ]
    const amounts = [
      bnAmount(daiValue, contracts.dai.decimals).toFixed(),
      bnAmount(usdcValue ? usdcValue : 0, contracts.usdc.decimals).toFixed(),
      bnAmount(usdtValue ? usdtValue : 0, contracts.usdt.decimals).toFixed(),
      bnAmount(susdValue ? susdValue : 0, contracts.susd.decimals).toFixed(),
    ]

    // Should be abstracted to web3Utils / withWallet
    const tx = contracts.loihi.methods.selectiveDeposit(addresses, amounts, 1, Date.now() + 2000)
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
      .once('transactionHash', hash => {
        setStep('depositing')
      })
      .on('error', error => {
        console.log('error')
        setStep('error')
      })
      .then(receipt => {
        setStep('success')
      }).catch(error => setStep('error'))

  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleDeposit()
  }

  const handleUnlock = async (e, contract, tokenKey) => {
    e.preventDefault()
    setStep('confirmingMetamask')

    // Should be abstracted to web3Utils / withWallet
    const tx = contract.methods.approve(contracts.loihi.options.address, '-1')
    const estimate = await tx.estimateGas({from: account})
    const gasPrice = await web3.eth.getGasPrice()
    tx.send({ from: account, gas: Math.floor(estimate * 1.5), gasPrice: gasPrice})
      .once('transactionHash', hash => {
        setStep('start')
        setUnlocking({ ...unlocking, [tokenKey]: true })
      })
      .on('error', error => {
        console.log(error)
        setStep('error')
        setUnlocking({ ...unlocking, [tokenKey]: false })
      })
      .then(receipt => {
        setUnlocking({ ...unlocking, [tokenKey]: false })
        onUpdateAllowances()
      }).catch(error => setStep('start'))
  }

  return (
    <>
      {step === 'start' && (
        <Modal onDismiss={onDismiss}>
          <ModalTitle>Deposit Funds</ModalTitle>
          <ModalContent>
            <StyledForm onSubmit={handleSubmit}>
              <StyledRows>
                <TokenInput
                  available={availableDai}
                  icon={daiIcon}
                  locked={allowances.dai === '0'}
                  onChange={e => handleChange(e, setDaiValue)}
                  onUnlock={e => handleUnlock(e, contracts.dai, 'dai')}
                  symbol="DAI"
                  unlocking={unlocking.dai}
                  value={daiValue}
                />
                <TokenInput
                  available={availableUsdc}
                  icon={usdcIcon}
                  locked={allowances.usdc === '0'}
                  onChange={e => handleChange(e, setUsdcValue)}
                  onUnlock={e => handleUnlock(e, contracts.usdc, 'usdc')}
                  unlocking={unlocking.usdc}
                  symbol="USDC"
                  value={usdcValue}
                />
                <TokenInput
                  available={availableUsdt}
                  icon={usdtIcon}
                  locked={allowances.usdt === '0'}
                  onChange={e => handleChange(e, setUsdtValue)}
                  onUnlock={e => handleUnlock(e, contracts.usdt, 'usdt')}
                  unlocking={unlocking.usdt}
                  symbol="USDT"
                  value={usdtValue}
                />
                <TokenInput
                  available={availableSusd}
                  icon={susdIcon}
                  locked={allowances.susd === '0'}
                  onChange={e => handleChange(e, setSusdValue)}
                  onUnlock={e => handleUnlock(e, contracts.susd, 'susd')}
                  unlocking={unlocking.susd}
                  symbol="SUSD"
                  value={susdValue}
                />
              </StyledRows>
            </StyledForm>
          </ModalContent>
          <ModalActions>
            <Button outlined onClick={onDismiss}>Cancel</Button>
            <Button onClick={handleSubmit}>Deposit</Button>
          </ModalActions>
        </Modal>
      )}

      {step === 'confirmingMetamask' && (
        <ModalConfirmMetamask />
      )}

      {step === 'depositing' && (
        <Modal>
          <ModalIcon>
            <HourglassFullIcon />
          </ModalIcon>
          <ModalTitle>Please wait while transaction confirms.</ModalTitle>
          <ModalActions>
            <div style={{ flex: 1 }}>
              <Loader />
            </div>
          </ModalActions>
        </Modal>
      )}

      {step === 'success' && (
        <Modal>
          <ModalIcon>
            <DoneIcon />
          </ModalIcon>
          <ModalTitle>Deposit Successful.</ModalTitle>
          <ModalActions>
            <Button onClick={onDismiss}>Finish</Button>
          </ModalActions>
        </Modal>
      )}

      {step === 'error' && (
        <Modal>
          <ModalIcon>
            <WarningIcon />
          </ModalIcon>
          <ModalTitle>An error occured.</ModalTitle>
          <ModalActions>
            <Button onClick={() => setStep('start')}>Ok</Button>
          </ModalActions>
        </Modal>
      )}
    </>
  )
}

const TokenInput = ({
  available,
  icon,
  locked,
  onChange,
  onUnlock,
  symbol,
  unlocking,
  value
}) => (
  <>
    <StyledLabelBar>
      <span>Available: {available} {symbol}</span>
    </StyledLabelBar>
    <TextField
      disabled={locked}
      fullWidth
      InputProps={{
        endAdornment: locked ? (
          <div style={{ marginRight: 6 }}>
            <Button
              disabled={unlocking}
              outlined
              small
              onClick={onUnlock}
            >
              {unlocking ? (
                <>
                  <CircularProgress size={18} />
                  <span style={{ marginLeft: 6 }}>Unlocking</span>
                </>
              ) : 'Unlock'}
            </Button>
          </div>
        ) : (
          <StyledEndAdornment>{symbol}</StyledEndAdornment>
        ),
        startAdornment: (
          <StyledStartAdornment>
            <TokenIcon size={24}>
              <img src={icon} />
            </TokenIcon>
          </StyledStartAdornment>
        )
      }}
      onChange={onChange}
      placeholder="0"
      value={value}
    />
  </>
)

export default DepositModal