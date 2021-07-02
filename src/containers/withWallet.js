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

    const selectWallet = async () => {
        const walletSelected = await onboard.walletSelect();

        if (walletSelected) {
          const walletChecked = await onboard.walletCheck();
          if (walletChecked) setLoggedIn(true)
        }

    }

    const disconnect = async () => {
      onboard.walletReset()
      setLoggedIn(false)
    }

    // init application
    useEffect(() => {

      init()

      async function init () {

        web3 = new Web3('https://mainnet.infura.io/v3/db72eb2275564c62bfa71896870d8975')
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

                engine = engine ? engine : new Engine(web3, setState)

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

              web3 = new Web3(wallet.provider)
              engine = new Engine(web3, setState)
              engine.wallet = wallet.name

            },
          },
          walletSelect: {
            wallets: [
              { walletName: "metamask", preferred: true },
              { walletName: "walletConnect", preferred: true, infuraKey: config.infuraKey },
            ]
          }
        });
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
