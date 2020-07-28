import BigNumber from 'bignumber.js';

import ERC20ABI from '../abi/ERC20.abi.json';
import LoihiABI from '../abi/Loihi.abi.json';

import NumericFormats from "./numericFormats.js";

export class ERC20 extends NumericFormats {

    constructor (web3, address, name, symbol, icon, decimals) {

        super()

        this.contract = new web3.eth.Contract(ERC20ABI, address)
        this.address = address
        this.name = name
        this.symbol = symbol
        this.icon = icon
        this.decimals = decimals

    }

    async approve (address, amount) {

        return this.contract.methods.approve(address, amount);

    }

    async allowance (owner, spender) {

        const allowance = new BigNumber( await this.contract.methods.allowance(owner, spender).call() )

        return this.getNumeraireFromRaw(allowance)

    }

    async balanceOf (account) {

        const balance = new BigNumber( await this.contract.methods.balanceOf(account).call() )

        return this.getNumeraireFromRaw(balance)

    }

}

export class Loihi extends NumericFormats {

    constructor (web3, address, name, symbol, icon, decimals) {

        super()

        this.contract = new web3.eth.Contract(LoihiABI, address)
        console.log("loihi contract", this.contract.methods.viewSelectiveDeposit)
        this.address = address
        this.name = name
        this.symbol = symbol
        this.icon = icon
        this.decimals = decimals

    }
    
    async balanceOf (account) {

        const balance = new BigNumber( await this.contract.methods.balanceOf(account).call() )

        return this.getNumeraireFromRaw(balance)
        
    }

    async totalSupply () {

        const totalSupply = new BigNumber( await this.contract.methods.totalSupply().call() )

        return this.getNumeraireFromRaw(totalSupply)

    }

    async liquidity () {

        const liquidity = await this.contract.methods.liquidity().call()

        return {
            total: new BigNumber(liquidity[0]).dividedBy(1e18),
            dai: new BigNumber(liquidity[1][0]).dividedBy(1e18),
            usdc: new BigNumber(liquidity[1][1]).dividedBy(1e18),
            usdt: new BigNumber(liquidity[1][2]).dividedBy(1e18),
            susd: new BigNumber(liquidity[1][3]).dividedBy(1e18)
        }

    }

    async viewSelectiveDeposit (addresses, amounts) {

        const shells = new BigNumber( await this.contract.methods.viewSelectiveDeposit(addresses, amounts).call() )

        return this.getNumeraireFromRaw(shells)

    }

    selectiveDeposit (addresses, amounts, minimum, deadline) {

        return this.contract.methods.selectiveDeposit(addresses, amounts, minimum, deadline)

    }

    async viewSelectiveWithdraw (addresses, amounts) {

        const shellsToBurn = new BigNumber( await this.contract.methods.viewSelectiveWithdraw(addresses, amounts).call() )

        return this.getNumeraireFromRaw(shellsToBurn)

    }

    selectiveWithdraw (addresses, amounts, max, deadline) {

        return this.contract.methods.selectiveWithdraw(addresses, amounts, max, deadline)

    }

    proportionalWithdraw (shells, deadline) {

        return this.contract.methods.proportionalWithdraw(shells, deadline)

    }

    async viewOriginSwap (origin, target, amount) {

        return new BigNumber( await this.contract.methods.viewOriginSwap(origin, target, amount).call() )

    }

    async viewTargetSwap (origin, target, amount) {

       return new BigNumber( await this.contract.methods.viewTargetSwap(origin, target, amount).call() )
        
    }

    originSwap (origin, target, originAmount, targetLimit, deadline) {

        return this.contract.methods.originSwap(origin, target, originAmount, targetLimit, deadline)

    }

    targetSwap (origin, target, originLimit, targetAmount, deadline) {

        return this.contract.methods.targetSwap(origin, target, originLimit, targetAmount, deadline)

    }

}