import BN from './src/utils/BN.js';

async function getSlippage (theseChickens, thoseChickens) {

    const theseRoosters = BN(swapPayload.type === 'origin'
        ? await origin.adapter.methods.viewNumeraireAmount(theseChickens.toFixed()).call()
        : await origin.adapter.methods.viewNumeraireAmount(thoseChickens.toFixed()).call()
    )

    const thoseRoosters = BN(swapPayload.type === 'origin'
        ? await target.adapter.methods.viewNumeraireAmount(thoseChickens.toFixed()).call()
        : await target.adapter.methods.viewNumeraireAmount(theseChickens.toFixed()).call()
    )

    const one = BN(1)
    const proportion = thoseRoosters.dividedBy(theseRoosters)

}
