import React, { useEffect, useState } from 'react'

import Web3 from 'web3'
import Onboard from 'bnc-onboard'

import config from "../kovan.config.json"

import {
  getAllowances,
  getContracts,
  getLoihiBalances,
  getLiquidity,
  getWalletBalances,
} from '../utils/web3Utils'

let web3
let onboard

const withWallet = (WrappedComponent) => {
  return (props) => {
    const [account, setAccount] = useState()
    const [allowances, setAllowances] = useState({})
    const [balances, setBalances] = useState({})
    const [contracts, setContracts] = useState({})
    const [loihi, setLoihi] = useState({})
    const [liquidity, setLiquidity] = useState({})
    const [networkId, setNetworkId] = useState(1)
    const [walletBalances, setWalletBalances] = useState({})
    const [walletSelected, setWalletSelected] = useState(true)

    const updateAllState = async (_account, _contracts) => {

      const __account = _account ? _account : account

      const __contracts = _contracts ? _contracts : contracts

      const _liquidity = await getLiquidity(__contracts.loihi)

      const _balances = await getLoihiBalances(_liquidity, __contracts.loihi, __account)

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

      const liquidity = await getLiquidity(loihi)

      setLiquidity(liquidity)
      
    }

    const updateWalletBalances = async () => {

      const walletBalances = await getWalletBalances(contracts, account)

      setWalletBalances(walletBalances)

    }
    
    const updateBalances = async (_liquidity, _loihi, _account) => {

      const balances = await getLoihiBalances(liquidity, loihi, account)

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

        setWalletSelected(true)

        const walletSelected = await onboard.walletSelect()

        if (!walletSelected) return setWalletSelected(false)

        const walletChecked = await onboard.walletCheck()

        if (!walletChecked) return setWalletSelected(false)

    }

    // init application
    useEffect(() => {
      
      init()
    
      async function init () {

        onboard = Onboard({
          dappId: config.blocknative,       // [String] The API key created by step one above
          networkId: config.network, // [Integer] The Ethereum network ID your Dapp uses.
          subscriptions: {
            address: async function (address){

              if (!address) {

                return selectWallet()

              } else {

                setAccount(address)
                
                const _contracts = getContracts(web3)

                window.contracts = _contracts

                const _liquidity = await getLiquidity(_contracts.loihi)
                const _allowances = await getAllowances(_contracts, address)
                const _walletBalances = await getWalletBalances(_contracts, address)
                const _balances = await getLoihiBalances(_liquidity, _contracts.loihi, address)
                
                setContracts(_contracts)
                setLoihi(_contracts.loihi)
                setLiquidity(_liquidity)
                setAllowances(_allowances)
                setWalletBalances(_walletBalances)
                setBalances(_balances)
                
              }

            },
            wallet: async wallet => {
            
              web3 = new Web3(wallet.provider)
             
              const networkId = await web3.eth.net.getId()

              setNetworkId(networkId)
              
              const accounts = await web3.eth.getAccounts()

            },
          },
          walletSelect: {
            wallets: [
              { walletName: "metamask", preferred: true },
              { walletName: "walletConnect", preferred: true, infuraKey: config.defaultWeb3Provider },
            ]
          }
        });


        const walletSelected = await onboard.walletSelect();

        if (!walletSelected) return setWalletSelected(false)
        
        const walletChecked = await onboard.walletCheck();

        if (!walletChecked) return setWalletSelected(false)

      }


    }, [])

    return (
      <>
        <WrappedComponent
          {...props}
          account={account}
          allowances={allowances}
          balances={balances}
          contracts={contracts}
          loihi={contracts.loihi}
          hasMetamask={!!window.ethereum}
          isUnlocked={!!account}
          onEnable={handleEnable}
          selectWallet={selectWallet}
          updateAllState={() => updateAllState()}
          updateAllowances={() => updateAllowances()}
          updateBalances={() => updateBalances()}
          updateLiquidity={() => updateLiquidity()}
          updateWalletBalances={() => updateWalletBalances()}
          networkId={networkId}
          liquidity={liquidity}
          walletBalances={walletBalances}
          walletSelected={walletSelected}
          web3={web3}
        />
      </>
    )
  }
}

export default withWallet