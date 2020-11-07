import BigNumber from 'bignumber.js';

import ShellABI from '../abi/Shell.abi.json';

import NumericFormats from "./NumberFormats.js";

const ONE = new BigNumber(1)

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
    
    async query (account) {
        
        const shellsOwned = await this.balanceOf(account)
        
        const shellsTotal = await this.totalSupply()
        
        const ownedRatio = shellsTotal.raw.isZero()
            ? shellsTotal.raw
            : shellsOwned.raw.dividedBy(shellsTotal.raw)
        
        const liq = await this.liquidity() 
        
        const liquidityTotal = liq[0]
        
        const liquidityOwned = this.getAllFormatsFromRaw(liq[0].raw.multipliedBy(ownedRatio))

        const liquiditiesTotal = liq[1]

        const liquiditiesOwned = liq[1].map(l => this.getAllFormatsFromRaw(l.raw.multipliedBy(ownedRatio)))
        
        const [ utilityTotal, utilitiesTotal, fees ] = this.calculateUtilities(liq[0], liq[1])
        
        const utilitiesOwned = utilitiesTotal.map(util => this.getAllFormatsFromRaw(util.raw.multipliedBy(ownedRatio)))
            
        const utilityOwned = this.getAllFormatsFromNumeraire(utilityTotal.numeraire.multipliedBy(ownedRatio))
        
        return {
            liquiditiesOwned,
            liquiditiesTotal,
            liquidityOwned,
            liquidityTotal,
            shellsOwned,
            shellsTotal,
            utilitiesOwned,
            utilitiesTotal,
            utilityOwned,
            utilityTotal
        }

    }
    
    calculateUtilities (liquidity, liquidities) {
        
        let utility = new BigNumber(0) 
        let utilities = []
        let fees = []

        for (let i = 0; i < liquidities.length; i++) {
            
            const balance = liquidities[i].numeraire
            const ideal = liquidity.numeraire.multipliedBy(this.weights[i])

            let margin = new BigNumber(0)

            if (balance.isGreaterThan(ideal)) {
                
                const threshold = ideal.multipliedBy(ONE.plus(this.beta))
                
                if (balance.isGreaterThan(threshold)) {

                    margin = balance.minus(threshold)
                    
                }

            } else {
                
                const threshold = ideal.multipliedBy(ONE.minus(this.beta))
                
                if (threshold.isGreaterThan(balance)) {

                    margin = threshold.minus(balance)
                    
                }
                
            }
            
            if (margin.isZero()) {
                
                utility = utility.plus(balance)
                
                utilities.push(this.getAllFormatsFromNumeraire(balance))
                
                fees.push(this.getAllFormatsFromNumeraire(new BigNumber(0)))

            } else {

                let fee = margin.dividedBy(ideal).multipliedBy(this.delta)

                if (fee.isGreaterThan(this.max)) fee = this.max
                
                fee = fee.multipliedBy(margin)

                fees.push(this.getAllFormatsFromNumeraire(fee))
                
                let discreteUtility = balance.minus(fee)
                
                utility = utility.plus(discreteUtility)
                
                utilities.push(this.getAllFormatsFromNumeraire(discreteUtility))
                
            }
            
        }

        utility = this.getAllFormatsFromNumeraire(utility)
        
        return [ utility, utilities, fees ]
        
    }
    
    async getParams () {
        return await this.contract.viewShell()
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

            const shells = new BigNumber( await this.contract.methods.viewSelectiveDeposit(
                addresses, 
                amounts.map(a => a.raw.integerValue().toFixed())
            ).call() )

            return this.getNumeraireFromRaw(shells)

        } catch {

            return false

        }

    }

    selectiveDeposit (addresses, amounts, minimum, deadline) {

        return this.contract.methods.selectiveDeposit(
            addresses, 
            amounts.map(a => a.raw.integerValue().toFixed()), 
            minimum, 
            deadline
        )

    }
    

    async viewSelectiveWithdraw (addresses, amounts) {

        try {

            const shellsToBurn = new BigNumber( await this.contract.methods.viewSelectiveWithdraw(
                addresses, 
                amounts.map( a => a.raw.integerValue().toFixed() )
            ).call() )

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