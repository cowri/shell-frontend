import Web3 from "web3"
import config from '../config.json'
import erc20ABI from '../abi/ERC20.abi.json'
import atokenABI from '../abi/AToken.abi.json'
import ctokenABI from '../abi/CToken.abi.json'
import chaiABI from '../abi/Chai.abi.json'
import loihiABI from '../abi/Loihi.abi.json'
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

export const getLoihiBalance = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const loihi = store.get('loihiObject')
  if (!walletAddress || !loihi) return
  const loihiBalanceRaw = await loihi.methods.balances(walletAddress).call()
  console.log("loihi balance raw", loihiBalanceRaw)
  const loihiBalanceDecimal = new WadDecimal(loihiBalanceRaw).div('1e18')
  store.set('loihiBalanceDecimal', loihiBalanceDecimal)
  console.log("loihi balance from dec", loihiBalanceDecimal.toFixed())
  const loihiBalance = toFixed(parseFloat(web3.utils.fromWei(loihiBalanceRaw)),5)
  store.set('loihiBalance', loihiBalance)
}

export const getLoihiUnderlyingBalances = async function () {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const loihi = store.get('loihiObject')
  if (!walletAddress || !loihi) return
  const totalShells = await loihi.methods.totalSupply().call()
  const shellBalance = await loihi.methods.balances(walletAddress).call()
  const daiBal = shellBalance / totalShells * store.get('daiReserve')
  const usdcBal = shellBalance / totalShells * store.get('usdcReserve')
  const usdtBal = shellBalance / totalShells * store.get('usdtReserve')
  const susdBal = shellBalance / totalShells * store.get('susdReserve')
  store.set('loihiDaiBalance', new WadDecimal(daiBal > 0 ? daiBal : 0))
  store.set('loihiUsdcBalance', new SixDecimal(usdcBal > 0 ? usdcBal : 0))
  store.set('loihiUsdtBalance', new SixDecimal(usdtBal > 0 ? usdtBal : 0))
  store.set('loihiSusdBalance', new SixDecimal(susdBal > 0 ? susdBal : 0))
}

export const getDaiReserve = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const cdai = store.get('cdaiObject')
  if (!walletAddress || !cdai) return
  const daiBalanceRaw = await cdai.methods.balanceOfUnderlying(loihiAddress).call()
  const daiBalanceDecimal = new WadDecimal(daiBalanceRaw).div('1e18')
  store.set('daiReserveDecimal', daiBalanceDecimal)
  const daiBalance = toFixed(parseFloat(web3.utils.fromWei(daiBalanceRaw)),5)
  store.set('daiReserve', daiBalance)
}

export const getUsdcReserve = async function () {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const cusdc = store.get('cusdcObject')
  if (!walletAddress || !cusdc) return
  const usdcBalanceRaw = await cusdc.methods.balanceOfUnderlying(loihiAddress).call()
  const usdcBalanceDecimal = new SixDecimal(usdcBalanceRaw).div('1e6')
  store.set('usdcReserveDecimal', usdcBalanceDecimal)
  const usdcBalance = toFixed(parseFloat(web3.utils.fromWei(usdcBalanceRaw, 'mwei')),5)
  store.set('usdcReserve', usdcBalance)
}

export const getUsdtReserve = async function () {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const ausdt = store.get('ausdtObject')
  if (!walletAddress || !ausdt) return
  const usdtBalanceRaw = await ausdt.methods.balanceOf(loihiAddress).call()
  const usdtBalanceDecimal = new SixDecimal(usdtBalanceRaw).div('1e6')
  store.set('usdtReserveDecimal', usdtBalanceDecimal)
  const usdtBalance = toFixed(parseFloat(web3.utils.fromWei(usdtBalanceRaw, 'mwei')),5)
  store.set('usdtReserve', usdtBalance)
}

export const getSusdReserve = async function () {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const asusd = store.get('asusdObject')
  if (!walletAddress || !asusd) return
  const susdBalanceRaw = await asusd.methods.balanceOf(loihiAddress).call()
  const susdBalanceDecimal = new SixDecimal(susdBalanceRaw).div('1e6')
  store.set('susdReserveDecimal', susdBalanceDecimal)
  const susdBalance = toFixed(parseFloat(web3.utils.fromWei(susdBalanceRaw, 'mwei')),5)
  store.set('susdReserve', susdBalance)
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
      new web3.eth.Contract(erc20ABI, usdtAddress),
      new web3.eth.Contract(atokenABI, ausdtAddress),
      new web3.eth.Contract(erc20ABI, susdAddress),
      new web3.eth.Contract(atokenABI, asusdAddress)
    ]

    contractObjects[0].name = 'Dai'
    contractObjects[1].name = 'Chai'
    contractObjects[2].name = 'cDai'
    contractObjects[3].name = 'Usdc'
    contractObjects[4].name = 'cUsdc'
    contractObjects[5].name = 'Usdt'
    contractObjects[6].name = 'aUsdt'
    contractObjects[7].name = 'sUsd'
    contractObjects[8].name = 'asUsd'

    contractObjects[0].decimals = 18
    contractObjects[1].decimals = 18
    contractObjects[2].decimals = 8
    contractObjects[3].decimals = 6
    contractObjects[4].decimals = 8
    contractObjects[5].decimals = 6
    contractObjects[6].decimals = 6
    contractObjects[7].decimals = 6
    contractObjects[8].decimals = 6

    contractObjects[0].getDecimal = function (amount) { return new WadDecimal(amount) }
    contractObjects[1].getDecimal = function (amount) { return new WadDecimal(amount) }
    contractObjects[2].getDecimal = function (amount) { return new EightDecimal(amount) }
    contractObjects[3].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[4].getDecimal = function (amount) { return new EightDecimal(amount) }
    contractObjects[5].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[6].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[7].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[8].getDecimal = function (amount) { return new SixDecimal(amount) }

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
    getLoihiBalance.bind(this)()
    getLoihiUnderlyingBalances.bind(this)()
    getDaiReserve.bind(this)()
    getUsdcReserve.bind(this)()
    getUsdtReserve.bind(this)()
    getSusdReserve.bind(this)()
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
