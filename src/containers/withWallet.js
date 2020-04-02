import React, { useEffect, useState } from 'react'

import Web3 from 'web3'

import {
  getContracts,
  getLoihiBalances,
  getReserves,
  getWalletBalances,
} from '../utils/web3Utils'

const withWallet = (WrappedComponent) => {
  return (props) => {
    const [web3, setWeb3] = useState()
    const [account, setAccount] = useState()
    const [balances, setBalances] = useState({})
    const [contracts, setContracts] = useState({})
    const [reserves, setReserves] = useState({})
    const [networkId, setNetworkId] = useState(1)
    const [walletBalances, setWalletBalances] = useState({})

    const fetchBalances = async () => {
      const balances = await getLoihiBalances(account, contracts.loihi, reserves)
      setBalances(balances)
    }

    const fetchReserves = async () => {
      const reserves = await getReserves(contracts.loihi)
      setReserves(reserves)
    }

    const fetchWalletBalances = async () => {
      const walletBalances = await getWalletBalances(account, contracts)
      setWalletBalances(walletBalances)
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

    // init web3, account
    useEffect(() => {
      async function init() {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          const accounts = await web3.eth.getAccounts()
          const networkId = await web3.eth.net.getId()

          setNetworkId(networkId)
          setWeb3(web3)
          setAccount(accounts[0])
        }
      }
      init()
    }, [])

    // init contracts
    useEffect(() => {
      if (web3) {
        const contracts = getContracts(web3)
        setContracts(contracts)
      }
    }, [web3])

    // init reserves
    useEffect(() => {
      if (contracts.loihi) {
        fetchReserves()
      }
    }, [contracts])

    // init balances
    useEffect(() => {
      if (account && reserves.totalReserves) {
        fetchBalances()
        fetchWalletBalances()
      }
    }, [account, reserves])

    return (
      <>
        <WrappedComponent
          {...props}
          account={account}
          balances={balances}
          contracts={contracts}
          hasMetamask={!!window.ethereum}
          isUnlocked={!!account}
          onEnable={handleEnable}
          networkId={networkId}
          reserves={reserves}
          walletBalances={walletBalances}
          web3={web3}
        />
      </>
    )
  }
}

export default withWallet