import BigNumber from "bignumber.js"

BigNumber.config({ FORMAT: { groupSeparator: '' }})

const REVERTED = '3.963877391197344453575983046348115674221700746820753546331534351508065746944e+75'

export default class SwapEngine {

    async viewOriginSwap (origin, target, originAmount) {
        
        let shells = this.pairs[origin.address][target.address]
        
        let quotes = await Promise.all(shells.map( async (ix) => {
            return await this.shells[ix].viewOriginSwap(
                origin.address,
                target.address,
                origin.getRawFromDisplay(originAmount).toFixed()
            )
        }))
        
        let shellIx
        let shellDerivativeIx
        let max = new BigNumber(0)
        
        for (let i = 0; i < shells.length; i++) {
            console.log("quote", quotes[i].toString())
            if (!quotes[i] || quotes[i].toString() == REVERTED) continue
            if (quotes[i].isGreaterThan(max)){
                max = quotes[i]
                shellIx = i
            }
        }
        
        if (shellIx == undefined) { throw( new Error("reverted")) }
        
        for (let i = 0; i < this.shells[shellIx].derivatives.length; i++) {
            if (this.shells[shellIx].derivatives[i].address == origin.address) {
                shellDerivativeIx = i
                break
            }
        }
        
        return {
            originAmount: {
                numeraire: origin.getNumeraireFromDisplay(originAmount),
                display: originAmount,
                raw: origin.getRawFromDisplay(originAmount)
            },
            targetAmount: {
                numeraire: target.getNumeraireFromRaw(max),
                display: target.getDisplayFromRaw(max, target.swapDecimals),
                raw: max
            },
            shellIx: shellIx,
            shellDerivativeIx: shellDerivativeIx
        }
        
    }

    async viewTargetSwap (origin, target, targetAmount) {
        
        let shells = this.pairs[origin.address][target.address]
        
        let quotes = await Promise.all(shells.map( async (ix) => {
            return await this.shells[ix].viewOriginSwap(
                origin.address,
                target.address,
                target.getRawFromDisplay(targetAmount).toFixed()
            )
        }))
        
        let shell
        let min = new BigNumber(0)
        
        for (let i = 0; i < shells.length; i++) {
            if (!quotes[i] || quotes[i].toString() == REVERTED) continue
            if (quotes[i].isLessThan(min)){
                min = quotes[i]
                shell = i
            }
        }
        
        if (!shell) throw( new Error("reverted"))
        
        return {
            originAmount: {
                display: origin.getDisplayFromRaw(min, this.shell.swapDecimals),
                numeraire: origin.getNumeraireFromRaw(min),
                raw: min
            },
            targetAmount: {
                numeraire: target.getNumeraireFromDisplay(targetAmount),
                raw: target.getRawFromDisplay(targetAmount),
                display: targetAmount
            },
            shellIx: shell
        }

    }

    executeOriginSwap (shellIx, origin, target, originAmount, minTargetAmount) {

        originAmount = origin.getAllFormatsFromDisplay(originAmount)

        let minTarget = target.getNumeraireFromDisplay(minTargetAmount)

        minTarget = minTarget.multipliedBy(new BigNumber(.99))

        let deadline = Math.floor(Date.now() /1000 + 900)

        return this.shells[shellIx].originSwap(
            origin.address,
            target.address,
            originAmount.raw.toFixed(),
            target.getRawFromNumeraire(minTarget).toFormat(0),
            deadline
        )

    }

    executeTargetSwap (shellIx, origin, target, maxOriginAmount, targetAmount) {

        targetAmount = target.getAllFormatsFromDisplay(targetAmount)

        let maxOrigin =  origin.getNumeraireFromDisplay(maxOriginAmount).multipliedBy(new BigNumber(1.01))

        let deadline = Math.floor(Date.now() / 1000 + 900)

        return this.shells[shellIx].targetSwap(
            origin.address,
            target.address,
            origin.getRawFromNumeraire(maxOrigin).toFormat(0),
            targetAmount.raw.toFixed(),
            deadline
        )
        
    }

}