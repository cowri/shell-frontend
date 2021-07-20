import config from '../mainnet.multiple.config.json';
import {Stake} from './Stake.js';
import axios from "axios";

export default class StakingEngine {
  constructor(web3, account, shells) {
    this.web3 = web3;
    this.shells = shells;
    this.account = this.web3.utils.toChecksumAddress(account);
    this.stakes = {};
    this.cmpPrice = {};
  }

  async init() {
    const resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=component&vs_currencies=usd');
    this.cmpPrice = resp.data.component.usd;

    const stakes = {}
        //[config.stakingPools[0].managerAddress]: {},
        //[config.stakingPools[1].managerAddress]: {},
    config.stakingPools.forEach(pool => {
      stakes[pool.managerAddress] = {}
    })

    await Promise.all(config.stakingPools.map(async (pool) => {
      const shell = this.shells.find((item) => {
        return item.shell.address.toLowerCase() === pool.underlyingPoolAddress.toLowerCase()
      })
      const stake = new Stake(this.web3, this.account, pool, shell);
      await stake.init(this.cmpPrice)
      stakes[stake.managerAddress] = stake;
    }))

    this.stakes = stakes
  }
}
