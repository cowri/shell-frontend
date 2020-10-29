import ERC20ABI from '../abi/ERC20.abi.json';

import NumberFormats from "./NumberFormats.js";

export default class Asset extends NumberFormats {

    constructor (web3, address, name, symbol, icon, decimals) {

        super()

        this.contract = new web3.eth.Contract(ERC20ABI, address)
        this.address = address
        this.name = name
        this.symbol = symbol
        this.icon = icon
        this.decimals = decimals

    }

    approve (address, amount) {

        return this.contract.methods.approve(address, amount);

    }

    async allowance (owner, spender) {

        const allowance = await this.contract.methods.allowance(owner, spender).call()

        return this.getAllFormatsFromRaw(allowance)

    }

    async balanceOf (account) {

        const balance = await this.contract.methods.balanceOf(account).call()

        return this.getAllFormatsFromRaw(balance)

    }

}