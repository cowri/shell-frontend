import React from 'react';
import {fromJS} from 'immutable';
import config from '../config.js';
import Asset from './Asset';
import Shell from './Shell';
import SwapEngine from './SwapEngine';
import {CircularProgress} from '@material-ui/core';

import shellIcon from '../assets/logo.png';
import BN from './BN.js';
import FarmingEngine from './FarmingEngine.js';
import {chainId} from '../constants/chainId.js';
import {Locking} from './Locking.js';

export default class Engine extends SwapEngine {

  constructor(web3, setState, state) {

    super();

    const self = this;

    this.state = state;

    this.web3 = web3;

    this.setState = setState;

    this.shells = [];
    this.assets = [];
    this.derivatives = [];
    this.overlaps = {};
    this.pairsToShells = {};

    this.staking = {};
    this.farming = {};
    this.locking = null;

    for (const _pool_ of config.pools[chainId]) {
      const shell = new Shell(
        this.web3,
        _pool_.shell,
        'Component',
        'SHL',
        shellIcon,
        18
      );

      shell.displayDecimals = _pool_.displayDecimals;
      shell.farming = _pool_.farming
      shell.swapDecimals = _pool_.swapDecimals;
      shell.alpha = BN(_pool_.params.alpha);
      shell.beta = BN(_pool_.params.beta);
      shell.delta = BN(_pool_.params.delta);
      shell.epsilon = BN(_pool_.params.epsilon);
      shell.lambda = BN(_pool_.params.lambda);

      shell.weights = [];
      shell.assets = [];
      shell.derivatives = [];
      shell.assetIx = {};
      shell.derivativeIx = {};

      for (let ix = 0; ix < _pool_.assets.length; ix++) {

        const _asset_ = _pool_.assets[ix];

        const asset = new Asset(
          this.web3,
          _asset_.address,
          _asset_.name,
          _asset_.symbol,
          _asset_.icon,
          _asset_.decimals
        );

        asset.displayDecimals = _pool_.displayDecimals;
        asset.swapDecimals = _pool_.swapDecimals;
        asset.weight = BN(_asset_.weight);
        asset.approveToZero = _asset_.approveToZero;

        shell.assetIx[_asset_.address] = ix;
        shell.derivativeIx[_asset_.address] = shell.derivatives.length;

        asset.derivatives = [];

        for (let dix = 0; dix < _asset_.derivatives.length; dix++) {

          const derivative = new Asset(
            this.web3,
            _asset_.derivatives[dix].address,
            _asset_.derivatives[dix].name,
            _asset_.derivatives[dix].symbol,
            _asset_.derivatives[dix].icon,
            _asset_.derivatives[dix].decimals
          );

          derivative.displayDecimals = _pool_.displayDecimals;
          derivative.swapDecimals = _pool_.swapDecimals;

          asset.derivatives.push(derivative);

          shell.derivativeIx[asset.derivatives[dix].address] = shell.derivatives.length;

        }

        shell.weights.push(asset.weight);
        shell.assets.push(asset);
        shell.derivatives.push(asset);
        shell.derivatives = shell.derivatives.concat(asset.derivatives);
        this.assets.push(asset);
        this.derivatives.push(asset);
        this.derivatives = this.derivatives.concat(asset.derivatives);


      }

      for (let ix = 0; ix < _pool_.assets.length; ix++) {
        for (let xi = ix + 1; xi < _pool_.assets.length; xi++) {
          setOverlap(
            _pool_.assets[ix].symbol,
            _pool_.assets[xi].symbol,
          );
          setPair(
            this.shells.length,
            _pool_.assets[ix].address,
            _pool_.assets[xi].address
          );
          for (let dix = 0; dix < _pool_.assets[ix].derivatives.length; dix++) {
            setOverlap(
              _pool_.assets[ix].symbol,
              _pool_.assets[ix].derivatives[dix].symbol
            );
            setPair(
              this.shells.length,
              _pool_.assets[ix].address,
              _pool_.assets[ix].derivatives[dix].address
            );
            for (let dixid = dix + 1; dixid < _pool_.assets[ix].derivatives.length; dixid++) {
              setOverlap(
                _pool_.assets[ix].derivatives[dix].symbol,
                _pool_.assets[ix].derivatives[dixid].symbol
              );
              setPair(
                this.shells.length,
                _pool_.assets[ix].derivatives[dix].address,
                _pool_.assets[ix].derivatives[dixid].address
              );
            }
            for (let xid = 0; xid < _pool_.assets[xi].derivatives.length; xid++) {
              setOverlap(
                _pool_.assets[ix].symbol,
                _pool_.assets[xi].derivatives[xid].symbol
              );
              setOverlap(
                _pool_.assets[ix].derivatives[dix].symbol,
                _pool_.assets[xi].derivatives[xid].symbol
              );
              setOverlap(
                _pool_.assets[xi].symbol,
                _pool_.assets[ix].derivatives[dix].symbol
              );
              setPair(
                this.shells.length,
                _pool_.assets[xi].address,
                _pool_.assets[ix].derivatives[dix].address
              );
              setPair(
                this.shells.length,
                _pool_.assets[ix].address,
                _pool_.assets[xi].derivatives[xid].address
              );
              setPair(
                this.shells.length,
                _pool_.assets[ix].derivatives[dix].address,
                _pool_.assets[xi].derivatives[xid].address
              );
            }
          }
        }
      }

      if (!_pool_.hideapy) {

        shell.apy = <CircularProgress/>;
        this.getAPY(_pool_.shell).then(result => shell.apy = result);

      } else shell.apy = false;

      shell.tag = _pool_.tag;

      this.shells.push(shell);

    }

    function filter(x) {
      if (!this.has(x.symbol)) {
        this.add(x.symbol);
        return true;
      } else return false;
    }

    this.assets = this.assets.filter(filter, new Set());
    this.derivatives = this.derivatives.filter(filter, new Set());

    function setOverlap(left, right) {
      const ltr = self.overlaps[left] ? self.overlaps[left] : [];
      const rtl = self.overlaps[right] ? self.overlaps[right] : [];
      if (ltr.indexOf(right) === -1) ltr.push(right);
      if (rtl.indexOf(left) === -1) rtl.push(left);
      self.overlaps[left] = ltr;
      self.overlaps[right] = rtl;
    }

    function setPair(s, _x, y_) {
      const x = self.pairsToShells[_x] ? self.pairsToShells[_x] : {};
      const y = self.pairsToShells[y_] ? self.pairsToShells[y_] : {};
      if (!x[y_]) x[y_] = [];
      if (!y[_x]) y[_x] = [];
      x[y_].push(s);
      y[_x].push(s);
      self.pairsToShells[_x] = x;
      self.pairsToShells[y_] = y;
    }

  }

