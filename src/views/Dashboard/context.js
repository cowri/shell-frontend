import React from 'react'
import BigNumber from 'bignumber.js'

export default React.createContext({
  account: undefined,
  allowances: {},
  balances: {},
  contracts: {},
  shell: {},
  liquidity: {},
  totalShells: new BigNumber(0),
  updateAllState: () => {},
  presentDeposit: () => {},
  presentWithdraw: () => {},
  walletBalances: {},
  web3: undefined,
  engine: {},
  state: {},
  login: {},
  rewards: {},
})
