export const chainId = +process.env.REACT_APP_CHAIN_ID

export const IS_ETH = chainId === 1
export const IS_BSC = chainId === 56
export const IS_XDAI = chainId === 100
export const IS_FTM = chainId === 250
