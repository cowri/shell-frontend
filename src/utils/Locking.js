import NumericFormats from './NumberFormats.js';
import veCMPDistributionAbi from '../abi/VeCMPDistribution.json'
import veCMPAbi from '../abi/VeCMP.json'
import ERC20ABI from '../abi/ERC20.abi.json';
import config from '../config.js';
import {chainId} from '../constants/chainId.js';
import axios from 'axios';
import {getThursdayUTCTimestamp} from './time.js';
import BN from './BN.js';
import {MAX_UINT} from '../constants';

const INITIAL_TOKENS_STATE = {
  [config.cmpAddress[chainId]]: {
    symbol: 'CMP',
    balance: '0',
    allowance: '0',
  },
  [config.veCMPAddress[chainId]]: {
    symbol: 'veCMP',
    balance: '0',
  },
}

export class Locking extends NumericFormats {
  distributionContractAddress = config.veCMPDistributionAddress[chainId];
  veCMPAddress = config.veCMPAddress[chainId];
  cmpAddress = config.cmpAddress[chainId];

  constructor(web3, account) {
    super();

    this.loading = true;

    this.web3 = web3;
    this.account = this.web3.utils.toChecksumAddress(account);
    this.distributionContract = new this.web3.eth.Contract(veCMPDistributionAbi, this.distributionContractAddress)
    this.veCMPContract = new this.web3.eth.Contract(veCMPAbi, this.veCMPAddress)
    this.cmpTokenContract = new web3.eth.Contract(ERC20ABI, this.cmpAddress)

    this.decimals = 18;
    this.displayDecimals = 4;
    this.stats = {};
    this.tokens = INITIAL_TOKENS_STATE;
    this.claimableCMP = 0;
    this.distroTime = 'Calculating';
    this.cmpPrice = '0';
    this.aprStats = {};

    this.approve = this.approve.bind(this)
    this.withdraw = this.withdraw.bind(this)
    this.createLock = this.createLock.bind(this)
    this.increaseAmount = this.increaseAmount.bind(this)
    this.increaseUnlockTime = this.increaseUnlockTime.bind(this)
  }

  async init() {
    await this.fetchTokensParams();
    this.loading = false;
  }

  async fetchTokensParams() {
    this.claimableCMP = (await this.distributionContract.methods.claimable(this.account).call())
    await Promise.all([this.getLockingParams(), this.getTokensBalances(), this.getLockerAllowance()])
    await this.calculateApr()
  }

  async getLockingParams() {
    let params = []
    params.push(
      this.cmpTokenContract.methods.balanceOf(config.veCMPAddress[chainId]).call(),
      this.cmpTokenContract.methods.totalSupply().call(),
      this.veCMPContract.methods.totalSupply().call(),
    )
    params.push(this.veCMPContract.methods.locked(this.account).call())
    params = await Promise.all(params)

    const [totalLocked, totalSupply, totalMinted, locked] = params

    this.stats = {
      totalLocked: this.getAllFormatsFromRaw(totalLocked),
      totalSupply: this.getAllFormatsFromRaw(totalSupply),
      totalMinted: this.getAllFormatsFromRaw(totalMinted),
      locked: locked ? this.getAllFormatsFromRaw(locked[0]) : 0,
      lockEnd: Number(locked ? locked[1].toString() : 0),
    }
  }

  async getTokensBalances() {
    const balances = await Promise.all(
      Object.keys(this.tokens).map(tokenAddress => {
        const contract = new this.web3.eth.Contract(ERC20ABI, tokenAddress)
        return contract.methods.balanceOf(this.account).call()
      }),
    )
    this.tokens[this.cmpAddress].balance = this.getAllFormatsFromRaw(balances[0].toString());
    this.tokens[this.veCMPAddress].balance = this.getAllFormatsFromRaw(balances[1].toString());
  }

  async getLockerAllowance() {
    const contract = new this.web3.eth.Contract(ERC20ABI, this.cmpAddress)
    const allowance = await contract.methods.allowance(this.account, this.veCMPAddress).call()
    this.tokens[this.cmpAddress].allowance = this.getAllFormatsFromRaw(allowance.toString())
  }

  async getCmpPrice() {
    const resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=component&vs_currencies=usd');
    this.cmpPrice = resp.data.component.usd;
  }