  set network(network) {

    this.setState(this.state.set('network', network));

  }

  getFees(shellIx, addrs, amts) {

    let prevLiq = this.state.getIn(['shells', shellIx, 'shell', 'liquidityTotal']).toObject();
    let prevLiqs = this.state.getIn(['shells', shellIx, 'shell', 'liquiditiesTotal']).toJS();

    let nextLiq = prevLiq;
    let nextLiqs = prevLiqs;

    for (let i = 0; i < addrs.length; i++) {

      let di = this.shells[shellIx].assetIx[addrs[i]];

      nextLiqs[di] = this.shells[shellIx].getAllFormatsFromNumeraire(
        nextLiqs[di].numeraire.plus(amts[i].numeraire));

      nextLiq = this.shells[shellIx].getAllFormatsFromNumeraire(
        nextLiq.numeraire.plus(amts[i].numeraire));

    }

    const [, , prevFees] = this.shells[shellIx].calculateUtilities(prevLiq, prevLiqs);
    const [, , nextFees] = this.shells[shellIx].calculateUtilities(nextLiq, nextLiqs);

    const fees = [];

    for (let i = 0; i < prevFees.length; i++) {
      const fee = prevFees[i].numeraire.isGreaterThan(nextFees[i].numeraire)
        ? prevFees[i].numeraire.minus(nextFees[i].numeraire).negated()
        : nextFees[i].numeraire.minus(prevFees[i].numeraire);
      fees.push(this.shells[shellIx].getAllFormatsFromNumeraire(fee));
    }

    return fees;

  }

  async syncShells(account) {
    account = account ? account : this.account;

    this.account = account;
  }

