import React from 'react'
import BigNumber from 'bignumber.js'

export default React.createContext({
  account: undefined,
  balances: {},
  contracts: {},
  reserves: {},
  totalShells: new BigNumber(0),
  onEnable: () => {},
  walletBalances: {},
  web3: undefined,
})