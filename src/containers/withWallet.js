import React, { useEffect, useState } from 'react'

import { Map } from 'immutable'

import Web3 from 'web3'
import Onboard from 'bnc-onboard'

import config from "../config.js"

import Engine from '../utils/Engine'
import {chainId, IS_BSC} from '../constants/chainId.js';

let web3
let onboard
let engine
let network
let address
let syncer

const withWallet = (WrappedComponent) => {

  return (props) => {
    const [state, setState] = useState(Map({}))
    const [loggedIn, setLoggedIn] = useState(false)
    const [walletSelected, setWalletSelected] = useState(true)

    const selectWallet = async (wallet) => {
      const walletSelected = await onboard.walletSelect(wallet);

      const state = onboard.getState()

      console.log(state.network)
      console.log(state.appNetworkId)

      if (state.network !== state.appNetworkId && window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(chainId) }],
          });
        } catch (switchError) {
          console.error(String(switchError))
        }
      }

      if (walletSelected) {
        const walletChecked = await onboard.walletCheck();
        if (walletChecked) setLoggedIn(true)
      }

    }

    const disconnect = async () => {
      onboard.walletReset()
      setLoggedIn(false)
      window.localStorage.removeItem('selectedWallet')
    }

    // init application
    useEffect(() => {

      init()

      async function init () {

        web3 = new Web3(config.defaultWeb3Provider[chainId])
        engine = engine ? engine : engine = new Engine(web3, setState)

        const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')

        if (!previouslySelectedWallet) engine.sync(address || `0x${'0'.repeat(40)}`)

        const onboardInitSettings = {
          dappId: config.blocknative[chainId], // [String] The API key created by step one above
          networkId: chainId, // [Integer] The Ethereum network ID your Dapp uses.
          subscriptions: {
            address: async _address => {

              address = _address

              if (!_address) {

                init()

              } else if (network === chainId) {

                engine = engine ? engine : engine = new Engine(web3, setState)

                engine.sync(address)

                if (!syncer) syncer = setInterval(() => engine.sync(), 7500)

              }

            },
            network: async _network => {

              network = _network

              if (address && _network === chainId) {

                engine = engine ? engine : engine = new Engine(web3, setState)

                engine.sync(address)

                if (!syncer) syncer = setInterval(() => engine.sync(address), 7500)

              }

            },
            wallet: async wallet => {
              if (!wallet.name) return

              window.localStorage.setItem('selectedWallet', wallet.name)
              web3 = new Web3(wallet.provider)
              engine = new Engine(web3, setState)
              engine.wallet = wallet.name

            },
          },
          walletSelect: {
            wallets: [
              { walletName: "metamask", preferred: true },
              { walletName: "walletConnect", preferred: true, infuraKey: config.infuraKey[chainId] },
            ]
          }
        }

        if (IS_BSC) {
          onboardInitSettings.walletSelect.wallets = [
            { walletName: "metamask", preferred: true },
            {
              walletName: "walletConnect",
                preferred: true,
                rpc: { 56: config.defaultWeb3Provider[chainId] },
              bridge: 'https://bridge.walletconnect.org',
            },
          ]
        }

        onboard = Onboard(onboardInitSettings);

        if (previouslySelectedWallet != null) {
          await selectWallet(previouslySelectedWallet)
        }
      }

    }, [])

    return (
      <>
        <WrappedComponent
          {...props}
          hasMetamask={!!window.ethereum}
          selectWallet={selectWallet}
          disconnect={disconnect}
          network={network}
          walletSelected={walletSelected}
          web3={web3}
          engine={engine}
          loggedIn={loggedIn}
          state={state}
        />
      </>
    )
  }
}

export default withWallet
