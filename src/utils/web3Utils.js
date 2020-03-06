import Web3 from "web3"
import config from '../kovan.config.json'

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

let Decimal = require('decimal.js-light')
Decimal = require('toformat')(Decimal)

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

export const WadDecimal = Decimal.clone({
  rounding: 1, // round down
  precision: 78,
  toExpNeg: -18,
  toExpPos: 78,
})

WadDecimal.format = {
  groupSeparator: ",",
  groupSize: 3,
}

export const SixDecimal = Decimal.clone({
  rounding: 1,
  precision: 78,
  toExpNeg: -6,
  toExpPos: 78
})

SixDecimal.format = {
  groupSeparator: ",",
  groupSize: 3,
}

export const EightDecimal = Decimal.clone({
  rounding: 1,
  preciison: 78,
  toExpNeg: -8,
  toExpPos: 78
})

EightDecimal.format = {
  groupSeparator: ",",
  groupSize: 3,
}


function toFixed(num, precision) {
    return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

export const getLoihiBalances = async function () {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const loihi = store.get('loihiObject')
  if (!walletAddress || !loihi) return

  const shellBalanceRaw = await loihi.methods.balances(walletAddress).call()
  store.set('shellBalanceRaw', shellBalanceRaw)
  const shellBalanceDecimal = new WadDecimal(shellBalanceRaw).div('1e18')
  store.set('shellBalanceDecimal', shellBalanceDecimal)
  const shellBalance = toFixed(parseFloat(web3.utils.fromWei(shellBalanceRaw)),5)
  store.set('shellBalance', shellBalance)

  const totalShellsRaw = await loihi.methods.totalSupply().call()
  const totalShells = toFixed(parseFloat(web3.utils.fromWei(totalShellsRaw)),5)
  store.set('totalShells', totalShells)

  const daiReserveRaw = store.get('daiReserveRaw')
  const usdcReserveRaw = store.get('usdcReserveRaw')
  const usdtReserveRaw = store.get('usdtReserveRaw')
  const susdReserveRaw = store.get('susdReserveRaw')

  const daiBal = shellBalanceRaw / totalShellsRaw * daiReserveRaw
  const usdcBal = shellBalanceRaw / totalShellsRaw * usdcReserveRaw
  const usdtBal = shellBalanceRaw / totalShellsRaw * usdtReserveRaw
  const susdBal = shellBalanceRaw / totalShellsRaw * susdReserveRaw

  store.set('loihiDaiBalanceRaw', daiBal)
  store.set('loihiUsdcBalanceRaw', usdcBal)
  store.set('loihiDaiBalanceRaw', usdtBal)
  store.set('loihiDaiBalanceRaw', susdBal)

  store.set('loihiDaiBalance', toFixed(parseFloat(web3.utils.fromWei(daiBal.toString())),5))
  store.set('loihiUsdcBalance', toFixed(parseFloat(web3.utils.fromWei(usdcBal.toString())),5))
  store.set('loihiUsdtBalance', toFixed(parseFloat(web3.utils.fromWei(usdtBal.toString())),5))
  store.set('loihiSusdBalance', toFixed(parseFloat(web3.utils.fromWei(susdBal.toString())),5))

  store.set('loihiDaiBalanceDecimal', new WadDecimal(daiBal))
  store.set('loihiUsdcBalanceDecimal', new WadDecimal(usdcBal))
  store.set('loihiUsdtBalanceDecimal', new WadDecimal(usdtBal))
  store.set('loihiSusdBalanceDecimal', new WadDecimal(susdBal))

}

export const getReserves = async function () {
  const { store } = this.props 

  const web3 = store.get('web3')
  const loihi = store.get('loihiObject')
  const walletAddress = store.get('walletAddress')

  if (!loihi || !walletAddress) return

  loihi.methods.totalReserves().call().then(function () {

    store.set('totalReservesRaw', arguments[0][0])
    const totalReservesDecimal = new WadDecimal(arguments[0][0]).div('1e18')
    store.set('totalReservesDecimal', totalReservesDecimal)
    const totalReserves = toFixed(parseFloat(web3.utils.fromWei(arguments[0][0])), 5)
    store.set('totalReserves', totalReserves)

    const daiReserveRaw = arguments[0][1][0]
    store.set('daiReserveRaw', daiReserveRaw)
    const daiReserveDecimal = new WadDecimal(arguments[0][1][0]).div('1e18')
    store.set('daiReserveDecimal', daiReserveDecimal)
    const daiReserve = toFixed(parseFloat(web3.utils.fromWei(arguments[0][1][0])), 5)
    store.set('daiReserve', daiReserve)

    const usdcReserveRaw = arguments[0][1][1]
    store.set('usdcReserveRaw', usdcReserveRaw)
    const usdcReserveDecimal = new SixDecimal(arguments[0][1][1]).div('1e18')
    store.set('usdcReserveDecimal', usdcReserveDecimal)
    const usdcReserve = toFixed(parseFloat(web3.utils.fromWei(arguments[0][1][2])), 5)
    store.set('usdcReserve', usdcReserve)

    const usdtReserveRaw = arguments[0][1][2]
    store.set('usdtReserveRaw', usdtReserveRaw)
    const usdtReserveDecimal = new SixDecimal(arguments[0][1][2]).div('1e18')
    store.set('usdtReserveDecimal', usdtReserveDecimal)
    const usdtReserve = toFixed(parseFloat(web3.utils.fromWei(arguments[0][1][2])), 5)
    store.set('usdtReserve', usdtReserve)

    const susdReserveRaw = arguments[0][1][3]
    store.set('susdReserveRaw', susdReserveRaw)
    const susdReserveDecimal = new WadDecimal(arguments[0][1][3]).div('1e18')
    store.set('susdReserveDecimal', susdReserveDecimal)
    const susdReserve = toFixed(parseFloat(web3.utils.fromWei(arguments[0][1][3])), 5)
    store.set('susdReserve', susdReserve)

  })
}

export const setupContracts = async function () {
    const { store } = this.props
    const web3 = store.get('web3')

    const contractObjects = [
      new web3.eth.Contract(erc20ABI, daiAddress),
      new web3.eth.Contract(chaiABI, chaiAddress),
      new web3.eth.Contract(ctokenABI, cdaiAddress),
      new web3.eth.Contract(erc20ABI, usdcAddress),
      new web3.eth.Contract(ctokenABI, cusdcAddress),
      new web3.eth.Contract(usdtABI, usdtAddress),
      new web3.eth.Contract(atokenABI, ausdtAddress),
      new web3.eth.Contract(erc20ABI, susdAddress),
      new web3.eth.Contract(atokenABI, asusdAddress)
    ]

    contractObjects[0].symbol = 'MultiCollateral Dai'
    contractObjects[1].symbol = 'Chai'
    contractObjects[2].symbol = 'Compound Dai'
    contractObjects[3].symbol = 'USD Coin'
    contractObjects[4].symbol = 'Compound USD Coin'
    contractObjects[5].symbol = 'Tether Stablecoin'
    contractObjects[6].symbol = 'Aave Tether'
    contractObjects[7].symbol = 'Synthetix USD'
    contractObjects[8].symbol = 'Aave Synthetix USD'

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

    contractObjects[0].getDecimal = function (amount) { return new WadDecimal(amount) }
    contractObjects[1].getDecimal = function (amount) { return new WadDecimal(amount) }
    contractObjects[2].getDecimal = function (amount) { return new EightDecimal(amount) }
    contractObjects[3].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[4].getDecimal = function (amount) { return new EightDecimal(amount) }
    contractObjects[5].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[6].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[7].getDecimal = function (amount) { return new WadDecimal(amount) }
    contractObjects[8].getDecimal = function (amount) { return new WadDecimal(amount) }

    contractObjects[0].getRaw = function (amount) { return new WadDecimal(amount).mul('1e18').toFixed() }
    contractObjects[1].getRaw = function (amount) { return new WadDecimal(amount).mul('1e18').toFixed() }
    contractObjects[2].getRaw = function (amount) { return new EightDecimal(amount).mul('1e8').toFixed() }
    contractObjects[3].getRaw = function (amount) { return new SixDecimal(amount).mul('1e6').toFixed() }
    contractObjects[4].getRaw = function (amount) { return new EightDecimal(amount).mul('1e8').toFixed() }
    contractObjects[5].getRaw = function (amount) { return new SixDecimal(amount).mul('1e6').toFixed() }
    contractObjects[6].getRaw = function (amount) { return new SixDecimal(amount).mul('1e6').toFixed() }
    contractObjects[7].getRaw = function (amount) { return new WadDecimal(amount).mul('1e18').toFixed() }
    contractObjects[8].getRaw = function (amount) { return new WadDecimal(amount).mul('1e18').toFixed() }

    store.set('contractObjects', contractObjects)

    store.set('daiObject', contractObjects[0])
    store.set('chaiObject', contractObjects[1])
    store.set('cdaiObject', contractObjects[2])
    store.set('usdcObject', contractObjects[3])
    store.set('cusdcObject', contractObjects[4])
    store.set('usdtObject', contractObjects[5])
    store.set('ausdtObject', contractObjects[6])
    store.set('susdObject', contractObjects[7])
    store.set('asusdObject', contractObjects[8])

    const loihi = new web3.eth.Contract(loihiABI, loihiAddress)
    loihi.getDecimal = function (amount) { return new WadDecimal(amount) }
    store.set('loihiObject', loihi)

}

export const getData = async function() {
    getLoihiBalances.bind(this)()
    getReserves.bind(this)()

}

const secondsInYear = WadDecimal(60 * 60 * 24 * 365)

export const initBrowserWallet = async function(prompt) {
    const store = this.props.store
    window.store = store

    store.set('walletLoading', true)
    if (!localStorage.getItem('walletKnown') && !prompt) return

    let web3Provider

    // Initialize web3 (https://medium.com/coinmonks/web3-js-ethereum-javascript-api-72f7b22e2f0a)
    if (window.ethereum) {
        web3Provider = window.ethereum
        try {
            // Request account access
            await window.ethereum.enable()
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }

        window.ethereum.on('accountsChanged', (accounts) => {
            initBrowserWallet.bind(this)()
        })
    }
    // Legacy dApp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, display err
    else {
        console.log("Please install MetaMask!")
        store.set('web3Failure', true)
        return
    }

    const web3 = new Web3(web3Provider)
    const network = await web3.eth.net.getId()
    console.log("network...", network)
    store.set('network', network)
    store.set('web3Failure', false)
    store.set('web3', web3)
    const walletType = 'browser'
    const accounts = await web3.eth.getAccounts()
    localStorage.setItem('walletKnown', true)
    store.set('walletLoading', false)
    store.set('walletAddress', accounts[0])
    store.set('walletType', walletType)
    setupContracts.bind(this)()
    getData.bind(this)()
}

export default {
    initBrowserWallet,
}
