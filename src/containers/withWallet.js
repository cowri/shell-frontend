import React, { useEffect, useState } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { Map } from 'immutable'

import Web3 from 'web3'
import Web3Modal from 'web3modal'

import config from "../config.js"

import Engine from '../utils/Engine'
import {chainId, IS_BSC, IS_ETH, IS_FTM, IS_XDAI} from '../constants/chainId.js';
import isMobile from '../utils/isMobile.js';

const params = {
  56: [{
    chainId: "0x38", // 56 in decimal
    chainName: "Binance Smart Chain",
    rpcUrls: [
      "https://bsc-dataseed.binance.org"
    ],
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18
    },
    blockExplorerUrls: [
      "https://bscscan.com"
    ]
  }],
  100: [{
    chainId: "0x64", // 100 in decimal
    chainName: "xDai",
    rpcUrls: [
      "https://rpc.xdaichain.com/"
    ],
    nativeCurrency: {
      name: "xDai",
      symbol: "xDai",
      decimals: 18
    },
    blockExplorerUrls: [
      "https://blockscout.com/xdai/mainnet"
    ]
  }],
  250: [
    {
      chainId: '0xfa', // 56 in decimal
      chainName: 'Fantom Opera',
      rpcUrls: ['https://rpc.ftm.tools/'],
      nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18,
      },
      blockExplorerUrls: ['https://ftmscan.com/'],
    },
  ]
}[chainId]

let web3
let engine
let network
let address
let web3Modal
let provider

const withWallet = (WrappedComponent) => {

  return (props) => {
    const [state, setState] = useState(Map({}))
    const [loggedIn, setLoggedIn] = useState(false)

    const onConnect = async () => {
      console.log('onConnect')
      try {
        if (isMobile() && (window.ethereum || window.web3)) {
          if (window.ethereum) {
            try {
              await window.ethereum.send('eth_requestAccounts')
            } catch (e) {
              console.log(e)
            }
            provider = window.ethereum
          } else if (window.web3) provider = window.web3.currentProvider
        } else {
          provider = await web3Modal.connect();
          web3 = new Web3(provider);

          const currentChainId = await web3.eth.getChainId()

          if (currentChainId !== chainId && window.ethereum) {
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: Web3.utils.toHex(chainId) }],
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
        }
      } catch(e) {
        console.log("Could not get a wallet connection", e);
        return;
      }

      // Subscribe to accounts change
      provider.on('accountsChanged', (accounts) => {
        fetchAccountData();
      });

      // Subscribe to chainId change
      provider.on('chainChanged', (chainId) => {
        fetchAccountData();
      });

      // Subscribe to networkId change
      provider.on('networkChanged', (networkId) => {
        fetchAccountData();
      });

      await fetchAccountData();
      setLoggedIn(true)
    }

    async function fetchAccountData() {
      const accounts = await web3.eth.getAccounts();
      address = accounts[0]
      engine = engine ? engine : engine = new Engine(web3, setState)
      await engine.sync(address || `0x${'0'.repeat(40)}`)
      if (provider) {
        if (provider.isMetaMask) engine.wallet = 'MetaMask'
        else engine.wallet = 'WalletConnect'
      }
    }

    const disconnect = async () => {
      try {
        if (provider.close) provider.close()
        if (provider.disconnect) provider.disconnect()
        web3Modal.clearCachedProvider()
        provider = undefined
      } catch (e) { }
      setLoggedIn(false)
      address = undefined
      init()
    }

    async function initWeb3Modal() {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {},
        },
      }

      if (IS_ETH) {
        providerOptions.walletconnect.options = {
          infuraId: config.infuraId,
        }
      } else if (IS_BSC) {
        providerOptions.walletconnect.options = {
          rpc: {
            56: config.defaultWeb3Provider,
          },
        }
      } else if (IS_XDAI) {
        providerOptions.walletconnect.options = {
          rpc: {
            100: config.defaultWeb3Provider,
          },
        }
      } else if (IS_FTM) {
        providerOptions.walletconnect.options = {
          rpc: {
            250: config.defaultWeb3Provider,
          },
        }
      }

      web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions // required
      })

      web3 = new Web3(config.defaultWeb3Provider)
      engine = engine ? engine : engine = new Engine(web3, setState)
      await engine.sync(address || `0x${'0'.repeat(40)}`)

      if (web3Modal.cachedProvider) await onConnect()
    }

    async function init () {
      await initWeb3Modal();
    }

    // init application
    useEffect(() => {
      init()
    }, [])

    return (
      <>
        <WrappedComponent
          {...props}
          hasMetamask={!!window.ethereum}
          selectWallet={onConnect}
          disconnect={disconnect}
          network={network}
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
