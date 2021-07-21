import config from '../mainnet.multiple.config.json';
import {Farm} from './Farm.js';
import axios from "axios";

export default class FarmingEngine {
  constructor(web3, account, shells) {
    this.web3 = web3;
    this.shells = shells;
    this.account = this.web3.utils.toChecksumAddress(account);
    this.farms = {};
    this.cmpPrice = {};
  }

  async init() {
    const resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=component&vs_currencies=usd');
    this.cmpPrice = resp.data.component.usd;

    const farms = {}
        //[config.stakingPools[0].managerAddress]: {},
        //[config.stakingPools[1].managerAddress]: {},
    config.farmingPools.forEach(pool => {
      farms[pool.managerAddress] = {}
    })

    await Promise.all(config.farmingPools.map(async (pool) => {
      const shell = this.shells.find((item) => {
        return item.shell.address.toLowerCase() === pool.underlyingPoolAddress.toLowerCase()
      })
      const farm = new Farm(this.web3, this.account, pool, shell);
      await farm.init(this.cmpPrice)
      farms[farm.managerAddress] = farm;
    }))

    this.farms = farms
  }
}
