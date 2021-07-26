import React, { useEffect, useState } from 'react'

import { Map } from 'immutable'

import Web3 from 'web3'
import Onboard from 'bnc-onboard'

import config from "../mainnet.multiple.config.json"

import Engine from '../utils/Engine'

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
      const params = [{
        "chainId": "0x38", // 56 in decimal
        "chainName": "Binance Smart Chain",
        "rpcUrls": [
          "https://bsc-dataseed.binance.org"
        ],
        "nativeCurrency": {
          "name": "Binance Coin",
          "symbol": "BNB",
          "decimals": 18
        },
        "blockExplorerUrls": [
          "https://bscscan.com"
        ]
      }]

      if (state.network !== state.appNetworkId && window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: '0x38'}],
          });
        } catch (switchError) {
          console.error(String(switchError))
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params,
              });
            } catch (addError) {
              console.error(String(addError))
            }
          }
        }
      }

      if (walletSelected) {
        const walletChecked = await onboard.walletCheck();
        if (walletChecked) setLoggedIn(true)
      }

    }

    const disconnect = async () => {
      try {
        onboard.walletReset()
      } catch (e) { }
      setLoggedIn(false)
      window.localStorage.removeItem('selectedWallet')
    }

    // init application
    useEffect(() => {

      init()

      async function init () {

        web3 = new Web3(process.env.REACT_APP_NODE_RPC_URL)
        engine = engine ? engine : new Engine(web3, setState)
        engine.sync(address || `0x${'0'.repeat(40)}`)

        onboard = Onboard({
          dappId: config.blocknative, // [String] The API key created by step one above
          networkId: config.network, // [Integer] The Ethereum network ID your Dapp uses.
          subscriptions: {
            address: async _address => {

              address = _address

              if (!_address) {

                init()

              } else if (network === config.network) {

                engine = engine ?? new Engine(web3, setState)

                engine.sync(address)

                if (!syncer) syncer = setInterval(() => engine.sync(), 7500)

              }

            },
            network: async _network => {

              network = _network

              if (address && _network === config.network) {

                engine = engine ? engine : new Engine(web3, setState)

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
              {
                walletName: "walletConnect",
                preferred: true,
                rpc: { 56: process.env.REACT_APP_NODE_RPC_URL },
                bridge: 'https://bridge.walletconnect.org',
              },
            ]
          }
        });

        const previouslySelectedWallet = window.localStorage.getItem('selectedWallet')

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
