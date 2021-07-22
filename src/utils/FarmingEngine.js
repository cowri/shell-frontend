import config from '../mainnet.multiple.config.json';
import {Farm} from './Farm.js';
import axios from "axios";

export default class FarmingEngine {
  constructor(web3, account, shells) {
    this.web3 = web3;
    this.shells = shells;
    this.account = this.web3.utils.toChecksumAddress(account);
    this.farms = {};
    this.stakes = {};
    this.cmpPrice = {};
  }

  async init() {
    await this.getCmpPrice()
    const pools = await Promise.all([this.formPools(config.farmingPools), this.formPools(config.stakingPools)])
    this.farms = pools[0]
    this.stakes = pools[1]
  }

  async getCmpPrice() {
    const resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=component&vs_currencies=usd');
    this.cmpPrice = resp.data.component.usd;
  }

  async formPools(pools) {
    const items = {}
    await Promise.all(pools.map(async (pool) => {
      const shell = this.shells.find((item) => {
        return item.shell.address.toLowerCase() === pool.underlyingPoolAddress.toLowerCase()
      })
      const item = new Farm(this.web3, this.account, pool, shell);
      await item.init(this.cmpPrice)
      items[item.managerAddress] = item;
    }))
    return items;
  }
}
