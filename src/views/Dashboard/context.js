import React from 'react'
import BigNumber from 'bignumber.js'
import BN from '../../utils/BN.js';

export default React.createContext({
  account: undefined,
  allowances: {},
  balances: {},
  contracts: {},
  shell: {},
  liquidity: {},
  totalShells: BN(0),
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
