import React, { useEffect, useState } from 'react'

import Web3 from 'web3'

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

    const updateAllState = async () => {
      const _allowances = await getAllowances(contracts, account)
      const _liquidity = await getLiquidity(loihi)
      const _walletBalances = await getWalletBalances(contracts, account)
      const _balances = await getLoihiBalances(_liquidity, loihi, account)

      setAllowances(_allowances)
      setBalances(_balances)
      setWalletBalances(_walletBalances)
      setLiquidity(_liquidity)

    }

    const updateAllowances = async (_contracts, _account) => {
      const allowances = await getAllowances(contracts, account)
      window.allowances = allowances
      setAllowances(allowances)
    }

    const updateLiquidity = async () => {
      const liquidity = await getLiquidity(loihi)
      window.liquidity = liquidity
      setLiquidity(liquidity)
    }

    const updateWalletBalances = async () => {
      const walletBalances = await getWalletBalances(contracts, account)
      window.walletBalances = walletBalances
      setWalletBalances(walletBalances)
    }
    
    const updateBalances = async (_liquidity, _loihi, _account) => {
      const balances = await getLoihiBalances(liquidity, loihi, account)
      console.log("set balances", balances)
      window.balances = balances
      setBalances(balances)
    }

    const handleEnable = () => {
      return new Promise((resolve, reject) => {
        window.ethereum.enable()
          .then(accounts => {
            setAccount(accounts[0])
            resolve(accounts)
          })
          .catch(e => reject(e))
      })
    }

    // init application
    useEffect(() => {

      (async function init() {

        const web3 = new Web3(window.ethereum)
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

          const accounts = await web3.eth.getAccounts()
          setAccount(accounts[0])
          updateLiquidity()
          updateAllowances()
          updateBalances()
          updateWalletBalances()

        })
          
      })()

    }, [])

    // useEffect(() => {
    //   console.log("ping liq")
    //   if (loihi) {
    //     console.log("loihi", loihi)
    //     updateLiquidity(loihi)
    //   }
    // }, [loihi])

    // // init liquidity, allowances, balances, wallet balances
    // useEffect(() => {
    //   if (account && liquidity) {
    //     updateAllowances()
    //     updateBalances()
    //     updateWalletBalances()
    //   }
    // }, [liquidity])

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