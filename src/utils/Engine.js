import React from 'react'
import { fromJS, List, Map  } from "immutable"
import config from "../mainnet.multiple.config"
import Asset from "./Asset"
import Shell from "./Shell"
import SwapEngine from "./SwapEngine"
import BigNumber from "bignumber.js"
import { CircularProgress } from '@material-ui/core'

import shellIcon from "../assets/logo.png"

export default class Engine extends SwapEngine {

    constructor (web3, setState, state) {

        super()

        const self = this

        this.state = state

        this.web3 = web3

        this.setState = setState

        this.shells = []
        this.assets = []
        this.derivatives = []
        this.overlaps = []
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

            for (let ix = 0; ix < _shell_.assets.length; ix++) {

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
                asset.swapDecimals = _shell_.swapDecimals
                asset.weight = new BigNumber(_asset_.weight)

                shell.assetIx[_asset_.address] = ix
                shell.derivativeIx[_asset_.address] = shell.derivatives.length

                asset.derivatives = []

                for (let dix = 0; dix < _asset_.derivatives.length; dix++) {

                    const _derivative_ = _asset_.derivatives[dix]

                    const derivative = new Asset(
                        this.web3,
                        _asset_.derivatives[dix].address,
                        _asset_.derivatives[dix].name,
                        _asset_.derivatives[dix].symbol,
                        _asset_.derivatives[dix].icon,
                        _asset_.derivatives[dix].decimals
                    )

                    derivative.displayDecimals = _shell_.displayDecimals
                    derivative.swapDecimals = _shell_.swapDecimals


                    asset.derivatives.push(derivative)

                    shell.derivativeIx[asset.derivatives[dix].address] = shell.derivatives.length

                }

                shell.weights.push(asset.weight)
                shell.assets.push(asset)
                shell.derivatives.push(asset)
                shell.derivatives = shell.derivatives.concat(asset.derivatives)
                this.assets.push(asset)
                this.derivatives.push(asset)
                this.derivatives = this.derivatives.concat(asset.derivatives)


            }

            this.overlaps[this.shells.length] = []

            for (let ix = 0; ix < _shell_.assets.length; ix++) {
                this.overlaps[this.shells.length].push(_shell_.assets[ix].symbol)
                for (let xi = ix + 1; xi < _shell_.assets.length; xi++) {
                    setPair(
                        this.shells.length,
                        _shell_.assets[ix].address,
                        _shell_.assets[xi].address
                    )
                    for (let dix = 0; dix < _shell_.assets[ix].derivatives.length; dix++) {
                        this.overlaps[this.shells.length].push(_shell_.assets[ix].derivatives[dix].symbol)
                        for (let xid = 0; xid < _shell_.assets[xi].derivatives.length; xid++) {
                            setPair(
                                this.shells.length,
                                _shell_.assets[ix].address,
                                _shell_.assets[xi].derivatives[xid].address
                            )
                            setPair(
                                this.shells.length,
                                _shell_.assets[ix].derivatives[dix].address,
                                _shell_.assets[xi].derivatives[xid].address
                            )
                        }
                    }
                }
            }

            shell.apy = <CircularProgress />

            this.getAPY(shell.assets).then(result => {
                shell.apy = result
            })

            this.shells.push(shell)

        }

        function filter (x) { if (!this.has(x.symbol)) { this.add(x.symbol); return true } else return false }
        this.assets = this.assets.filter(filter, new Set())
        this.derivatives = this.derivatives.filter(filter, new Set())

        function setPair (s, _x, y_) {
            const x = self.pairs[_x] ? self.pairs[_x] : {}
            const y = self.pairs[y_] ? self.pairs[y_] : {}
            if (!x[y_]) x[y_] = []
            if (!y[_x]) y[_x] = []
            x[y_].push(s)
            y[_x].push(s)
            self.pairs[_x] = x
            self.pairs[y_] = y
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
        let assets = []
        let assetsPlusDerivatives = []

        for (const _shell_ of this.shells) {

            const shell = await this.readShell(_shell_)

            assets = assets.concat(shell.assets)
            assetsPlusDerivatives = assetsPlusDerivatives.concat(shell.assets.flatMap( asset => [ asset ].concat(asset.derivatives) ) )

            shells.push(shell)

        }

        function filter (asset) {
            if (!this.has(asset.icon)) {
                this.add(asset.icon)
                return true
            } else return false
        }

        assets = assets.filter(filter, new Set())
        assetsPlusDerivatives = assetsPlusDerivatives.filter(filter, new Set())

        this.state = fromJS({
            account,
            shells,
            assets,
            assetsPlusDerivatives
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

    async getAPY (assets) {
        let assetString = ''
        assets.forEach((asset, i) => {
            assetString += (asset.symbol + ' ')
        });


        let url = 'https://dashboard.shells.exchange/getAPY'
        let apyData = null
        if(assetString.includes('BTC')){
            url += 'btc'
        }

        let percentage = 0
        await fetch(url).then(response => response.text()).then(contents => {
            let data = JSON.parse(contents).data
            percentage = data[data.length - 1].percentage
        })
        return percentage
    }

}
