import { fromJS, List, Map  } from "immutable"
import config from "../kovan.two.wbtc.renbtc.sbtc.config"
import Asset from "./Asset"
import Shell from "./Shell"
import SwapEngine from "./SwapEngine"
import BigNumber from "bignumber.js"

import shellIcon from "../assets/logo.png"

export default class Engine extends SwapEngine {

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

        
        this.shell.alpha = new BigNumber(config.params.alpha)
        this.shell.beta = new BigNumber(config.params.beta)
        this.shell.delta = new BigNumber(config.params.delta)
        this.shell.epsilon = new BigNumber(config.params.epsilon)
        this.shell.lambda = new BigNumber(config.params.lambda)

        this.shell.weights = []
        
        this.assets = []
        this.derivatives = []
        this.assetIx = {}
        this.derivativeIx = {}

        for (const ix in config.assets) {
            
            const _asset_ = config.assets[ix]
            
            this.shell.weights.push(new BigNumber(_asset_.weight))

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
    
    getFees (addrs, amts) {
        
        let prevLiq = this.state.getIn(['shell', 'liquidityTotal']).toObject()
        let prevLiqs = this.state.getIn(['shell', 'liquiditiesTotal']).toJS()
        
        let nextLiq = prevLiq
        let nextLiqs = prevLiqs
        
        for (let i = 0; i < addrs.length; i++) {

            let di = this.assetIx[addrs[i]]

            nextLiqs[di] = this.shell.getAllFormatsFromNumeraire(
                nextLiqs[di].numeraire.plus(amts[i].numeraire))
            
            nextLiq = this.shell.getAllFormatsFromNumeraire(
                nextLiq.numeraire.plus(amts[i].numeraire))
            
        }
        
        const [ _nothing, nothing_, prevFees ] = this.shell.calculateUtilities(prevLiq, prevLiqs)
        const [ _empty, empty_, nextFees ] = this.shell.calculateUtilities(nextLiq, nextLiqs)
        
        const fees = []
        
        for (let i = 0; i < prevFees.length; i++) {
            const fee = prevFees[i].numeraire.isGreaterThan(nextFees[i].numeraire)
                ? prevFees[i].numeraire.minus(nextFees[i].numeraire).negated()
                : nextFees[i].numeraire.minus(prevFees[i].numeraire)
            fees.push(this.shell.getAllFormatsFromNumeraire(fee))
        }
        
        return fees

    }
    
    async sync (account) {
        
        const self = this
        
        account = account ? account : this.account
        
        this.account = account

        let derivatives = []
        
        const shell = await this.shell.query(account)
        
        const assets = await Promise.all(this.assets.map(async function (_asset_, ix) {
            
            const asset = await queryAsset(_asset_)
            
            asset.utilityTotal = shell.utilitiesTotal[ix]
            
            asset.utilityOwned = shell.utilitiesOwned[ix]

            asset.liquidityOwned = shell.liquidityOwned[ix]
            
            asset.derivatives = await Promise.all(_asset_.derivatives.map(queryAsset)) 
            
            derivatives.push(asset)

            derivatives = derivatives.concat(asset.derivatives)
            
            return asset;

        })) 
        
        async function queryAsset (asset) {

            const allowance = await asset.allowance(account, self.shell.address)

            const balance = await asset.balanceOf(account)
            
            return {
                allowance: allowance,
                balance: balance,
                icon: asset.icon,
                symbol: asset.symbol,
                decimals: asset.decimals
            }

        }
        
        this.state = fromJS({
            account,
            assets,
            derivatives,
            shell
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

        const limit = this.state.getIn([ 'shell', 'shellsOwned', 'raw' ])

        const tx = this.shell.selectiveWithdraw(
            addresses, 
            amounts.map(a => a.raw.toFixed() ),
            limit.toFixed(),
            Date.now() + 2000
        )

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