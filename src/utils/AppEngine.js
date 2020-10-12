import { fromJS, List, Map  } from "immutable"
import config from "../kovan.ctokens.config"
import Asset from "./Asset"
import Shell from "./Shell"
import SwapEngine from "./SwapEngine"
import BigNumber from "bignumber.js"

import shellIcon from "../assets/logo.png"

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

        this.assets = []
        this.derivatives = []
        this.assetIx = {}
        this.derivativeIx = {}

        for (const ix in config.assets) {
            
            const _asset_ = config.assets[ix]

            const asset = new Asset(
                this.web3,
                _asset_.address,
                _asset_.name,
                _asset_.symbol,
                _asset_.icon,
                _asset_.decimals
            )
                
            this.assetIx[_asset_.address] = ix
            this.derivativeIx[_asset_.address] = this.derivatives.length
            
            asset.derivatives = []
            
            for (const _derivative_ of _asset_.derivatives) {

                const derivative = new Asset(
                    this.web3,
                    _derivative_.address,
                    _derivative_.name,
                    _derivative_.symbol,
                    _derivative_.icon,
                    _derivative_.decimals
                )
                
                this.derivativeIx[_derivative_.address] = this.derivatives.length
                
                asset.derivatives.push(derivative)
                
            }
            
            this.assets.push(asset)
            this.derivatives.push(asset)
            this.derivatives = this.derivatives.concat(asset.derivatives)

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
        
        const self = this
        
        let derivatives = []
        
        const assets = await Promise.all(this.assets.map(async function (asset, ix) {
            
            const _asset = await queryAsset(asset)

            const liqInShell = shellLiq[1][ix].raw.dividedBy(10 ** (18 - asset.decimals))

            const rawBalInShell = ownedLiqRatio
                .multipliedBy(shellLiq[1][ix].raw)
                .div(new BigNumber(10 ** (18 - asset.decimals)))

            _asset.balanceInShell = asset.getAllFormatsFromRaw(rawBalInShell)
            _asset.liquidityInShell = asset.getAllFormatsFromRaw(liqInShell)
            
            _asset.derivatives = await Promise.all(asset.derivatives.map(queryAsset)) 
            
            derivatives.push(_asset)
            derivatives = derivatives.concat(_asset.derivatives)
            
            return _asset;

        }))
        
        async function queryAsset (asset) {

            const allowance = await asset.allowance(account, shellAddr)

            const balance = await asset.balanceOf(account)
            
            console.log("asset", asset.name, "allowance", allowance)

            return {
                allowance: allowance,
                balance: balance,
                icon: asset.icon,
                symbol: asset.symbol,
                decimals: asset.decimals
            }

        }
        
        this.state = fromJS({
            account: account,
            assets: assets,
            derivatives: derivatives,
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