  async calculateApr() {
    const totalVeCmp = this.stats.totalMinted.raw;
    const userVeCmpBalance = this.tokens[this.veCMPAddress].balance.raw
    const lockedCmp = this.stats.totalLocked.raw;
    const totalCmpSupply = this.stats.totalSupply.raw;
    await this.getCmpPrice()

    // contract weekly fees
    const week = 604800;
    let t = getThursdayUTCTimestamp();
    const weeklyFeesTable = [];
    let total = '0';
    let fourWeekAverage = '0';
    let weeksAvg = 1;
    let distroTime = '0';
    for (let i = 1; i < 5; i++) {
      const thisWeekFees = await this.distributionContract.methods.tokens_per_week(t).call()

      if (BN(thisWeekFees.toString()).gt(0)) {
        total = BN(thisWeekFees).plus(total).toString()

        let thisWeek = {
          date: new Date(t * 1000).toDateString(),
          fees: '$' + BN(thisWeekFees).div(1e18).toString(),
          rawFees: BN(thisWeekFees).div(1e18).toString()
        }
        if (i > 0 && weeksAvg < 5) {
          fourWeekAverage = BN(thisWeekFees.toString()).div(1e18).plus(fourWeekAverage).toString()
          weeksAvg++
        }
        weeklyFeesTable.push(thisWeek)
      } else {
        if (i > 8) {
          i = 9 //end loop
        }
      }
      t = t - week;
    }

    let currentTs = new Date().getTime() / 1000 | 0;

    if (currentTs > t) {
      let nextdistroTime = await this.distributionContract.methods.last_token_time().call();
      nextdistroTime = +nextdistroTime + 6 * 86400
      if (nextdistroTime > currentTs) {
        let d = new Date(nextdistroTime * 1000);
        distroTime = d.toUTCString();
      }
    }

    const weeklyFees = weeklyFeesTable[1]?.rawFees || '0'
    // for future
    // const totalFees = BN(weeklyFees).div(7)
    const feeAPYAverage = BN(fourWeekAverage).times(365).times(1e20).div(4).div(7).div(totalVeCmp).div(this.cmpPrice).toFixed(2)
    const weeklyVolume = BN(weeklyFees).times(100).div(0.02).toFixed(2)
    const userFee = BN(weeklyFees).times(userVeCmpBalance).div(7).div(totalVeCmp).div(this.cmpPrice).toFixed(2)
    const feePerVeCRV = BN(weeklyFees).times(52).div(totalVeCmp).div(1e18).toFixed(2)
    const feeAPY = BN(weeklyFees).times(52).times(1e20).div(this.cmpPrice).div(totalVeCmp).toFixed(2)
    this.aprStats = {
      apr: feeAPY.toString() === 'NaN' ? 'TBA' : `${feeAPY.toString()}%`,
      feeAPYAverage,
      feePerVeCRV,
      userFee,
      weeklyVolume,
      distroTime,
    }
    this.distroTime = distroTime
  }

  resetTokensParams() {
    this.tokens = INITIAL_TOKENS_STATE;
  }

  approve() {
    this.cmpTokenContract.methods.approve(this.veCMPAddress, MAX_UINT).send({
      from: this.account,
    })
  }

  async createLock(onTxHash, onConfirmation, onError, { value, increaseLock }) {
    const valWei = BN(value).times(1e18).toString()
    const unlockTimeString = BN(increaseLock.getTime()).div(1000)
      .toFixed(0, 1)
      .toString()
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.veCMPContract.methods.create_lock(valWei, unlockTimeString).estimateGas({from: this.account});
    return this.veCMPContract.methods.create_lock(valWei, unlockTimeString).send({
        from: this.account,
        gasPrice,
        gas,
      })
        .once('transactionHash', onTxHash)
        .on('confirmation', onConfirmation)
        .on('error', onError)
  }

  async increaseAmount(onTxHash, onConfirmation, onError, value) {
    const valWei = BN(value).times(1e18).toString()
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.veCMPContract.methods.increase_amount(valWei).estimateGas({from: this.account});
    return this.veCMPContract.methods.increase_amount(valWei).send({
      from: this.account,
      gasPrice,
      gas,
    })
      .once('transactionHash', onTxHash)
      .on('confirmation', onConfirmation)
      .on('error', onError)
  }

  async increaseUnlockTime(onTxHash, onConfirmation, onError, increaseLock) {
    const t = BN(increaseLock.getTime())
      .div(1000)
      .toFixed(0, 1)
      .toString()
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.veCMPContract.methods.increase_unlock_time(t).estimateGas({from: this.account})
    return this.veCMPContract.methods.increase_unlock_time(t).send({
      from: this.account,
      gasPrice,
      gas,
    })
      .once('transactionHash', onTxHash)
      .on('confirmation', onConfirmation)
      .on('error', onError)
  }

  async withdraw(onTxHash, onConfirmation, onError) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.veCMPContract.methods.withdraw().estimateGas({from: this.account})
    return this.veCMPContract.methods.withdraw().send({
      from: this.account,
      gas,
      gasPrice,
    })
      .once('transactionHash', onTxHash)
      .on('confirmation', onConfirmation)
      .on('error', onError)
  }
}
