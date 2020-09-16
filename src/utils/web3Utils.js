import BigNumber from 'bignumber.js'

import config from '../kovan.ctokens.config.json'

import erc20ABI from '../abi/ERC20.abi.json'
import shellABI from '../abi/Shell.abi.json'
import assimilatorABI from '../abi/Assimilator.abi.json'

import daiIcon from '../assets/dai.svg'
import usdcIcon from '../assets/usdc.svg'
import usdtIcon from '../assets/usdt.svg'
import susdIcon from '../assets/susd.svg'

import { ERC20, Shell } from "./web3Classes.js"
import Asset from './Asset'

window.BigNumber = BigNumber

export const displayAmount = (value, decimals, precision) => {

  const amount = value.dividedBy(new BigNumber(10).pow(decimals))

  if (precision === -1) return amount.toFixed()

  return amount.toFormat(precision)

}

export const bnAmount = (value, decimals) => {

  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals))

}

export const getShellBalances = async function (liquidity, shell, walletAddress) {

  const shells = await shell.balanceOf(walletAddress)
  const total = await shell.totalSupply()
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

export const getLiquidity = async (shell) => {

  return await shell.liquidity()

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
    dai: await contracts.dai.allowance(walletAddress, config.shell),
    usdc: await contracts.usdc.allowance(walletAddress, config.shell),
    usdt: await contracts.usdt.allowance(walletAddress, config.shell),
    susd: await contracts.susd.allowance(walletAddress, config.shell)
  }
  
}

export const getContracts = function (web3) {

  let contractObjects = { erc20s: [] }

  contractObjects['shell'] = new Shell(web3, config.shell, "Shell Protocol", "SHL", null, 18)

  for (let erc20 in config.assets) {

    const erc20Object = new ERC20(
      web3,
      config.assets[erc20].address,
      config.assets[erc20].name,
      config.assets[erc20].symbol, 
      config.assets[erc20].decimals
    )

    contractObjects[erc20] = erc20Object
    
    contractObjects.erc20s.push(erc20Object)

  }

  return contractObjects

}
