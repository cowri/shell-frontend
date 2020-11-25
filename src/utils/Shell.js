import BigNumber from 'bignumber.js';

import ShellABI from '../abi/Shell.abi.json';

import NumericFormats from "./NumberFormats.js";

BigNumber.config({ DECIMAL_PLACES: 18 })

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
        this.max = new BigNumber('.25')

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
        
        const [ utilityTotal, utilitiesTotal, fees ] = this.calculateUtilities(liq[0].numeraire, liq[1].map(n => n.numeraire))
        
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

            const balance = liquidities[i]
            
            const ideal = liquidity.multipliedBy(this.weights[i])

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
    
    calculateLiquidity (oldTotal, newTotal, oldBalances, newBalances, totalShells) {
        
        try {

            this.enforceHalts(oldTotal, newTotal, oldBalances, newBalances)

        } catch (e) { return false }
        
        const [ oldUtil, _nothing, omegas ] = this.calculateUtilities(oldTotal, oldBalances)
        const [ newUtil, _empty, psis ] = this.calculateUtilities(newTotal, newBalances)
        
        const omega = omegas.reduce( ((t,c) => t.plus(c.numeraire)), new BigNumber(0) )
        const psi = psis.reduce( ((t,c) => t.plus(c.numeraire)), new BigNumber(0) )
        
        const feeDiff = psi.minus(omega)
        const liqDiff = newTotal.minus(oldTotal)
        
        let shellMultiplier
        
        if (totalShells.isZero()) {
            
            return newTotal.minus(psi)

        } else if (feeDiff >= 0) {
            
            shellMultiplier = liqDiff
                .minus(feeDiff)
                .dividedBy(oldUtil.numeraire)

        } else {
            
            shellMultiplier = liqDiff
                .minus( this.lambda.multipliedBy(feeDiff) )
                .dividedBy( oldUtil.numeraire )
            
        }
        
        const burnt = totalShells
            .multipliedBy(shellMultiplier)
            .multipliedBy(ONE.plus(this.epsilon))
        
        return burnt 
        
    }
    
    enforceHalts (oldTotal, newTotal, oldBalances, newBalances) {
        
        for (let i = 0; i < oldBalances.length; i++) {
            
            const newBal = newBalances[i]
            const oldBal = oldBalances[i]

            const nIdeal = newTotal.multipliedBy(this.weights[i])

            if (newBal.isGreaterThan(nIdeal)) {
                
                const upperAlpha = ONE.plus(this.alpha)
                
                const newHalt = nIdeal.multipliedBy(upperAlpha)
                
                if (newBal.isGreaterThan(newHalt)) {
                    
                    const oldHalt = oldTotal.multipliedBy(this.weights[i]).multipliedBy(upperAlpha)
                    
                    const exacerbated = newBal.minus(newHalt).isGreaterThan(oldBal.minus(oldHalt))
                    
                    if (oldBal.isGreaterThan(oldHalt) || exacerbated) {

                        throw new Error("above-upper-halt")

                    }
                    
                }

            } else {
                
                const lowerAlpha = ONE.minus(this.alpha)
                
                const newHalt = nIdeal.multipliedBy(lowerAlpha)

                if (newBal.isLessThan(newHalt)) {
                    
                    const oldHalt = oldTotal.multipliedBy(this.weights[i]).multipliedBy(lowerAlpha)

                    const exacerbated = newHalt.minus(newBal).isGreaterThan(oldHalt.minus(oldBal))
                    
                    if (oldBal.isLessThan(oldHalt) || exacerbated) {
                        
                        throw new Error("below-lower-halt")
                        
                    }
                }
            }
        }
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