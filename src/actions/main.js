import config from '../mainnet.config.json'

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
        console.log("amount", amounts[amounts.length - 1])
    }

    if (store.get('susdDepositAmount') > 0) {
        const susdObject = store.get('susdObject')
        contracts.push(susdObject)
        addresses.push(susdObject.options.address)
        amounts.push(store.get('susdDepositAmount').mul(10**18).toFixed())
    }

    console.log("amounts", amounts)
    console.log("loihiAddress", loihiAddress)
    const gasPrice = await web3.eth.getGasPrice()
    console.log("gas price", gasPrice)


    // contracts[0].methods.approve(loihiAddress, amounts[0]).estimateGas({from: walletAddress, gasPrice: gasPrice })
    //     .then(function () {

    //     }).catch(function (err) {
    //         console.log("err", arguments)
    //     })
    // console.log("Estimate", estimate)


    // const amount = await contracts[0].methods.approve(loihiAddress, 0).estimateGas({from: walletAddress })

    // console.log("amounts", amounts)

    return Promise.all(contracts.map(contract => {
        return contract.methods.allowance(walletAddress, loihiAddress).call()
    })).then(function (approvals) {

        console.log("current approvals", approvals)

        return Promise.all(approvals.map((approval, ix) => {
            console.log("approval", typeof approval)
            console.log(" <= ", approval <= amounts[ix])
            console.log("amounts[ix]", typeof amounts[ix])
            // console.log(" >= ", approval >= amounts[ix])

            if (Number(approval) <= Number(amounts[ix])) {
                console.log("yes")

                if (contracts[ix].name !== 'Usdt' || (contracts[ix].name == 'Usdt' && amounts[ix] == 0)) {

                    return contracts[ix].methods.approve(loihiAddress, "-1").send({ from: walletAddress })

                } else return Promise.all([
                    contracts[ix].methods.approve(loihiAddress, 0).send({ from: walletAddress }),
                    contracts[ix].methods.approve(loihiAddress, "-1").send({ from: walletAddress })
                ])

            } else {
                console.log("no")
                return Promise.resolve()
            }

        }))
        
    }).then(async function () {

        const tx = loihi.methods.selectiveDeposit(addresses, amounts, 1, Date.now() + 2000)
        const estimate = await tx.estimateGas({from: walletAddress})
        console.log("estimate", estimate)
        console.log("gasPrice", gasPrice)
        return tx.send({ from: walletAddress, gas: Math.round(estimate * 1.1), gasPrice: gasPrice})

    }).then(function () { 

        console.log("estimated", arguments)
    
    }).catch(function () {

        console.log("Err", arguments)

    })
    // .then(function () {
    //     return loihi.methods.selectiveDeposit(addresses, amounts, 1, Date.now() + 2000).send({from: walletAddress})
    // }).then(function () {

    // })

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

    console.log("prime origin trade", value)

    store.set('originAmount', value)

    const walletAddress = store.get('walletAddress')
    const loihi = store.get('loihiObject')
    const originSlot = store.get('originSlot')
    const targetSlot = store.get('targetSlot')
    const contracts = store.get('contractObjects')
    const origin = contracts[originSlot]
    const target = contracts[targetSlot]
    if (!walletAddress || !loihi) return

    const rawOrigin = origin.getRaw(value)
    console.log("raworig", rawOrigin)

    const rawTarget = await loihi.methods.viewOriginTrade(origin.options.address, target.options.address, rawOrigin).call()
    console.log("raw target", rawTarget);

    // const contracts = store.get('contractObjects')
    // const origin = contracts[originSlot]
    // const target = contracts[targetSlot]

    // store.set('rawOriginAmount', value)

    // loihi.methods.viewOriginTrade(origin.options.address, target.options.address, value).call()
    //     .then(function () {
    //         console.log("viewed", arguments)
    //     })

}

export const swap = async function () {

    const { store } = this.props
    const walletAddress = store.get('walletAddress')
    const rawOriginAmount = store.get('rawOriginAmount')
    const loihi = store.get('loihiObject')
    const originSlot = store.get('originSlot')
    const targetSlot = store.get('targetSlot')
    const contracts = store.get('contractObjects')
    const origin = contracts[originSlot]
    const target = contracts[targetSlot]

    origin.methods.approve(loihi.options.address, rawOriginAmount).send({ from: walletAddress })
        .then(function () {
            return loihi.methods.swapByOrigin( origin.options.address, target.options.address, rawOriginAmount, 0, Date.now() + 500 ).send({ from : walletAddress })
        }).then(function () {
            console.log("traded", arguments)
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
