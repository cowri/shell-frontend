import React, {useContext, useEffect, useState} from 'react';
import {AmountInput} from '../../../../../../components/AmountInput';
import config from '../../../../../../config.js';
import {chainId} from '../../../../../../constants/chainId.js';
import {LockingTabs} from '../styled.js';
import DashboardContext from '../../../../context.js';
import BN from '../../../../../../utils/BN.js';
import DatePicker from 'react-date-picker'
import {LockingPeriodSelector, LockingUserParam} from './styled.js';
import Button from '../../../../../../components/Button';
import {currentTxStore} from '../../../../../../store/currentTxStore.js';
import {TabActions} from '../../../../../../components/TabContainer/styled.js';
import {formatDateToHuman} from '../../../../../../utils/time.js';
import {ReactComponent as Calendar} from '../../../../../../assets/icons/ic-calendar.svg';

const TABS = [
  {
    name: 'Lock',
    id: 'lock',
  },
  {
    name: 'Withdraw',
    id: 'withdraw',
  },
]

const LOCK_TABS = [
  {
    name: 'Increase amount',
    id: 'amount',
  },
  {
    name: 'Increase time',
    id: 'time',
  },
]

const LOCK_PERIODS = [7, 31, 93, 186, 730, 1460]

export const LockingBlock = ({lockingStore}) => {
  const {
    loggedIn,
    selectWallet,
  } = useContext(DashboardContext)

  const [currentTab, setCurrentTab] = useState(TABS[0])
  const [currentLockTab, setCurrentLockTab] = useState(LOCK_TABS[0])
  const [value, setValue] = useState('0')
  const [error, setError] = useState('');
  const [increaseLock, setIncreaseLock] = useState(null)
  const [lockTime, setLockTime] = useState(0)
  const [disableDates, setDisableDates] = useState({
    from: new Date((Date.now() + 86400 * 365 * 4) * 1000),
    to: new Date((lockTime + 86400 * 7) * 1000),
  })

  const amountErrorMessage = 'Amount is greater than wallet balance';
  const allowanceErrorMessage = 'Approval required';

  useEffect(() => {
    if (currentTab.id === 'lock') {
      if (BN(value).gt(lockingStore.tokens[config.cmpAddress[chainId]].balance.numeraire)) {
        setError(amountErrorMessage);
      } else if (BN(value).gt(lockingStore.tokens[config.cmpAddress[chainId]].allowance.numeraire)) {
        setError(allowanceErrorMessage);
      } else {
        setError('');
      }
    }
  }, [value, currentTab])

  let startTime = BN(Date.now()).toString()

  if (lockingStore.stats.lockEnd) {
    startTime = BN(lockingStore.stats.lockEnd)
      .minus(
        BN(lockingStore.tokens[config.veCMPAddress[chainId]].balance.raw)
          .times(86400)
          .times(365)
          .times(4)
          .div(lockingStore.stats.locked.raw),
      )
      .times(1000)
      .toFixed(0)
  }

  let newVeCMPMinted = '0'

  if (increaseLock) {
    newVeCMPMinted = BN(BN(value || 0).plus(BN(lockingStore.stats.locked.raw).div(BN(10).pow(18))))
      .times(
        BN(
          !!lockingStore.stats.lockEnd && currentLockTab.id === 'amount' ? BN(lockTime).times(1000) : increaseLock.getTime(),
        ).minus(startTime),
      )
      .div(1000)
      .div(86400)
      .div(365)
      .div(4)
      .toFixed(2, 4)
  }

  const hasEndedLock = lockingStore.stats.lockEnd > 0 && Date.now() / 1000 > lockingStore.stats.lockEnd

  useEffect(() => {
    setValue('0')
  }, [currentLockTab])

  useEffect(() => {
    setLockTime(lockingStore.stats.lockEnd)
  }, [lockingStore])

  useEffect(() => {
    if (lockTime === 0) {
      setLockTime(Date.now() / 1000)
      setIncreaseLock(new Date(Date.now() + 86400 * 7 * 1000))
    } else {
      setIncreaseLock(new Date((lockTime + 86400 * 7) * 1000))
    }
    setDisableDates({
      from: new Date(Date.now() + 86400 * 365 * 4 * 1000),
      to: new Date((lockTime + 86400 * 7) * 1000),
    })
  }, [lockTime])

  function setNewLockingPeriod(days) {
    setIncreaseLock(new Date((lockTime + 86400 * days) * 1000))
  }

  function showIncreaseLockButton(days) {
    const time1 = BN(lockTime).plus(86400 * days)
    const time2 = BN(Date.now())
      .div(1000)
      .plus(86400 * 365 * 4)
    return time1.lt(time2)
  }

  async function mainAction() {
    if (!loggedIn) {
      selectWallet()
      return
    }

    if (currentTab.id === 'lock') {
      if (error !== allowanceErrorMessage) {
        currentTxStore.setCurrentTx(() => lockingStore.createLock, { value, increaseLock })
      } else {
        currentTxStore.setCurrentTx(() => lockingStore.approve)
      }
    }
  }

  function addToLock() {
    currentTxStore.setCurrentTx(() => lockingStore.increaseAmount, value)
  }

  function increaseLockTime() {
    currentTxStore.setCurrentTx(() => lockingStore.increaseUnlockTime, increaseLock)
  }

  function withdraw() {
    currentTxStore.setCurrentTx(() => lockingStore.withdraw)
  }

  return (
    <>
      <LockingTabs>
        {TABS.map((tab) => (
          <Button
            outlined
            key={tab.id}
            onClick={() => setCurrentTab(tab)}
            fullWidth
            className={(currentTab.id === tab.id && 'current') || ''}
          >
            {tab.name}
          </Button>
        ))}
      </LockingTabs>
      {!!lockingStore.stats.lockEnd && (
        <>
          <LockingUserParam>
            <b>Your lock amount: </b>
            <span>{lockingStore.stats.locked.display} CMP</span>
          </LockingUserParam>
          <LockingUserParam>
            <b>Locked until: </b>
            <span>{formatDateToHuman(lockingStore.stats.lockEnd)}</span>
          </LockingUserParam>
        </>
      )}
      {currentTab.id === 'lock' ? (
        <>
          {!!lockingStore.stats.lockEnd && (
            <LockingTabs>
              {LOCK_TABS.map((tab) => {
                if (!showIncreaseLockButton(LOCK_PERIODS[0]) && tab.id === 'time') return null
                return (
                  <Button
                    outlined
                    key={tab.id}
                    onClick={() => setCurrentLockTab(tab)}
                    fullWidth
                    className={(currentLockTab.id === tab.id && 'current') || ''}
                  >
                    {tab.name}
                  </Button>
                )
              })}
            </LockingTabs>
          )}
          {(!lockingStore.stats.lockEnd || currentLockTab.id === 'amount') && (
            <div>
              <h2 style={{marginTop: '40px'}}>Set lock amount:</h2>
              <AmountInput
                isError={ !!error }
                isAllowanceError={error === allowanceErrorMessage}
                helperText={ error }
                balance={lockingStore.tokens[config.cmpAddress[chainId]].balance.numeraire.toFixed(4)}
                onChange={payload => setValue(payload.value) }
                symbol="CMP"
                value={value}
                onUnlock={() => lockingStore.approve()}
                fullWidth
              />
            </div>
          )}
          <div>
            {(!lockingStore.stats.lockEnd || currentLockTab.id === 'time') && (
              <div>
                <h2 style={{marginTop: '40px', marginBottom: '35px'}}>Set unlock time:</h2>
                <div style={{fontSize: '20px'}}>
                  <DatePicker
                    calendarIcon={<Calendar />}
                    value={increaseLock}
                    onChange={(e) => {
                      setIncreaseLock(e)
                    }}
                    clearIcon={null}
                    format="dd.M.y"
                    minDate={disableDates.to}
                    maxDate={disableDates.from}
                    minDetail="decade"
                  />
                </div>
                <LockingPeriodSelector>
                  {LOCK_PERIODS.map((period, i) => {
                    if (showIncreaseLockButton(period)) {
                      return (
                        <Button
                          outlined
                          small
                          key={period}
                          onClick={() => setNewLockingPeriod(period)}
                        >
                          {period === 7
                            ? '1 week'
                            : period === 31
                              ? '1 month'
                              : period === 93
                                ? '3 months'
                                : period === 186
                                  ? '6 months'
                                  : period === 730
                                    ? '2 year'
                                    : '4 years'}
                        </Button>
                      )
                    }
                    return null
                  })}
                </LockingPeriodSelector>
              </div>
            )}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px'}}>
              <h2>Your veCMP balance will be:</h2>
              <h2 style={{flexShrink: '0', marginLeft: '20px'}}>{newVeCMPMinted} veCMP</h2>
            </div>
            {!!lockingStore.stats.lockEnd && (
              <TabActions>
                {(currentLockTab.id === 'amount'
                  ? (
                    <Button fullWidth onClick={addToLock}>Increase lock amount</Button>
                  ) : (
                    <Button fullWidth onClick={increaseLockTime}>Increase lock time</Button>
                  )
                )}
              </TabActions>
            )}
          </div>
        </>
      ) : hasEndedLock ? (
        <div style={{fontSize: '20px', marginTop: '40px'}}>
          <div>Your lock ended, you can withdraw your veCMP</div>
          <TabActions>
            <Button fullWidth onClick={withdraw}>Withdraw</Button>
          </TabActions>
        </div>
      ) : lockingStore.stats.lockEnd ? (
        <div style={{fontSize: '20px', marginTop: '40px', textAlign: 'center'}}>You can withdraw your CMP after the locking period ends.</div>
      ) : (
        <div style={{fontSize: '20px', marginTop: '40px', textAlign: 'center'}}>You have no locked CMP yet</div>
      )}
      {currentTab.id === 'lock' && !lockingStore.stats.lockEnd && (
        <TabActions>
          <Button
            primary
            fullWidth
            disabled={loggedIn && error === allowanceErrorMessage && BN(value).lte(0)}
            onClick={mainAction}
          >{!loggedIn ? 'Connect' : error === allowanceErrorMessage ? 'Approve' : 'Lock'}</Button>
        </TabActions>
      )}
    </>
  )
}
