import React from 'react'
import BigNumber from 'bignumber.js'

export default React.createContext({
  account: undefined,
  allowances: {},
  balances: {},
  contracts: {},
  loihi: {},
  liquidity: {},
  totalShells: new BigNumber(0),
  onEnable: () => {},
  updateAllState: () => {},
  updateAllowances: () => {},
  updateBalances: () => {},
  updateWalletBalances:() => {},
  presentDeposit: () => {},
  presentWithdraw: () => {},
  walletBalances: {},
  web3: undefined,
})