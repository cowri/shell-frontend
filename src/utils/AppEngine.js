import { fromJS, List, Map  } from "immutable"
import config from "../kovan.config.json"
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

        for (const ix in config.assets) {

            const _asset_ = config.assets[ix]

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

    async init (account) {

        console.log("account", account)

        this.account = account

        const shellAddr = this.shell.address

        const shell = this.shell

        const shells = await this.shell.balanceOf(this.account)

        const totalShells = await this.shell.totalSupply()

        const ownedLiqRatio = totalShells.raw.isZero() ? totalShells.raw : shells.raw.dividedBy(totalShells.raw) 

        const shellLiq = await this.shell.liquidity()

        const ownedLiq = ownedLiqRatio.multipliedBy(shellLiq[0].raw)
        
        const assets = await Promise.all(this.assets.map(async function (asset, ix) {

            const allowance = await asset.allowance(shellAddr, account)

            const balance = await asset.balanceOf(account)
            
            const rawBalInShell = ownedLiqRatio.multipliedBy(shellLiq[1][ix].raw)

            return {
                allowance: allowance,
                balance: balance,
                balanceInShell: shell.getAllFormatsFromRaw(rawBalInShell),
                liquidityInShell: shellLiq[1][ix]
            }

        }))

        console.log("assets", assets)

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

}