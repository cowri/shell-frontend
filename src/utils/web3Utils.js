import Web3 from "web3"
import BigNumber from 'bignumber.js'

import config from '../mainnet.config.json'

import erc20ABI from '../abi/ERC20.abi.json'
import usdtABI from '../abi/USDT.abi.json'
import atokenABI from '../abi/AToken.abi.json'
import ctokenABI from '../abi/CToken.abi.json'
import chaiABI from '../abi/Chai.abi.json'
import loihiABI from '../abi/Loihi.abi.json'

import asusdIcon from '../assets/aSUSD.svg'
import ausdtIcon from '../assets/aUSDT.svg'
import susdIcon from '../assets/susd.svg'
import usdcIcon from '../assets/usdc.svg'
import cdaiIcon from '../assets/cdai.svg'
import cusdcIcon from '../assets/cusdc.svg'
import daiIcon from '../assets/dai.svg'
import usdtIcon from '../assets/usdt.svg'
import chaiIcon from '../assets/chai.png'

const loihiAddress = config.LOIHI

const daiAddress = config.DAI
const chaiAddress = config.CHAI
const cdaiAddress = config.CDAI

const cusdcAddress = config.CUSDC
const usdcAddress = config.USDC

const usdtAddress = config.USDT
const ausdtAddress = config.AUSDT

const susdAddress = config.SUSD
const asusdAddress = config.ASUSD

export const displayAmount = (value, decimals, precision) => {
  return value.dividedBy(new BigNumber(10).pow(decimals)).toFixed(precision)
}

export const bnAmount = (value, decimals) => {
  return new BigNumber(value).multipliedBy(new BigNumber(10).pow(decimals))
}

export const getLoihiBalances = async function (walletAddress, loihi, reserves) {

  const shellBalance = new BigNumber(await loihi.methods.balanceOf(walletAddress).call())
  const totalShells = new BigNumber(await loihi.methods.totalSupply().call())

  const {
    daiReserve,
    susdReserve,
    usdcReserve,
    usdtReserve,
  } = reserves

  const daiBal = totalShells === 0 ? 0 : shellBalance.dividedBy(totalShells).multipliedBy(daiReserve)
  const susdBal = totalShells === 0 ? 0 : shellBalance.dividedBy(totalShells).multipliedBy(susdReserve)
  const usdcBal = totalShells === 0 ? 0 : shellBalance.dividedBy(totalShells).multipliedBy(usdcReserve)
  const usdtBal = totalShells === 0 ? 0 : shellBalance.dividedBy(totalShells).multipliedBy(usdtReserve)

  return {
    dai: daiBal,
    susd: susdBal,
    usdc: usdcBal,
    usdt: usdtBal,
    shell: shellBalance,
    totalShells,
  }
}

export const getReserves = async (loihi) => {
  const results = await loihi.methods.totalReserves().call()
  return {
    totalReserves: new BigNumber(results[0]),
    daiReserve: new BigNumber(results[1][0]),
    usdcReserve: new BigNumber(results[1][1]),
    usdtReserve: new BigNumber(results[1][2]),
    susdReserve: new BigNumber(results[1][3])
  }
}

export const getContracts = function (web3) {

    const contractObjects = [
      new web3.eth.Contract(erc20ABI, daiAddress),
      new web3.eth.Contract(erc20ABI, chaiAddress),
      new web3.eth.Contract(erc20ABI, cdaiAddress),
      new web3.eth.Contract(erc20ABI, usdcAddress),
      new web3.eth.Contract(erc20ABI, cusdcAddress),
      new web3.eth.Contract(erc20ABI, usdtAddress),
      new web3.eth.Contract(erc20ABI, ausdtAddress),
      new web3.eth.Contract(erc20ABI, susdAddress),
      new web3.eth.Contract(erc20ABI, asusdAddress)
    ]

    contractObjects[0].name = 'MultiCollateral Dai'
    contractObjects[1].name = 'Chai'
    contractObjects[2].name = 'Compound Dai'
    contractObjects[3].name = 'USD Coin'
    contractObjects[4].name = 'Compound USD Coin'
    contractObjects[5].name = 'Tether Stablecoin'
    contractObjects[6].name = 'Aave Tether'
    contractObjects[7].name = 'Synthetix USD'
    contractObjects[8].name = 'Aave Synthetix USD'

    contractObjects[0].symbol = 'DAI'
    contractObjects[1].symbol = 'CHAI'
    contractObjects[2].symbol = 'cDAI'
    contractObjects[3].symbol = 'USDC'
    contractObjects[4].symbol = 'cUSDC'
    contractObjects[5].symbol = 'USDT'
    contractObjects[6].symbol = 'aUSDT'
    contractObjects[7].symbol = 'SUSD'
    contractObjects[8].symbol = 'aSUSD'

    contractObjects[0].icon = daiIcon
    contractObjects[1].icon = chaiIcon 
    contractObjects[2].icon = cdaiIcon
    contractObjects[3].icon = usdcIcon
    contractObjects[4].icon = cusdcIcon
    contractObjects[5].icon = usdtIcon
    contractObjects[6].icon = ausdtIcon 
    contractObjects[7].icon = susdIcon
    contractObjects[8].icon = asusdIcon

    contractObjects[0].decimals = 18
    contractObjects[1].decimals = 18
    contractObjects[2].decimals = 8
    contractObjects[3].decimals = 6
    contractObjects[4].decimals = 8
    contractObjects[5].decimals = 6 
    contractObjects[6].decimals = 6 
    contractObjects[7].decimals = 18 
    contractObjects[8].decimals = 18

    contractObjects[0].getDisplay = function (amount) { return displayAmount(amount, 18) }
    contractObjects[1].getDisplay = function (amount) { return displayAmount(amount, 18) }
    contractObjects[2].getDisplay = function (amount) { return displayAmount(amount, 8) }
    contractObjects[3].getDisplay = function (amount) { return displayAmount(amount, 6) }
    contractObjects[4].getDisplay = function (amount) { return displayAmount(amount, 8) }
    contractObjects[5].getDisplay = function (amount) { return displayAmount(amount, 6) }
    contractObjects[6].getDisplay = function (amount) { return displayAmount(amount, 6) }
    contractObjects[7].getDisplay = function (amount) { return displayAmount(amount, 18) }
    contractObjects[8].getDisplay = function (amount) { return displayAmount(amount, 18) }

    return {
      dai: contractObjects[0],
      chai: contractObjects[1],
      cdai: contractObjects[2],
      usdc: contractObjects[3],
      cusdc: contractObjects[4],
      usdt: contractObjects[5],
      ausdt: contractObjects[6],
      susd: contractObjects[7],
      asusd: contractObjects[8],
      loihi: new web3.eth.Contract(loihiABI, loihiAddress)
    }

}