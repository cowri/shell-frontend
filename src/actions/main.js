import { } from '../utils/web3Utils';

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
    const amounts = store.get('selectAmounts')
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
