async function getSlippage (theseChickens, thoseChickens) {

    const theseRoosters = new BigNumber(swapPayload.type === 'origin'
        ? await origin.adapter.methods.viewNumeraireAmount(theseChickens.toFixed()).call()
        : await origin.adapter.methods.viewNumeraireAmount(thoseChickens.toFixed()).call()
    )

    const thoseRoosters = new BigNumber(swapPayload.type === 'origin'
        ? await target.adapter.methods.viewNumeraireAmount(thoseChickens.toFixed()).call()
        : await target.adapter.methods.viewNumeraireAmount(theseChickens.toFixed()).call()
    )

    const one = new BigNumber(1)
    const proportion = thoseRoosters.dividedBy(theseRoosters)

}