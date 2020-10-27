import BigNumber from "bignumber.js"

BigNumber.config({ FORMAT: { groupSeparator: '' }})

const REVERTED = '3.963877391197344453575983046348115674221700746820753546331534351508065746944e+75'

export default class SwapEngine {

    async viewOriginSwap (originIndex, targetIndex, originAmount) {
        
        let origin = this.derivatives[originIndex]
        let target = this.derivatives[targetIndex]

        let targetAmount = await this.shell.viewOriginSwap(
            origin.address,
            target.address,
            origin.getRawFromDisplay(originAmount).toFixed()
        )
        
        if (!targetAmount || targetAmount.toString() == REVERTED) {

            throw(new Error("Reverted"))

        } else {
            
            return {
                originAmount: {
                    numeraire: origin.getNumeraireFromDisplay(originAmount),
                    display: originAmount,
                    raw: origin.getRawFromDisplay(originAmount)
                },
                targetAmount: {
                    numeraire: target.getNumeraireFromRaw(targetAmount),
                    display: target.getDisplayFromRaw(targetAmount, this.shell.swapDecimals),
                    raw: targetAmount
                }
            }

        }

    }

    async viewTargetSwap (originIndex, targetIndex, targetAmount) {

        let origin = this.derivatives[originIndex]
        let target = this.derivatives[targetIndex]

        let originAmount = await this.shell.viewTargetSwap(
            origin.address,
            target.address,
            target.getRawFromDisplay(targetAmount).toFixed()
        )
        
        if (!originAmount || originAmount.toString() == REVERTED) {
            
            throw(new Error("Reverted"))

        } else {

            return {
                originAmount: {
                    display: origin.getDisplayFromRaw(originAmount, this.shell.swapDecimals),
                    numeraire: origin.getNumeraireFromRaw(originAmount),
                    raw: originAmount
                },
                targetAmount: {
                    numeraire: target.getNumeraireFromDisplay(targetAmount),
                    raw: target.getRawFromDisplay(targetAmount),
                    display: targetAmount
                }
            }

        }

    }

    executeOriginSwap (originIndex, targetIndex, originAmount, minTargetAmount) {

        let origin = this.derivatives[originIndex]
        let target = this.derivatives[targetIndex]

        originAmount = origin.getAllFormatsFromDisplay(originAmount)

        let minTarget = target.getNumeraireFromDisplay(minTargetAmount)

        minTarget = minTarget.multipliedBy(new BigNumber(.99))

        let deadline = Math.floor(Date.now() /1000 + 900)

        return this.shell.originSwap(
            origin.address,
            target.address,
            originAmount.raw.toFixed(),
            target.getRawFromNumeraire(minTarget).toFormat(0),
            deadline
        )

    }

    executeTargetSwap (originIndex, targetIndex, maxOriginAmount, targetAmount) {

        let origin = this.derivatives[originIndex]
        let target = this.derivatives[targetIndex]

        targetAmount = target.getAllFormatsFromDisplay(targetAmount)

        let maxOrigin =  origin.getNumeraireFromDisplay(maxOriginAmount).multipliedBy(new BigNumber(1.01))

        let deadline = Math.floor(Date.now() / 1000 + 900)

        return this.shell.targetSwap(
            origin.address,
            target.address,
            origin.getRawFromNumeraire(maxOrigin).toFormat(0),
            targetAmount.raw.toFixed(),
            deadline
        )
        
    }

}