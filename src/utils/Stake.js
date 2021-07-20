import NumericFormats from './NumberFormats.js';
import StakingManagerABI from '../abi/StakingManager.abi.json'
import ERC20ABI from '../abi/ERC20.abi.json';
import BigNumber from 'bignumber.js';

export class Stake extends NumericFormats {
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
    this.shell = shell.shell;
    this.account = this.web3.utils.toChecksumAddress(account);
    this.managerContract = new web3.eth.Contract(StakingManagerABI, pool.managerAddress)
    this.underlyingPoolContract = new web3.eth.Contract(ERC20ABI, pool.underlyingPoolAddress)

    this.underlyingBalance = null;
    this.userLockedValue = null;
    this.allowance = null;
    this.totalLockedValue = null;
    this.apr = null;
    this.CMPEarned = null;

  }

  async init(cmpPrice) {
    await this.getUserUnderlyingTokensBalance();
    await this.calculateAPR(cmpPrice);
  }

  async getUserUnderlyingTokensBalance() {
    const userLockedValue = new BigNumber(await this.managerContract.methods.balanceOf(this.account).call());
    this.userLockedValue = this.getAllFormatsFromRaw(userLockedValue);

    const underlyingBalance = new BigNumber(await this.underlyingPoolContract.methods.balanceOf(this.account).call());
    this.underlyingBalance = this.getAllFormatsFromRaw(underlyingBalance);

    const allowance = new BigNumber(await this.underlyingPoolContract.methods.allowance(this.account, this.managerAddress).call());
    this.allowance = this.getAllFormatsFromRaw(allowance);

    const totalLockedValue = new BigNumber(await this.underlyingPoolContract.methods.balanceOf(this.managerAddress).call());
    this.totalLockedValue = this.getAllFormatsFromRaw(totalLockedValue);

    const CMPEarned = new BigNumber(await this.managerContract.methods.earned(this.account).call())
    this.CMPEarned = this.getAllFormatsFromRaw(CMPEarned)
  }

  async calculateAPR(cmpPrice) {
    const totalUnderlyingPoolLiquidity = this.shell.liquidityTotal.raw
    const totalCMPLPLiquidity = await this.underlyingPoolContract.methods.totalSupply().call()
    let CMPLPPrice = totalUnderlyingPoolLiquidity.div(totalCMPLPLiquidity)

    this.apr = new BigNumber(this.monthRewards)
      .times(cmpPrice)
      .times(12)
      .div(
        this.totalLockedValue.numeraire.times(CMPLPPrice)
      )
      .toFixed(0)
  }

  async approve() {
    return this.underlyingPoolContract.methods.approve(
      this.managerAddress,
      '115792089237316195423570985008687907853269984665640564039457584007913129639935',
    ).send({from: this.account})
  }

  async deposit(value) {
    const valueWei = new BigNumber(value).times(new BigNumber(10).pow(18));
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.managerContract.methods.deposit(valueWei.toString()).estimateGas({from: this.account});
    return this.managerContract.methods.deposit(valueWei.toString()).send({
      from: this.account,
      gasPrice,
      gas,
    })
  }

  async withdraw(value) {
    const valueWei = new BigNumber(value).times(new BigNumber(10).pow(18));
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
