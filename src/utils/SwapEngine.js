import BigNumber from "bignumber.js"
import { Shell } from "./web3Classes"


export default class SwapEngine {

    async viewOriginSwap (originIndex, targetIndex, amount) {

        let origin = this.assets[originIndex]
        let target = this.assets[targetIndex]

        let originAmount = origin.getAllFormatsFromDisplay(amount)

        let targetAmount = await this.shell.viewOriginSwap(
            origin.address,
            target.address,
            originAmount.raw
        )

        return {
            originAmount: originAmount,
            targetAmount: target.getAllFormatsFromRaw(targetAmount)
        }

    }

    async viewTargetSwap (originIndex, targetIndex, amount) {

        let origin = this.assets[originIndex]
        let target = this.assets[targetIndex]

        let targetAmount = target.getAllFormatsFromDisplay(amount)

        let originAmount = await this.shell.viewTargetSwap(
            origin.address,
            target.address,
            targetAmount.raw
        )

        return {
            originAmount: origin.getAllFormatsFromRaw(originAmount),
            targetAmount: targetAmount,
        }

    }

    executeOriginSwap (originIndex, targetIndex, amount) {

        let origin = this.assets[originIndex]
        let target = this.assets[targetIndex]

        let originAmount = origin.getAllFormatsFromDisplay(amount)

        let minTarget = originAmount.numeraire.multipliedBy(new BigNumber(.99))

        let deadline = Math.floor(Date.now() /1000 + 900)

        return this.shell.originSwap(
            origin.address,
            target.address,
            originAmount.raw,
            target.getRawFromNumeraire(minTarget),
            deadline
        )

    }
    


}