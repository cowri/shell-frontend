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
        addresses.push(daiObject.options.address)
        amounts.push(store.get('daiDepositAmount').mul(10**18).toFixed())
    } 

    if (store.get('usdcDepositAmount') > 0) {
        const usdcObject = store.get('usdcObject')
        contracts.push(usdcObject)
        addresses.push(usdcObject.options.address)
        amounts.push(store.get('usdcDepositAmount').mul(10**6).toFixed())
    }

    if (store.get('usdtDepositAmount') > 0) {
        const usdtObject = store.get('usdtObject')
        contracts.push(usdtObject)
        addresses.push(usdtObject.options.address)
        amounts.push(store.get('usdtDepositAmount').mul(10**6).toFixed())
    }

    if (store.get('susdDepositAmount') > 0) {
        const susdObject = store.get('susdObject')
        contracts.push(susdObject)
        addresses.push(susdObject.options.address)
        amounts.push(store.get('susdDepositAmount').mul(10**6).toFixed())
    }

    return Promise.all(contracts.map( (contract, ix) => {
        return contract.methods.approve(loihiAddress, amounts[ix]).send({from: walletAddress})
    })).then(results => {
        return loihi.methods.selectiveDeposit(addresses, amounts, 1, Date.now() + 2000).send({from: walletAddress})
    }).then(function () {

    })

}

export const proportionalWithdraw = async function () {
    const { store } = this.props

    const web3 = store.get('web3')
    const walletAddress = store.get('walletAddress')
    const loihiBalanceRaw = store.get('loihiBalanceDecimal').mul(10**18).toFixed()
    const loihi = store.get('loihiObject')

    const tx = loihi.methods.proportionalWithdraw(loihiBalanceRaw)

    return tx.estimateGas({from: walletAddress}).then(function () {
        return tx.send({from: walletAddress, gas: Math.floor(arguments[0] * 1.2) })
    }).then(function () {
        console.log("done withdraw", arguments)
    })

}

export const primeOriginTrade = async function (value) {
    const { store } = this.props
    const originAmount = store.get('originAmount')
    const loihi = store.get('loihiObject')
    const originSlot = store.get('originSlot')
    const targetSlot = store.get('targetSlot')
    const contracts = store.get('contractObjects')
    const origin = contracts[originSlot]
    const target = contracts[targetSlot]

    console.log("calling", value)
    loihi.methods.viewOriginTrade(origin.options.address, target.options.address, value).call()
        .then(function () { 
            console.log("arguments", arguments)
        })

}

export const swap = async function () {
    const { store } = this.props

    const walletAddress = store.get('walletAddress')
    const originAmount = store.get('originAmount')
    const targetAmount = store.get('targetAmount')
    console.log("originAmount", originAmount)
    console.log("targetAmount", targetAmount)
    const originSlot = store.get('originSlot')
    const targetSlot = store.get('targetSlot')
    console.log(originSlot)
    console.log(targetSlot)

    const contracts = store.get('contractObjects')

    const decimalOrigin = contracts[originSlot].getDecimal(originAmount)
        .mul(10**contracts[originSlot].decimals)
        .toFixed()

    console.log("decimalOrigin", decimalOrigin)

    const loihi = store.get('loihiObject')

    return contracts[originSlot].methods.approve(loihi.options.address, decimalOrigin).send({from:walletAddress}) 
        .then(function () {
            return loihi.methods.swapByOrigin(
                contracts[originSlot].options.address,
                contracts[targetSlot].options.address,
                decimalOrigin,
                50000,
                Date.now() + 50000
            ) .send({from: walletAddress})
        }).then(function () {
            console.log("done", arguments)
        })

}

export const setViewState = async function (index) {
    this.props.store.set('viewState', index)
}

export default {
    join,
    exit,
    transfer,
}
