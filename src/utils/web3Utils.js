import Web3 from "web3"
import config from '../config.json'
import daiABI from '../abi/Dai.abi.json'
import erc20ABI from '../abi/ERC20.abi.json'
import ctokenABI from '../abi/CToken.abi.json'
import potABI from '../abi/Pot.abi.json'
import chaiABI from '../abi/Chai.abi.json'
import loihiABI from '../abi/Loihi.abi.json'
import { StylesProvider } from "@material-ui/core"
let Decimal = require('decimal.js-light')
Decimal = require('toformat')(Decimal)


const daiAddress = config.DAI
const potAddress = config.POT
const chaiAddress = config.CHAI
const loihiAddress = config.LOIHI
const cdaiAddress = config.CDAI
const cusdcAddress = config.CUSDC
const usdtAddress = config.USDT
const usdcAddress = config.USDC


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

export const getPotDsr = async function() {
  const { store } = this.props
  const pot = store.get('potObject')
  if (!pot) return

  const dsrRaw = await pot.methods.dsr().call()
  if (dsrRaw === store.get('dsrRaw')) return
  store.set('dsrRaw', dsrRaw)
  let dsr = toFixed(new WadDecimal(dsrRaw).div('1e27').pow(secondsInYear).minus(1).mul(100), 2)
  store.set('dsr', dsr.toString())
}

export const getPotChi = async function() {
  const { store } = this.props
  const pot = store.get('potObject')
  if (!pot) return
  const chiRaw = await pot.methods.chi().call()
  if (chiRaw === store.get('chiRaw')) return
  store.set('chiRaw', chiRaw)
  let chi = toFixed(new WadDecimal(chiRaw).div('1e27'), 5)
  store.set('chi', chi.toString())
}

export const getDaiAllowance = async function() {
  const { store } = this.props
  const walletAddress = store.get('walletAddress')
  const dai = store.get('daiObject')
  if (!dai || !walletAddress) return
  const daiAllowance = await dai.methods.allowance(walletAddress, chaiAddress).call()
  store.set('daiAllowance', new WadDecimal(daiAllowance).div('1e18'))
}

export const getLoihiBalance = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const walletAddress = store.get('walletAddress')
  const loihi = store.get('loihiObject')
  if (!walletAddress || !loihi) return
  const loihiBalanceRaw = await loihi.methods.balances(walletAddress).call()
  const loihiBalanceDecimal = new WadDecimal(loihiBalanceRaw).div('1e18')
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
  store.set('loihiDaiBalance', new WadDecimal(daiBal > 0 ? daiBal : 0))
  store.set('loihiUsdcBalance', new SixDecimal(usdcBal > 0 ? usdcBal : 0))
  store.set('loihiUsdtBalance', new SixDecimal(usdtBal > 0 ? usdtBal : 0))

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
  const usdt = store.get('usdtObject')
  if (!walletAddress || !usdt) return
  const usdtBalanceRaw = await usdt.methods.balanceOf(loihiAddress).call()
  const usdtBalanceDecimal = new SixDecimal(usdtBalanceRaw).div('1e6')
  store.set('usdtReserveDecimal', usdtBalanceDecimal)
  const usdtBalance = toFixed(parseFloat(web3.utils.fromWei(usdtBalanceRaw, 'mwei')),5)
  store.set('usdtReserve', usdtBalance)
}

export const getChaiBalance = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const chai = store.get('chaiObject')
  const walletAddress = store.get('walletAddress')
  if (!chai || !walletAddress) return
  const chaiBalanceRaw = await chai.methods.balanceOf(walletAddress).call()
  store.set('chaiBalanceRaw', chaiBalanceRaw)
  const chaiBalanceDecimal = new WadDecimal(chaiBalanceRaw).div('1e18')
  store.set('chaiBalanceDecimal', chaiBalanceDecimal)
  const chaiBalance = toFixed(parseFloat(web3.utils.fromWei(chaiBalanceRaw, 'mwei')),5)
  store.set('chaiBalance', chaiBalance)
}

