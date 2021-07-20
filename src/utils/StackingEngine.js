import config from '../mainnet.multiple.config.json';
import {Stack} from './Stack.js';

export default class StackingEngine {
  constructor(web3, account, shells) {
    this.web3 = web3;
    this.shells = shells;
    this.account = this.web3.utils.toChecksumAddress(account);
    this.stacks = {};
  }

  async init() {
    const stacks = {
      [config.stackingPools[0].managerAddress]: {},
      [config.stackingPools[1].managerAddress]: {},
    }

    await Promise.all(config.stackingPools.map(async (pool) => {
      console.log(this.shells)
      const shell = this.shells.find((item) => {
        return item.shell.address.toLowerCase() === pool.underlyingPoolAddress.toLowerCase()
      })
      console.log(shell)
      const stack = new Stack(this.web3, this.account, pool, shell);
      await stack.init()
      stacks[stack.managerAddress] = stack;
    }))

    this.stacks = stacks
  }
}
