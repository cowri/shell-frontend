import { fromJS, List, Map  } from "immutable"
import config from "../kovan.ctokens.config.json"
import Asset from "./Asset"
import Shell from "./Shell"
import SwapEngine from "./SwapEngine"

import shellIcon from "../assets/logo.png"

const assetIcons = config.assets.map(asset => {
    return require('../assets/' + asset.icon)
})

export default class AppEngine extends SwapEngine {

    constructor (web3, setState, state) {

        super()

        this.state = state

        this.web3 = web3

        this.setState = setState

        this.shell = new Shell(
            this.web3,
            config.shell,
            "Shell Protocol",
            "SHL",
            shellIcon,
            18
        )

        this.assets = [ ]
        this.derivativeIx = { }

        for (const ix in config.assets) {

            const _asset_ = config.assets[ix]

            this.derivativeIx[_asset_.address] = ix

            const asset = new Asset(
                this.web3,
                _asset_.address,
                _asset_.name,
                _asset_.symbol,
                assetIcons[ix],
                _asset_.decimals
            )

            this.assets.push(asset)

        }

    }

    set network (network) {

        this.setState(this.state.set('network', network))

    }

    async sync (account) {

        account = account ? account : this.account
        
        this.account = account

        const shellAddr = this.shell.address

        const shell = this.shell

        const shells = await this.shell.balanceOf(this.account)

        const totalShells = await this.shell.totalSupply()

        const ownedLiqRatio = totalShells.raw.isZero() ? totalShells.raw : shells.raw.dividedBy(totalShells.raw) 

        const shellLiq = await this.shell.liquidity()

        const ownedLiq = ownedLiqRatio.multipliedBy(shellLiq[0].raw)
        
        const assets = await Promise.all(this.assets.map(async function (asset, ix) {

            const allowance = await asset.allowance(account, shellAddr)

            const balance = await asset.balanceOf(account)

            const liqInShell = shellLiq[1][ix].raw.dividedBy(10 ** (18 - asset.decimals))

            const rawBalInShell = ownedLiqRatio.multipliedBy(shellLiq[1][ix].raw).div(10 ** (18 - asset.decimals))

            return {
                allowance: allowance,
                balance: balance,
                balanceInShell: asset.getAllFormatsFromRaw(rawBalInShell),
                liquidityInShell: asset.getAllFormatsFromRaw(liqInShell)
            }

        }))

        this.state = fromJS({
            account: account,
            assets: assets,
            shell: {
                shells: shells,
                totalShells: totalShells,
                totalLiq: shellLiq[0],
                ownedLiq: shell.getAllFormatsFromRaw(ownedLiq)
            },
        })


        this.setState(this.state)

    }



    unlock (index, amount, onHash, onConfirmation, onError) {

        const tx = this.assets[index].approve(this.shell.address, amount)

        tx.send({ from: this.account })
            .once('transactionHash', onHash)
            .once('confirmation', () => {
                onConfirmation()
                this.sync(this.account)
            })
            .on('error', onError)

    }

    selectiveDeposit (addresses, amounts, onHash, onConfirmation, onError) {

        const tx = this.shell.selectiveDeposit(addresses, amounts, 0, Date.now() + 2000)

        tx.send({ from: this.account })
            .on('transactionHash', onHash)
            .on('confirmation', () => {
                onConfirmation()
                this.sync(this.account)
            })
            .on('error', onError)

    }

    selectiveWithdraw (addresses, amounts, onHash, onConfirmation, onError) {

        const limit = this.state.getIn([ 'shell', 'shells', 'raw' ])

        const tx = this.shell.selectiveWithdraw(addresses, amounts, limit.toFixed(), Date.now() + 2000)

        tx.send({ from: this.account })
            .on('transactionHash', onHash)
            .on('confirmation', onConfirmation)
            .on('error', onError)

    }

    proportionalWithdraw (amount, onHash, onConfirmation, onError) {

        const tx = this.shell.proportionalWithdraw(amount.toFixed(), Date.now() + 2000)

        tx.send({ from: this.account })
            .on('transactionHash', onHash)
            .on('confirmation', onConfirmation)
            .on('error', onError)

    }

}