  async readShell(_shell_) {

    const self = this;

    let derivatives = [];

    const shell = await _shell_.query(this.account);

    const assets = await Promise.all(_shell_.assets.map(async function (_asset_, ix) {

      const asset = await queryAsset(_asset_);

      asset.approveToZero = _asset_.approveToZero;

      asset.utilityTotal = shell.utilitiesTotal[ix];

      asset.utilityOwned = shell.utilitiesOwned[ix];

      asset.liquidityOwned = shell.liquidityOwned[ix];

      asset.derivatives = await Promise.all(_asset_.derivatives.map(queryAsset));

      return asset;

    }));

    for (const asset of assets) {

      derivatives.push(asset);

      derivatives = derivatives.concat(asset.derivatives);

    }

    async function queryAsset(asset) {

      const allowance = await asset.allowance(self.account, _shell_.address);

      const balance = await asset.balanceOf(self.account);

      return {
        allowance: allowance,
        balance: balance,
        icon: asset.icon,
        symbol: asset.symbol,
        decimals: asset.decimals
      };

    }

    return {
      assets,
      derivatives,
      shell
    };

  }

  async sync(account) {


    account = account ? account : this.account;

    this.account = account;

    const shells = [];
    let initPromises = [];
    let assets = [];
    let derivatives = [];

    for (const _shell_ of this.shells) {

      try {

        const shell = await this.readShell(_shell_);

        assets = assets.concat(shell.assets);
        derivatives = derivatives.concat(shell.assets.flatMap(asset => [asset].concat(asset.derivatives)));

        shells.push(shell);

      } catch (e) {
        console.log(e)
      }

    }

    function filter(asset) {
      if (!this.has(asset.icon)) {
        this.add(asset.icon);
        return true;
      } else return false;
    }

    assets = assets.filter(filter, new Set());
    derivatives = derivatives.filter(filter, new Set());

    const farming = new FarmingEngine(this.web3, account, shells);
    initPromises.push(farming.init());
    this.farming = farming;
    if (config.veCMPAddress[chainId]) {
      this.locking = new Locking(this.web3, account);
      initPromises.push(this.locking.init());
    }

    await Promise.all(initPromises);



    this.state = fromJS({
      account,
      shells,
      assets,
      derivatives,
      farming,
      locking: this.locking
    });

    this.setState(this.state);
  }

  async syncShell(ix) {

    this.state = this.state.setIn(
      ['shells', ix],
      await this.readShell(this.shells[ix])
    );

    this.setState(this.state);

  }

  unlock(shellIx, assetIx, amount, onHash, onConfirmation, onError) {

    const tx = this.shells[shellIx].assets[assetIx]
      .approve(this.shells[shellIx].address, amount);

    tx.send({from: this.account})
      .once('transactionHash', onHash)
      .once('confirmation', () => {
        onConfirmation();
        this.sync(this.account);
      })
      .on('error', onError);

  }

  selectiveDeposit(shellIx, addresses, amounts, onHash, onConfirmation, onError) {

    const tx = this.shells[shellIx]
      .selectiveDeposit(
        addresses,
        amounts,
        0,
        Date.now() + 2000
      );

    tx.send({from: this.account})
      .on('transactionHash', onHash)
      .on('confirmation', () => {
        onConfirmation();
        this.sync(this.account);
      })
      .on('error', onError);

  }

  selectiveWithdraw(shellIx, addresses, amounts, onHash, onConfirmation, onError) {

    const limit = this.state.getIn(['shells', shellIx, 'shell', 'shellsOwned', 'raw']);

    const tx = this.shells[shellIx]
      .selectiveWithdraw(
        addresses,
        amounts.map(a => a.raw.integerValue().toFixed()),
        limit.toFixed(),
        Date.now() + 2000
      );

    tx.send({from: this.account})
      .on('transactionHash', onHash)
      .on('confirmation', onConfirmation)
      .on('error', onError);

  }

  proportionalWithdraw(shellIx, amount, onHash, onConfirmation, onError) {

    const tx = this.shells[shellIx].proportionalWithdraw(amount.toFixed(), Date.now() + 2000);

    tx.send({from: this.account})
      .on('transactionHash', onHash)
      .on('confirmation', onConfirmation)
      .on('error', onError);

  }

  async getAPY(addr) {

    let url = 'https://dashboard.shells.exchange/getAPY/' + addr;

    let percentage = 0;

    await fetch(url).then(response => response.text()).then(contents => {
      let data = JSON.parse(contents).data;
      percentage = data[data.length - 1].percentage;
    });

    return percentage;

  }

}
