import BigNumber from 'bignumber.js'

import config from '../kovan.config.json'

import erc20ABI from '../abi/ERC20.abi.json'
import loihiABI from '../abi/Loihi.abi.json'
import assimilatorABI from '../abi/Assimilator.abi.json'

import daiIcon from '../assets/dai.svg'
import usdcIcon from '../assets/usdc.svg'
import usdtIcon from '../assets/usdt.svg'
import susdIcon from '../assets/susd.svg'

import { ERC20, Loihi } from "./web3Classes.js"

window.BigNumber = BigNumber

export const displayAmount = (value, decimals, precision) => {

  const amount = value.dividedBy(new BigNumber(10).pow(decimals))

  if (precision === -1) return amount.toFixed()

  return amount.toFormat(precision)

}

export const bnAmount = (value, decimals) => {

  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals))

}

export const getLoihiBalances = async function (liquidity, loihi, walletAddress) {

  const shells = await loihi.balanceOf(walletAddress)
  const total = await loihi.totalSupply()
  const liqRatio = total.isZero() ? total : shells.dividedBy(total)
  const value = liquidity.total.multipliedBy(liqRatio)

  return {
    total,
    shells,
    value,
    dai: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.dai),
    usdc: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.usdc),
    usdt: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.usdt),
    susd: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.susd)
  }

}

export const getLiquidity = async (loihi) => {

  return await loihi.liquidity()

}

export const getWalletBalances = async (contracts, walletAddress) => {

  return {
    dai: await contracts.dai.balanceOf(walletAddress),
    usdc: await contracts.usdc.balanceOf(walletAddress),
    usdt: await contracts.usdt.balanceOf(walletAddress),
    susd: await contracts.susd.balanceOf(walletAddress)
  }

}

export const getAllowances = async (contracts, walletAddress) => {

  return {
    dai: await contracts.dai.allowance(walletAddress, config.LOIHI),
    usdc: await contracts.usdc.allowance(walletAddress, config.LOIHI),
    usdt: await contracts.usdt.allowance(walletAddress, config.LOIHI),
    susd: await contracts.susd.allowance(walletAddress, config.LOIHI)
  }
  
}

export const getContracts = function (web3) {

    const contractObjects = [
      new ERC20(web3, config.DAI, 'MultiCollateral Dai', 'DAI', daiIcon, 18),
      new ERC20(web3, config.USDC, 'USD Coin', 'USDC', usdcIcon, 6),
      new ERC20(web3, config.USDT, 'Tether Stablecoin', 'USDT', usdtIcon, 6),
      new ERC20(web3, config.SUSD, 'Synthetix USD', 'SUSD', susdIcon, 6)
    ]

    const loihi = new Loihi(web3, config.LOIHI, "Shell Protocol", "SHL", null, 18)

    return {
      erc20s: contractObjects,
      dai: contractObjects[0],
      usdc: contractObjects[1],
      usdt: contractObjects[2],
      susd: contractObjects[3],
      loihi
    }

}
