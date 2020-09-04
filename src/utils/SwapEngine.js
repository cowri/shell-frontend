import BigNumber from "bignumber.js"
import { Shell } from "./web3Classes"


export default class SwapEngine {

    async viewOriginSwap (originIndex, targetIndex, amount) {

        let origin = this.assets[originIndex]
        let target = this.assets[targetIndex]
        console.log("origin index", originIndex)
        console.log("target index", targetIndex)
        console.log("origin name", origin.name)
        console.log("target name", target.name)

        let originAmount = origin.getAllFormatsFromDisplay(amount)

        let targetAmount = await this.shell.viewOriginSwap(
            origin.address,
            target.address,
            originAmount.raw
        )

        console.log("target amount", targetAmount.toString())

        // console.log("target amount", targetAmount)
        // console.log("originAmount.raw", originAmount.raw.toString())
        // console.log("targetAmount.raw", target.getAllFormatsFromRaw(targetAmount).raw.toString())

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

        console.log("targetAmount.raw", targetAmount.raw.toString())
        console.log("originAmount.raw", origin.getAllFormatsFromRaw(originAmount).raw.toString())

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