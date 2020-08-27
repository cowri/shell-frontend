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

const withWallet = (WrappedComponent) => {
  return (props) => {
    const [web3, setWeb3] = useState()
    const [account, setAccount] = useState()
    const [allowances, setAllowances] = useState({})
    const [balances, setBalances] = useState({})
    const [contracts, setContracts] = useState({})
    const [loihi, setLoihi] = useState({})
    const [liquidity, setLiquidity] = useState({})
    const [networkId, setNetworkId] = useState(1)
    const [walletBalances, setWalletBalances] = useState({})

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

    // init application
    useEffect(async () => {

      console.log("wtf")
              
      const onboard = Onboard({
        dappId: config.blocknative,       // [String] The API key created by step one above
        networkId: config.network, // [Integer] The Ethereum network ID your Dapp uses.
        subscriptions: {
          wallet: async wallet => {
          
            const web3 = new Web3(wallet.provider)
           
            const accounts = await web3.eth.getAccounts()
            const networkId = await web3.eth.net.getId()

            setWeb3(web3)
            setNetworkId(networkId)
            setAccount(accounts[0])
            
            const _contracts = getContracts(web3)

            window.contracts = _contracts

            const _liquidity = await getLiquidity(_contracts.loihi)
            const _allowances = await getAllowances(_contracts, accounts[0])
            const _walletBalances = await getWalletBalances(_contracts, accounts[0])
            const _balances = await getLoihiBalances(_liquidity, _contracts.loihi, accounts[0])
            
            setContracts(_contracts)
            setLoihi(_contracts.loihi)
            setLiquidity(_liquidity)
            setAllowances(_allowances)
            setWalletBalances(_walletBalances)
            setBalances(_balances)
            
            window.ethereum.on('accountsChanged', async function () {

              let _accounts = await web3.eth.getAccounts()

              setAccount(_accounts[0])

              updateAllState(_accounts[0], window.contracts)

            })
          },
        },
        walletSelect: {
          wallets: [
            { walletName: "metamask", preferred: true },
            { walletName: "walletConnect", preferred: true, infuraKey: config.defaultWeb3Provider },
          ]
        }
      });

      await onboard.walletSelect();
      
      await onboard.walletCheck();

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
          updateAllState={() => updateAllState()}
          updateAllowances={() => updateAllowances()}
          updateBalances={() => updateBalances()}
          updateLiquidity={() => updateLiquidity()}
          updateWalletBalances={() => updateWalletBalances()}
          networkId={networkId}
          liquidity={liquidity}
          walletBalances={walletBalances}
          web3={web3}
        />
      </>
    )
  }
}

export default withWallet