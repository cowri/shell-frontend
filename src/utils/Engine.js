import { fromJS, List, Map  } from "immutable"
import config from "../kovan.multiple.config"
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

        this.shells = []
        this.assets = []
        this.derivatives = []
        this.pairs = {}

        for (const _shell_ of config.shells) {

            const shell = new Shell(
                this.web3,
                _shell_.shell,
                "Shell Protocol",
                "SHL",
                shellIcon,
                18
            )

            shell.displayDecimals = _shell_.displayDecimals
            shell.swapDecimals = _shell_.swapDecimals
            shell.alpha = new BigNumber(_shell_.alpha)
            shell.beta = new BigNumber(_shell_.beta)
            shell.delta = new BigNumber(_shell_.delta)
            shell.epsilon = new BigNumber(_shell_.epsilon)
            shell.lambda = new BigNumber(_shell_.lambda)

            shell.weights = []
            shell.assets = []
            shell.derivatives = []
            shell.assetIx = {}
            shell.derivativeIx = {}

            for (const ix in _shell_.assets) {
                
                for (let xi = ix + 1; xi < _shell_.assets.length; xi++) {
                    const _ix = _shell_.assets[ix]
                    const xi_ = _shell_.assets[xi]
                    const ixxi = this.pairs[_ix] ? this.pairs[_ix] : {}
                    const xiix = this.pairs[xi_] ? this.pairs[xi_] : {}
                    if (!ixxi[xi_]) ixxi[xi_] = []
                    if (!xiix[_ix]) xiix[_ix] = []
                    xiix[_ix].push(_shell_.shell)
                    ixxi[xi_].push(_shell_.shell)
                }
                
                const _asset_ = _shell_.assets[ix]

                const asset = new Asset(
                    this.web3,
                    _asset_.address,
                    _asset_.name,
                    _asset_.symbol,
                    _asset_.icon,
                    _asset_.decimals
                )

                asset.displayDecimals = _shell_.displayDecimals
                asset.weight = new BigNumber(_asset_.weight)
                    
                shell.assetIx[_asset_.address] = ix
                shell.derivativeIx[_asset_.address] = shell.derivatives.length
                
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

                    derivative.displayDecimals = config.displayDecimals
                    
                    asset.derivatives.push(derivative)

                    shell.derivativeIx[_derivative_.address] = shell.derivatives.length
                    
                }

                shell.weights.push(asset.weight) 
                shell.assets.push(asset)
                shell.derivatives.push(asset)
                shell.derivatives = shell.derivatives.concat(asset.derivatives)

            }

            this.shells.push(shell)

        }

    }

    set network (network) {

        this.setState(this.state.set('network', network))

    }

    getFees (shellIx, addrs, amts) {
        
        let prevLiq = this.state.getIn(['shells', shellIx, 'shell', 'liquidityTotal']).toObject()
        let prevLiqs = this.state.getIn(['shells', shellIx, 'shell', 'liquiditiesTotal']).toJS()
        
        let nextLiq = prevLiq
        let nextLiqs = prevLiqs
        
        for (let i = 0; i < addrs.length; i++) {

            let di = this.shells[shellIx].assetIx[addrs[i]]

            nextLiqs[di] = this.shells[shellIx].getAllFormatsFromNumeraire(
                nextLiqs[di].numeraire.plus(amts[i].numeraire))
            
            nextLiq = this.shells[shellIx].getAllFormatsFromNumeraire(
                nextLiq.numeraire.plus(amts[i].numeraire))
            
        }
        
        const [ _nothing, nothing_, prevFees ] = this.shells[shellIx].calculateUtilities(prevLiq, prevLiqs)
        const [ _empty, empty_, nextFees ] = this.shells[shellIx].calculateUtilities(nextLiq, nextLiqs)
        
        const fees = []
        
        for (let i = 0; i < prevFees.length; i++) {
            const fee = prevFees[i].numeraire.isGreaterThan(nextFees[i].numeraire)
                ? prevFees[i].numeraire.minus(nextFees[i].numeraire).negated()
                : nextFees[i].numeraire.minus(prevFees[i].numeraire)
            fees.push(this.shells[shellIx].getAllFormatsFromNumeraire(fee))
        }
        
        return fees

    }

    async syncShells (account) {

        const self = this

        account = account ? account : this.account

        this.account = account

        let shells = []

    }

    async readShell (_shell_) {

        const self = this

        let derivatives = []
        
        const shell = await _shell_.query(this.account)
        
        const assets = await Promise.all(_shell_.assets.map(async function (_asset_, ix) {
            
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

            const allowance = await asset.allowance(self.account, _shell_.address)

            const balance = await asset.balanceOf(self.account)
            
            return {
                allowance: allowance,
                balance: balance,
                icon: asset.icon,
                symbol: asset.symbol,
                decimals: asset.decimals
            }

        }
        
        return {
            assets,
            derivatives,
            shell
        }

    }

    async sync (account) {
        
        account = account ? account : this.account
        
        this.account = account

        const shells = []

        for (const _shell_ of this.shells) {

            shells.push(await this.readShell(_shell_))

        }

        this.state = fromJS({
            account,
            shells
        })

        this.setState(this.state)

    }

    async syncShell (ix) {

        this.state = this.state.setIn(
            ['shells', ix],
            await this.readShell(this.shells[ix])
        )

        this.setState(this.state)

    }

    unlock (shellIx, assetIx, amount, onHash, onConfirmation, onError) {

        const tx = this.shells[shellIx].assets[assetIx]
            .approve(this.shells[shellIx].address, amount)

        tx.send({ from: this.account })
            .once('transactionHash', onHash)
            .once('confirmation', () => {
                onConfirmation()
                this.sync(this.account)
            })
            .on('error', onError)

    }

    selectiveDeposit (shellIx, addresses, amounts, onHash, onConfirmation, onError) {

        const tx = this.shells[shellIx]
            .selectiveDeposit(addresses, amounts, 0, Date.now() + 2000)

        tx.send({ from: this.account })
            .on('transactionHash', onHash)
            .on('confirmation', () => {
                onConfirmation()
                this.sync(this.account)
            })
            .on('error', onError)

    }

    selectiveWithdraw (shellIx, addresses, amounts, onHash, onConfirmation, onError) {

        const limit = this.state.getIn([ 'shells', shellIx, 'shell', 'shellsOwned', 'raw' ])

        const tx = this.shells[shellIx].selectiveWithdraw(
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