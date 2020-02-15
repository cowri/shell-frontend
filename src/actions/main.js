import { } from '../utils/web3Utils'
import config from '../config.json'

const loihiAddress = config.LOIHI

export const exit = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const chai = store.get('chaiObject')
    const exitAmount = store.get('exitAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    return chai.methods.exit(walletAddress, exitAmount.toFixed()).send({from: walletAddress})
}

export const join = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const chai = store.get('chaiObject')
    const dai = store.get('daiObject')
    const joinAmount = store.get('joinAmount').mul(10**18)
    const walletAddress = store.get('walletAddress')
    const allowance = store.get('daiAllowance')
    if (joinAmount.cmp(allowance)>0) {
      return dai.methods.approve(chai.options.address, "-1")
        .send({from: walletAddress})
        .then(function () {
          return chai.methods.join(walletAddress, joinAmount.toFixed()).send({from: walletAddress})
        });
    }
    return chai.methods.join(walletAddress, joinAmount.toFixed()).send({from: walletAddress})
}

export const transfer = async function() {
    const { store } = this.props
    const web3 = store.get('web3')
    const chai = store.get('chaiObject')
    const transferAmount = store.get('transferAmount').mul(10**18)
    const transferAddress = store.get('transferAddress')
    const walletAddress = store.get('walletAddress')
    return chai.methods.transfer(transferAddress, transferAmount.toFixed()).send({from: walletAddress})
}

export const selectiveDeposit = async function () {
    const { store } = this.props
    const web3 = store.get('web3')
    const loihi = store.get('loihiObject')
    const walletAddress = store.get('walletAddress')

    const contracts = []
    const addresses = []
    const amounts = []

    if (store.get('daiDepositAmount') > 0){
        const daiObject = store.get('daiObject');
        contracts.push(daiObject)
        addresses.push(daiObject._address)
        amounts.push(store.get('daiDepositAmount').mul(10**18).toFixed())
    } 

    if (store.get('usdcDepositAmount') > 0) {
        const usdcObject = store.get('usdcObject')
        contracts.push(usdcObject)
        addresses.push(usdcObject._address)
        amounts.push(store.get('usdcDepositAmount').mul(10**6).toFixed())
    }

    if (store.get('usdtDepositAmount') > 0) {
        const usdtObject = store.get('usdtObject')
        contracts.push(usdtObject)
        addresses.push(usdtObject._address)
        amounts.push(store.get('usdtDepositAmount').mul(10**6).toFixed())
    }

    return Promise.all(contracts.map( (contract, ix) => {
        return contract.methods.approve(loihiAddress, amounts[ix]).send({from: walletAddress})
    })).then(results => {
        return loihi.methods.selectiveDeposit(addresses, amounts, 3, Date.now() + 2000).send({from: walletAddress})
    }).then(function () {

    })



}

export const setViewState = async function (index) {
    this.props.store.set('viewState', index)
}

export const proportionalWithdraw = async function () {
    const { store } = this.props 
    const web3 = store.get('web3')
    const loihi = store.get('loihiObject')
    const amount = store.get('depositAmount')
    const walletAddress = store.get('walletAddress')
    // return loihi.methods.proportionalDeposit
}

export default {
    join,
    exit,
    transfer,
}
