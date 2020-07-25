import BigNumber from 'bignumber.js'

import config from '../kovan.config.json'

import erc20ABI from '../abi/ERC20.abi.json'
import loihiABI from '../abi/Loihi.abi.json'
import assimilatorABI from '../abi/Assimilator.abi.json'

import daiIcon from '../assets/dai.svg'
import usdcIcon from '../assets/usdc.svg'
import usdtIcon from '../assets/usdt.svg'
import susdIcon from '../assets/susd.svg'

export const displayAmount = (value, decimals, precision) => {

  const amount = value.dividedBy(new BigNumber(10).pow(decimals))

  if (precision === -1) return amount.toFixed()

  return amount.toFormat(precision)

}

export const bnAmount = (value, decimals) => {

  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals))

}

export const getLoihiBalances = async function (liquidity, loihi, walletAddress) {

  const shells = new BigNumber(await loihi.methods.balanceOf(walletAddress).call())
  const total = new BigNumber(await loihi.methods.totalSupply().call())
  const liqRatio = shells.dividedBy(total)

  return {
    total,
    shells,
    dai: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.dai),
    usdc: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.usdc).dividedBy(1e12),
    usdt: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.usdt).dividedBy(1e12),
    susd: total === 0 ? 0 : liqRatio.multipliedBy(liquidity.susd).dividedBy(1e12),
  }

}

export const getLiquidity = async (loihi) => {

  const liquidity = await loihi.methods.liquidity().call()

  return {
    total: new BigNumber(liquidity[0]),
    dai: new BigNumber(liquidity[1][0]),
    usdc: new BigNumber(liquidity[1][1]),
    usdt: new BigNumber(liquidity[1][2]),
    susd: new BigNumber(liquidity[1][3])
  }

}

export const getWalletBalances = async (contracts, walletAddress) => {

  console.log("contracts", contracts)
  console.log("walletAddress", walletAddress)

  return {
    dai: new BigNumber(await contracts.dai.methods.balanceOf(walletAddress).call()),
    usdc: new BigNumber(await contracts.usdc.methods.balanceOf(walletAddress).call()),
    usdt: new BigNumber(await contracts.usdt.methods.balanceOf(walletAddress).call()),
    susd: new BigNumber(await contracts.susd.methods.balanceOf(walletAddress).call())
  }

}

export const getAllowances = async (contracts, walletAddress) => {

  return {
    dai: new BigNumber(await contracts.dai.methods.allowance(walletAddress, config.LOIHI).call()),
    usdc: new BigNumber(await contracts.usdc.methods.allowance(walletAddress, config.LOIHI).call()),
    usdt: new BigNumber(await contracts.usdt.methods.allowance(walletAddress, config.LOIHI).call()),
    susd: new BigNumber(await contracts.susd.methods.allowance(walletAddress, config.LOIHI).call())
  }
  
}

export const getContracts = function (web3) {

    const contractObjects = [
      new web3.eth.Contract(erc20ABI, config.DAI),
      new web3.eth.Contract(erc20ABI, config.USDC),
      new web3.eth.Contract(erc20ABI, config.USDT),
      new web3.eth.Contract(erc20ABI, config.SUSD)
    ]

    contractObjects[0].name = 'MultiCollateral Dai'
    contractObjects[1].name = 'USD Coin'
    contractObjects[2].name = 'Tether Stablecoin'
    contractObjects[3].name = 'Synthetix USD'

    contractObjects[0].symbol = 'DAI'
    contractObjects[1].symbol = 'USDC'
    contractObjects[2].symbol = 'USDT'
    contractObjects[3].symbol = 'SUSD'

    contractObjects[0].icon = daiIcon
    contractObjects[1].icon = usdcIcon
    contractObjects[2].icon = usdtIcon
    contractObjects[3].icon = susdIcon

    contractObjects[0].decimals = 18
    contractObjects[1].decimals = 6
    contractObjects[2].decimals = 6 
    contractObjects[3].decimals = 6 

    contractObjects[0].getDisplay = function (amount) { return displayAmount(amount, 18) }
    contractObjects[1].getDisplay = function (amount) { return displayAmount(amount, 6) }
    contractObjects[2].getDisplay = function (amount) { return displayAmount(amount, 6) }
    contractObjects[3].getDisplay = function (amount) { return displayAmount(amount, 6) }


    function getNumeraireAmount (amount) { 
      console.log("amount", amount)
      // return amount.multipliedBy(new BigNumber(10).pow(18 - this.decimals)) 
    }

    contractObjects[0].getNumeraireAmount = getNumeraireAmount
    contractObjects[1].getNumeraireAmount = getNumeraireAmount
    contractObjects[2].getNumeraireAmount = getNumeraireAmount
    contractObjects[3].getNumeraireAmount = getNumeraireAmount

    return {
      erc20s: contractObjects,
      dai: contractObjects[0],
      usdc: contractObjects[1],
      usdt: contractObjects[2],
      susd: contractObjects[3],
      loihi: new web3.eth.Contract(loihiABI, config.LOIHI)
    }
}