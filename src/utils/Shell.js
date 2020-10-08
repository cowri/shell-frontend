import BigNumber from 'bignumber.js';

import ShellABI from '../abi/Shell.abi.json';

import NumericFormats from "./NumberFormats.js";

export default class Shell extends NumericFormats {

    constructor (web3, address, name, symbol, icon, decimals) {

        super()

        this.contract = new web3.eth.Contract(ShellABI, address)
        this.address = address
        this.name = name
        this.symbol = symbol
        this.icon = icon
        this.decimals = decimals

    }
    
    async balanceOf (account) {

        const balance = await this.contract.methods.balanceOf(account).call() 

        return this.getAllFormatsFromRaw(balance)

    }

    async totalSupply () {

        const supply = await this.contract.methods.totalSupply().call() 

        return this.getAllFormatsFromRaw(supply)

    }

    async liquidity () {

        const liq = await this.contract.methods.liquidity().call()

        liq[0] = this.getAllFormatsFromRaw(liq[0])

        liq[1] = liq[1].map(_liq => this.getAllFormatsFromRaw(_liq))

        return liq

    }

    async viewSelectiveDeposit (addresses, amounts) {
        
        try {

            const shells = new BigNumber( await this.contract.methods.viewSelectiveDeposit(addresses, amounts).call() )

            return this.getNumeraireFromRaw(shells)

        } catch {

            return false

        }

    }

    selectiveDeposit (addresses, amounts, minimum, deadline) {

        return this.contract.methods.selectiveDeposit(addresses, amounts, minimum, deadline)

    }

    async viewSelectiveWithdraw (addresses, amounts) {

        try {

            const shellsToBurn = new BigNumber( await this.contract.methods.viewSelectiveWithdraw(addresses, amounts).call() )

            return this.getNumeraireFromRaw(shellsToBurn)

        } catch {
            
            return false

        }

    }

    selectiveWithdraw (addresses, amounts, max, deadline) {

        return this.contract.methods.selectiveWithdraw(addresses, amounts, max, deadline)

    }

    proportionalWithdraw (shells, deadline) {

        return this.contract.methods.proportionalWithdraw(shells, deadline)

    }

    async viewOriginSwap (origin, target, amount) {

        try {

            return new BigNumber( await this.contract.methods.viewOriginSwap(origin, target, amount).call() )

        } catch { 

            return false

        }

    }

    async viewTargetSwap (origin, target, amount) {

        try {

            return new BigNumber( await this.contract.methods.viewTargetSwap(origin, target, amount).call() )

        } catch {

            return false 

        }
        
    }

    originSwap (origin, target, originAmount, targetLimit, deadline) {

        return this.contract.methods.originSwap(origin, target, originAmount, targetLimit, deadline)

    }

    targetSwap (origin, target, originLimit, targetAmount, deadline) {

        return this.contract.methods.targetSwap(origin, target, originLimit, targetAmount, deadline)

    }

}