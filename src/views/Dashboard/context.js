import React from 'react'
import BigNumber from 'bignumber.js'

export default React.createContext({
  account: undefined,
  allowances: {},
  balances: {},
  contracts: {},
  reserves: {},
  totalShells: new BigNumber(0),
  onEnable: () => {},
  onUpdateAllowances: () => { console.log("update allowances") },
  onUpdateBalances: () => {},
  onUpdateWalletBalances: () => {},
  presentDeposit: () => {},
  presentWithdraw: () => {},
  walletBalances: {},
  web3: undefined,
})