export const getChaiTotalSupply = async function() {
  const { store } = this.props
  const web3 = store.get('web3')
  const chai = store.get('chaiObject')
  if (!chai) return
  const chaiTotalSupplyRaw = await chai.methods.totalSupply().call()
  const chaiTotalSupplyDecimal = new WadDecimal(chaiTotalSupplyRaw)
  store.set('chaiTotalSupply', toDai.bind(this)(chaiTotalSupplyDecimal))
}

export const toChai = function(daiAmount) {
  const daiDecimal = daiAmount ? new WadDecimal(daiAmount).div('1e18') : new WadDecimal(0)
  const { store } = this.props
  if (!store.get('chi')) return
  const chiDecimal = new WadDecimal(store.get('chi'))
  return toFixed(daiDecimal.div(chiDecimal),5)
}


export const toDai = function(chaiAmount) {
  const chaiDecimal = chaiAmount ? new WadDecimal(chaiAmount).div('1e18') : new WadDecimal(0)
  const { store } = this.props
  if (!store.get('chi')) return
  const chiDecimal = new WadDecimal(store.get('chi'))
  return chiDecimal.mul(chaiDecimal)
}


export const setupContracts = async function () {
    const { store } = this.props
    const web3 = store.get('web3')
    store.set('potObject', new web3.eth.Contract(potABI, potAddress))

    const contractObjects = [
      new web3.eth.Contract(erc20ABI, daiAddress),
      new web3.eth.Contract(chaiABI, chaiAddress),
      new web3.eth.Contract(ctokenABI, cdaiAddress),
      new web3.eth.Contract(erc20ABI, usdcAddress),
      new web3.eth.Contract(ctokenABI, cusdcAddress),
      new web3.eth.Contract(erc20ABI, usdtAddress)
    ]

    contractObjects[0].name = 'Dai'
    contractObjects[1].name = 'Chai'
    contractObjects[2].name = 'cDai'
    contractObjects[3].name = 'Usdc'
    contractObjects[4].name = 'cUsdc'
    contractObjects[5].name = 'Usdt'

    contractObjects[0].decimals = await contractObjects[0].methods.decimals().call()
    contractObjects[1].decimals = await contractObjects[1].methods.decimals().call()
    contractObjects[2].decimals = await contractObjects[2].methods.decimals().call()
    contractObjects[3].decimals = await contractObjects[3].methods.decimals().call()
    contractObjects[4].decimals = await contractObjects[4].methods.decimals().call()
    contractObjects[5].decimals = await contractObjects[5].methods.decimals().call()

    contractObjects[0].getDecimal = function (amount) { return new WadDecimal(amount) }
    contractObjects[1].getDecimal = function (amount) { return new WadDecimal(amount) }
    contractObjects[2].getDecimal = function (amount) { return new EightDecimal(amount) }
    contractObjects[3].getDecimal = function (amount) { return new SixDecimal(amount) }
    contractObjects[4].getDecimal = function (amount) { return new EightDecimal(amount) }
    contractObjects[5].getDecimal = function (amount) { return new SixDecimal(amount) }

    store.set('contractObjects', contractObjects)

    store.set('daiObject', contractObjects[0])
    store.set('chaiObject', contractObjects[1])
    store.set('cdaiObject', contractObjects[2])
    store.set('usdcObject', contractObjects[3])
    store.set('cusdcObject', contractObjects[4])
    store.set('usdtObject', contractObjects[5])

    const loihi = new web3.eth.Contract(loihiABI, loihiAddress)
    loihi.getDecimal = function (amount) { return new WadDecimal(amount) }
    store.set('loihiObject', loihi)

}

// function getContractObject (name, abi, address, decimals) {
//   const contract = new web3.eth.Contract(abi, address)
//   contract.name = name
// }

export const getData = async function() {
    getPotDsr.bind(this)()
    getPotChi.bind(this)()
    getDaiAllowance.bind(this)()
    getDaiReserve.bind(this)()
    getLoihiBalance.bind(this)()
    getLoihiUnderlyingBalances.bind(this)()
    getUsdcReserve.bind(this)()
    getUsdtReserve.bind(this)()
    getChaiBalance.bind(this)()
    getChaiTotalSupply.bind(this)()
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
    toChai,
    toDai
}
