import RewardABI from '../abi/Rewards.abi.json';
import config from '../mainnet.multiple.config';
import rewardsData from '../distr_mainnet.json';


export default class Rewards {
  constructor (web3, account) {
    this.account = web3.utils.toChecksumAddress(account);
    this.web3 = web3;
    this.contract = new web3.eth.Contract(RewardABI, config.claimRewards);

    if (rewardsData.claims[this.account]) {
      this.amount = rewardsData.claims[this.account].amount;
      this.index = rewardsData.claims[this.account].index;
      this.proof = rewardsData.claims[this.account].proof;
      this.isClaimed = true;
    }

  }

  async claim(handleTxHash, onConfirmation, onError) {
    const params = [
      this.index,
      this.account,
      this.amount,
      this.proof,
    ];
    const gasPrice = await this.web3.eth.getGasPrice();
    const gas = await this.contract.methods.claim(...params).estimateGas({from: this.account});
    await this.contract.methods
      .claim(...params)
      .send({gas, gasPrice, from: this.account})
      .on('transactionHash', handleTxHash)
      .on('confirmation', onConfirmation)
      .on('error', onError);
  }

  async getClaimedStatus() {
    if (rewardsData.claims[this.account]) {
      this.isClaimed = await this.contract.methods.isClaimed(this.index).call();
    }
  }
}
