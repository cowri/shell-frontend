import NumericFormats from './NumberFormats.js';
import StakingManagerABI from '../abi/StakingManager.abi.json'
import ERC20ABI from '../abi/ERC20.abi.json';
import BN from './BN.js';

export class Farm extends NumericFormats {
  /**
   * Stake class
   * @param web3
   * @param account {String}
   * @param {Object} pool
   * @param {String} pool.name
   * @param {String} pool.managerAddress
   * @param {String} pool.underlyingPoolAddress
   * @param {Object} shell
   */
  constructor(web3, account, pool, shell) {
    super();
    Object.assign(this, pool);
    this.web3 = web3;
    try {
      this.shell = shell.shell;
    } catch (e) {}
    this.account = this.web3.utils.toChecksumAddress(account);
    this.managerContract = new web3.eth.Contract(StakingManagerABI, pool.managerAddress)
    this.underlyingPoolContract = new web3.eth.Contract(ERC20ABI, pool.underlyingPoolAddress)
    this.cmpToken = new web3.eth.Contract(ERC20ABI, "0x96124f7382a0ed672bba8f9b92208434eabcfb40")

    this.underlyingBalance = null;
    this.userLockedValue = null;
    this.allowance = null;
    this.totalLockedValue = null;
    this.apr = null;
    this.CMPEarned = null;

  }

  async init(cmpPrice, blockTime) {
    await this.getUserUnderlyingTokensBalance();
    await this.calculateAPR(cmpPrice, blockTime);
  }

  async getUserUnderlyingTokensBalance() {
    const userLockedValue = BN(await this.managerContract.methods.balanceOf(this.account).call());
    this.userLockedValue = this.getAllFormatsFromRaw(userLockedValue);

    const underlyingBalance = BN(await this.underlyingPoolContract.methods.balanceOf(this.account).call());
    this.underlyingBalance = this.getAllFormatsFromRaw(underlyingBalance);

    const allowance = BN(await this.underlyingPoolContract.methods.allowance(this.account, this.managerAddress).call());
    this.allowance = this.getAllFormatsFromRaw(allowance);

    const totalLockedValue = BN(await this.underlyingPoolContract.methods.balanceOf(this.managerAddress).call());
    this.totalLockedValue = this.getAllFormatsFromRaw(totalLockedValue);

    const CMPEarned = BN(await this.managerContract.methods.earned(this.account).call())
    this.CMPEarned = this.getAllFormatsFromRaw(CMPEarned)

    this.periodFinish = await this.managerContract.methods.periodFinish().call()

    const rewardRate = BN(await this.managerContract.methods.rewardRate().call())
    this.rewardRate = this.getAllFormatsFromRaw(rewardRate)
  }

  async calculateAPR(cmpPrice, blockTime) {
    let underlyingPrice
    if (this.shell) {
      const totalUnderlyingPoolLiquidity = this.shell.liquidityTotal.raw
      const totalCMPLPLiquidity = await this.underlyingPoolContract.methods.totalSupply().call()
      underlyingPrice = totalUnderlyingPoolLiquidity.div(totalCMPLPLiquidity)
    } else if (this.name === "CMP") {
      underlyingPrice = BN(cmpPrice)
    } else {
      const totalLPSupply = await this.underlyingPoolContract.methods.totalSupply().call()
      const cmpPoolBalance = await this.cmpToken.methods.balanceOf(this.underlyingPoolAddress).call()
      underlyingPrice = BN(cmpPoolBalance).times(cmpPrice).times(2).div(totalLPSupply)
    }

    this.totalLockedValueUsd = this.totalLockedValue.numeraire.times(underlyingPrice).toFixed(2)
    this.depositValueUsd = this.userLockedValue.numeraire.times(underlyingPrice).toFixed(2)

    if (+this.periodFinish === 0) {
      this.apr = 'TBA'
    } else if (blockTime > this.periodFinish) {
      this.apr = 'Ended'
    } else {
      this.apr = BN(this.periodDuration)
          .times(this.rewardRate.numeraire)
          .times(cmpPrice)
          .times(12)
          .div(
              this.totalLockedValue.numeraire.times(underlyingPrice)
          )
          .toFixed(2)
    }
  }

  async approve() {
    return this.underlyingPoolContract.methods.approve(
      this.managerAddress,
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    ).send({from: this.account})
  }

  async deposit(value) {
    const valueWei = BN(value).times(BN(10).pow(18));
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.managerContract.methods.deposit(valueWei.toString()).estimateGas({from: this.account});
    return this.managerContract.methods.deposit(valueWei.toString()).send({
      from: this.account,
      gasPrice,
      gas,
    })
  }

  async withdraw(value) {
    const valueWei = BN(value).times(BN(10).pow(18));
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.managerContract.methods.withdraw(valueWei.toString()).estimateGas({from: this.account});
    return this.managerContract.methods.withdraw(valueWei.toString()).send({
      from: this.account,
      gasPrice,
      gas,
    })
  }

  async exit() {
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.managerContract.methods.exit().estimateGas({from: this.account});
    return this.managerContract.methods.exit().send({
      from: this.account,
      gasPrice,
      gas,
    })
  }

  async claim() {
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.managerContract.methods.exit().estimateGas({from: this.account});
    return this.managerContract.methods.claim().send({
      from: this.account,
      gasPrice,
      gas,
    })
  }

}
