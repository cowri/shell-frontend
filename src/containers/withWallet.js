import React, { useEffect, useState } from 'react'

import { Map } from 'immutable'

import Web3 from 'web3'
import Onboard from 'bnc-onboard'

import config from "../kovan.ctokens.config.json"

import {
  getAllowances,
  getContracts,
  getShellBalances,
  getLiquidity,
  getWalletBalances,
} from '../utils/web3Utils'
import AppEngine from '../utils/AppEngine'

let web3
let onboard
let engine
let network
let address

const withWallet = (WrappedComponent) => {

  return (props) => {

    const [state, setState] = useState(Map({}))

    const [loggedIn, setLoggedIn] = useState(false)

    const [account, setAccount] = useState()
    const [allowances, setAllowances] = useState({})
    const [balances, setBalances] = useState({})
    const [contracts, setContracts] = useState({})
    const [shell, setShell] = useState({})
    const [liquidity, setLiquidity] = useState({})
    const [walletBalances, setWalletBalances] = useState({})
    const [walletSelected, setWalletSelected] = useState(true)
    const [user, setUser] = useState({})

    const updateAllState = async (_account, _contracts) => {

      const __account = _account ? _account : account

      const __contracts = _contracts ? _contracts : contracts

      const _liquidity = await getLiquidity(__contracts.shell)

      const _balances = await getShellBalances(_liquidity, __contracts.shell, __account)

      const _allowances = await getAllowances(__contracts, __account)

      const _walletBalances = await getWalletBalances(__contracts, __account)

      setAllowances(_allowances)

      setBalances(_balances)

      setWalletBalances(_walletBalances)

      setLiquidity(_liquidity)

    }

    const updateAllowances = async (_contracts, _account) => {

      const allowances = await getAllowances(contracts, account)

      setAllowances(allowances)
      
    }

    const updateLiquidity = async () => {

      const liquidity = await getLiquidity(shell)

      setLiquidity(liquidity)
      
    }

    const updateWalletBalances = async () => {

      const walletBalances = await getWalletBalances(contracts, account)

      setWalletBalances(walletBalances)

    }
    
    const updateBalances = async (_liquidity, _shell, _account) => {

      const balances = await getShellBalances(liquidity, shell, account)

      setBalances(balances)

    }

    const handleEnable = () => {

      return new Promise((resolve, reject) => {

        window.ethereum.enable().then(accounts => {

          setAccount(accounts[0])

          resolve(accounts)

        }).catch(e => reject(e))

      })

    }

    const selectWallet = async () => {
      
        const walletSelected = await onboard.walletSelect();

        if (walletSelected) {

          const walletChecked = await onboard.walletCheck();

          if (!walletChecked) { 

            selectWallet() 

          } else {

            setLoggedIn(true)

          }
          
        } else {
          
          selectWallet()

        }
        
    }

    // init application
    useEffect(() => {
      
      init()
    
      async function init () {

        onboard = Onboard({
          dappId: config.blocknative, // [String] The API key created by step one above
          networkId: config.network, // [Integer] The Ethereum network ID your Dapp uses.
          subscriptions: {
            address: async _address => {
              
              address = _address

              if (!_address) {

                return await selectWallet()

              } else if (network == config.network) {

                engine = engine ? engine : new AppEngine(web3, setState) 

                engine.sync(address)

              }

            },
            network: async _network => {

              network = _network

              if (address && _network == config.network) {

                engine = engine ? engine : new AppEngine(web3, setState) 

                engine.sync(address)

              } else if (_network != config.network) {
                
                onboard.walletCheck()
                
              }


            },
            wallet: async wallet => {
            
              web3 = new Web3(wallet.provider)
             
              network = await web3.eth.net.getId()

              engine = engine ? engine : new AppEngine(web3, setState) 

            },
          },
          walletSelect: {
            wallets: [
              { walletName: "metamask", preferred: true },
              { walletName: "walletConnect", preferred: true, infuraKey: config.defaultWeb3Provider },
            ]
          }
        });
      }

      selectWallet()

    }, [])

    return (
      <>
        <WrappedComponent
          {...props}
          account={account}
          allowances={allowances}
          balances={balances}
          contracts={contracts}
          shell={contracts.shell}
          hasMetamask={!!window.ethereum}
          isUnlocked={!!account}
          onEnable={handleEnable}
          selectWallet={selectWallet}
          updateAllState={() => updateAllState()}
          updateAllowances={() => updateAllowances()}
          updateBalances={() => updateBalances()}
          updateLiquidity={() => updateLiquidity()}
          updateWalletBalances={() => updateWalletBalances()}
          network={network}
          liquidity={liquidity}
          walletBalances={walletBalances}
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