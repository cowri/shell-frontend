import React from 'react'
import BigNumber from 'bignumber.js'

export default React.createContext({
  account: undefined,
  reserves: {},
  totalShells: new BigNumber(0),
  onEnable: () => {},
  web3: undefined,
})