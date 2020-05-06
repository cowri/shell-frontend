import React, { useEffect, useState } from 'react'

import Web3 from 'web3'

import {
  getAllowances,
  getContracts,
  getLoihiBalances,
  getReserves,
  getWalletBalances,
} from '../utils/web3Utils'

const withWallet = (WrappedComponent) => {
  return (props) => {
    const [web3, setWeb3] = useState()
    const [account, setAccount] = useState()
    const [allowances, setAllowances] = useState({})
    const [balances, setBalances] = useState({})
    const [contracts, setContracts] = useState({})
    const [reserves, setReserves] = useState({})
    const [networkId, setNetworkId] = useState(1)
    const [walletBalances, setWalletBalances] = useState({})

    const fetchAllowances = async (_account, _contracts) => {
      const allowances = await getAllowances(
        _account ? _account : account, 
        _contracts ? _contracts : contracts
      )
      setAllowances(allowances)
    }

    const fetchBalances = async (_account, _loihi, _reserves) => {
      const balances = await getLoihiBalances(
        _account ? _account : account, 
        _loihi ? _loihi : contracts.loihi, 
        _reserves ? _reserves : reserves
      )
      setBalances(balances)
    }

    const fetchReserves = async (_loihi) => {
      const reserves = await getReserves(_loihi ? _loihi : contracts.loihi)
      window.reserves = reserves
      setReserves(reserves)
    }

    const fetchWalletBalances = async (_account, _contracts) => {
      const walletBalances = await getWalletBalances(
        _account ?  _account : account, 
        _contracts ? _contracts : contracts
      )
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
          window.thing = web3
          const accounts = await web3.eth.getAccounts()
          const networkId = await web3.eth.net.getId()

          setNetworkId(networkId)
          setWeb3(web3)
          setAccount(accounts[0])

          window.ethereum.on('accountsChanged', async function () {
            const accounts = await web3.eth.getAccounts()
            setAccount(accounts[0])
            fetchReserves(window.contracts.loihi)
            fetchAllowances(accounts[0], window.contracts)
            fetchBalances(accounts[0], window.contracts.loihi, window.reserves)
            fetchWalletBalances(accounts[0], window.contracts)
          })

        }
      }
      init()
    }, [])

    // init contracts
    useEffect(() => {
      if (web3) {
        const _contracts = getContracts(web3)
        window.contracts = _contracts
        setContracts(_contracts)
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
        fetchAllowances()
        fetchBalances()
        fetchWalletBalances()
      }
    }, [account, reserves])

    return (
      <>
        <WrappedComponent
          {...props}
          account={account}
          allowances={allowances}
          balances={balances}
          contracts={contracts}
          hasMetamask={!!window.ethereum}
          isUnlocked={!!account}
          onEnable={handleEnable}
          onUpdateAllowances={() => fetchAllowances()}
          onUpdateBalances={() => fetchBalances()}
          onUpdateReserves={() => fetchReserves()}
          onUpdateWalletBalances={() => fetchWalletBalances()}
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