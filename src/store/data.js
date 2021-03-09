/* global BigInt */
import _ from 'lodash'
import * as Web3 from 'web3'
import * as axios from 'axios'
import TimeWeightedBalance, { NUMERATOR } from "./TimeWeightedBalance";

import { BehaviorSubject } from 'rxjs'

const isDev = process.env.NODE_ENV === 'development'
const infuraApiKey = isDev ? 'db72eb2275564c62bfa71896870d8975' : '3c3dfdec6ce94abc935977aa995d1a8c'
const etherscanApiKey = isDev ? 'RXHBEC6SBU7UJIR8YFJMVFFJ432U8PAX62' : 'RXHBEC6SBU7UJIR8YFJMVFFJ432U8PAX62'
export const ethWeb3 = new Web3(`wss://mainnet.infura.io/ws/v3/${infuraApiKey}`)
export const xdaiWeb3 = new Web3(`wss://little-wispy-sun.xdai.quiknode.pro/b3fea81156c1abb58de12e3819e9de382216c99c/`)
const animals = ['🦆', '🐱', '🦁', '🦕', '🦍', '🦄', '🐊', '🐸', '🐛', '🐜', '🦐', '🦋', '🪰', '🪱', '🌱', '☃️', '🪨'];

const explorerUrls = {
  eth: 'https://api.etherscan.io/api',
  xdai: 'https://blockscout.com/poa/xdai/api'
}

const dataStore = {
  distribution: new BehaviorSubject([]),
  totalStake: new BehaviorSubject(BigInt(1)),
  error: new BehaviorSubject(null),
  time: new BehaviorSubject(''),
  stage: new BehaviorSubject(''),

  setBalances(balances) {
    dataStore.distribution.next(balances)
  },

  setTime(time) {
    dataStore.time.next(time)
  },

  setTotalStake(amount) {
    dataStore.totalStake.next(amount)
  },

  setError(error) {
    dataStore.error.next(error)
  },

  setStage(stage) {
    dataStore.stage.next(stage)
  },
}

const TRANSFER_HASH = ethWeb3.utils.sha3('Transfer(address,address,uint256)');

const POOLS = {
  '0x49519631b404e06ca79c9c7b0dc91648d86f08db': {
    startedBlock: 11_731_951,
    startedTime: 1611672647,
    createdBlock: 11_717_846,
    chain: 'eth',
  },
  '0x6477960dd932d29518d7e8087d5ea3d11e606068': {
    startedBlock: 11_772_123,
    startedTime: 1612206361,
    createdBlock: 11_759_920,
    chain: 'eth',
  },
  // '0x53De001bbfAe8cEcBbD6245817512F8DBd8EEF18': {
  //     startedBlock: 14_511_611,
  //     startedTime: 1613137575,
  //     createdBlock: 14_498_740,
  //     chain: 'xdai',
  // },
}

const xdaiIncluded = _.values(POOLS).find(({ chain }) => chain === 'xdai')

const ZERO_ADDRESS = '0x' + '0'.repeat(40)
const USER_STATES = new Map()
const STAKING_STARTED_TIMESTAMP = Math.min(..._.values(POOLS).map(({ startedTime }) => startedTime))
const TOTAL_SUPPLY = new TimeWeightedBalance(BigInt(0), STAKING_STARTED_TIMESTAMP);
const INITIAL_SUPPLY_STATES = {}
const INITIAL_USER_STATES = {}

const initialize = () => _.once(async () => {
  console.time('loading time')
  await fetchInitialData();
  await fetchDistributionData();
  dataStore.setTotalStake(TOTAL_SUPPLY.current)
  console.timeEnd('loading time')
  subcribeToEvents()
})()

async function fetchInitialData() {

  for (const poolAddress in POOLS) {
    const pool = POOLS[poolAddress]
    dataStore.setStage(`Fetching initial data for ${poolAddress} on ${pool.chain}`)
    INITIAL_SUPPLY_STATES[poolAddress] = BigInt(0);
    INITIAL_USER_STATES[poolAddress] = new Map();

    const _users = INITIAL_USER_STATES[poolAddress]

    let logs = []

    try {

      let logArray = (await axios.get(
        explorerUrls[pool.chain] +
        '?module=logs&action=getLogs' +
        `&fromBlock=${pool.createdBlock}` +
        `&toBlock=${pool.startedBlock}` +
        `&address=${poolAddress}` +
        `&topic0=${TRANSFER_HASH}` +
        (pool.chain === 'eth' ? `&apikey=${etherscanApiKey}` : '')
      )).data.result

      logs = logArray

      while (logArray.length === 1_000) {

        // let's say we are not missing anything
        const fromBlock = +logs[999].blockNumber + 1

        logArray = (await axios.get(
          explorerUrls[pool.chain] +
          '?module=logs&action=getLogs' +
          `&fromBlock=${fromBlock}` +
          `&toBlock=${pool.startedBlock}` +
          `&address=${poolAddress}` +
          `&topic0=${TRANSFER_HASH}` +
          (pool.chain === 'eth' ? `&apikey=${etherscanApiKey}` : '')
        )).data.result;

        logs = logs.concat(logArray);
      }

    } catch (e) {
      dataStore.setError(`Failed to fetch data for ${poolAddress} on ${POOLS[poolAddress].chain}`)
    }

    logs.forEach(l => {

      const from = `0x${l.topics[1].substr(26)}`
      const to = `0x${l.topics[2].substr(26)}`
      const amount = BigInt(l.data)

      if (from === ZERO_ADDRESS) {

        INITIAL_SUPPLY_STATES[poolAddress] += amount

        const toUserBalance = _users.get(to)
        if (toUserBalance) {
          _users.set(to, toUserBalance + amount)
        } else {
          _users.set(to, amount)
        }

      } else if (to === ZERO_ADDRESS) {

        INITIAL_SUPPLY_STATES[poolAddress] -= amount

        const fromUserBalance = _users.get(from)
        if (fromUserBalance) {
          _users.set(from, fromUserBalance - amount)
        } else {
          throw new Error("from unknown")
        }

      } else {

        const fromUserBalance = _users.get(from)

        if (fromUserBalance) {
          _users.set(from, fromUserBalance - amount)
        } else {
          throw new Error("from unknown")
        }

        const toUserBalance = _users.get(to)
        if (toUserBalance) {
          _users.set(to, toUserBalance + amount)
        } else {
          _users.set(to, amount)
        }

      }

    })
  }

  const initialPoolAddress = _.keys(POOLS)[0]
  TOTAL_SUPPLY._add(INITIAL_SUPPLY_STATES[initialPoolAddress])
  delete INITIAL_SUPPLY_STATES[initialPoolAddress]
  for (const userAddress of Array.from(INITIAL_USER_STATES[initialPoolAddress].keys())) {
    USER_STATES.set(userAddress, new TimeWeightedBalance(INITIAL_USER_STATES[initialPoolAddress].get(userAddress), POOLS[initialPoolAddress].startedTime))
    INITIAL_USER_STATES[initialPoolAddress].delete(userAddress)
  }
  delete INITIAL_USER_STATES[initialPoolAddress]
}

async function fetchDistributionData() {

  const currentBlocks = {
    eth: await ethWeb3.eth.getBlockNumber(),
  }

  if (xdaiIncluded) {
    currentBlocks.xdai = await xdaiWeb3.eth.getBlockNumber()
  }

  const promises = _.keys(POOLS).map(poolAddress =>
    axios.get(explorerUrls[POOLS[poolAddress].chain] +
      '?module=logs&action=getLogs' +
      `&fromBlock=${POOLS[poolAddress].startedBlock}` +
      `&toBlock=${currentBlocks[POOLS[poolAddress].chain]}` +
      `&address=${poolAddress}` +
      `&topic0=${TRANSFER_HASH}`+
      (POOLS[poolAddress].chain === 'eth' ? `&apikey=${etherscanApiKey}`: '')
    ))

  const respArray = []

  for (const promise of promises) {
    const address = _.keys(POOLS)[respArray.length]
    const { chain } = POOLS[address]
    dataStore.setStage(`Fetching distribution data for ${address} on ${chain}`)
    try {
      let resp = (await promise).data.result

      let logs = resp

      while (resp.length === 1_000) {
        // let's say we are not missing anything
        const fromBlock = +resp[999].blockNumber + 1

        resp = (await axios.get(
          explorerUrls[chain] +
          '?module=logs&action=getLogs' +
          `&fromBlock=${fromBlock}` +
          `&toBlock=${currentBlocks[chain]}` +
          `&address=${address}` +
          `&topic0=${TRANSFER_HASH}` +
          (chain === 'eth' ? `&apikey=${etherscanApiKey}` : '')
        )).data.result;

        logs = logs.concat(resp);
      }

      respArray.push(logs)
    } catch (e) {
      dataStore.setError(`Failed to fetch data for ${address} on ${chain}`)
    }
  }

  dataStore.setStage(`Calculating`)

  const logs = _.flatten(respArray)
    .sort((a, b) => {
      if (a.timeStamp > b.timeStamp) {
        return 1
      }
      if (a.timeStamp < b.timeStamp) {
        return -1
      }
      if (a.logIndex > b.logIndex) {
        return 1
      }
      if (a.logIndex < b.logIndex) {
        return -1
      }
      throw new Error("Impossible case: the same logIndex")
    });

  logs.forEach(l => {
    applyLog(l)
  })

  finalize((await ethWeb3.eth.getBlock(currentBlocks.eth)).timestamp)

}

function finalize(endTime) {

  const balances = calculateDistribution(endTime)

  dataStore.setBalances(
    balances.map(
      (d, i) => ({
        ...d,
        id: animals[i] ?? i + 1,
      })
    )
  )

  dataStore.setTime(endTime)

}

function calculateDistribution(endTime) {

  const proportionTimeTotal = BigInt(endTime - STAKING_STARTED_TIMESTAMP) * NUMERATOR

  const supply = TOTAL_SUPPLY.current

  return Array.from(USER_STATES.entries()).map(([addr, bal]) => ({
    address: addr,
    currentStake: bal.current,
    distributionPercent: (Number(bal.finalize(endTime, supply) * BigInt(1_000_000) / proportionTimeTotal) / 10000),
  })).sort(({ distributionPercent: a }, { distributionPercent: b }) => {
    if (a < b) return 1
    if (a > b) return -1
    return 0
  })
}

function applyLog(log) {
  const from = `0x${log.topics[1].substr(26)}`
  const to = `0x${log.topics[2].substr(26)}`
  const amount = BigInt(log.data)
  const now = log.timeStamp

  for (const uninitializedPoolAddress in INITIAL_SUPPLY_STATES) {

    const { startedTime } = POOLS[uninitializedPoolAddress]

    if (now > startedTime) {

      const prevSupply = TOTAL_SUPPLY.current

      // apply pool initial state
      mint(INITIAL_SUPPLY_STATES[uninitializedPoolAddress], startedTime)

      const excludeAddresses = []

      for (const userAddress of Array.from(INITIAL_USER_STATES[uninitializedPoolAddress].keys())) {
        const amount = INITIAL_USER_STATES[uninitializedPoolAddress].get(userAddress)
        const toUser = USER_STATES.get(userAddress)
        if (toUser) {
          toUser.add(amount, now, prevSupply)
        } else {
          USER_STATES.set(userAddress, new TimeWeightedBalance(amount, startedTime))
        }
        INITIAL_USER_STATES[uninitializedPoolAddress].delete(userAddress)
        excludeAddresses.push(userAddress)
      }

      delete INITIAL_SUPPLY_STATES[uninitializedPoolAddress]
      delete INITIAL_USER_STATES[uninitializedPoolAddress]
      rebalance(prevSupply, startedTime, excludeAddresses)
    }

  }

  const prevSupply = TOTAL_SUPPLY.current

  if (from === ZERO_ADDRESS) {

    mint(amount, now)

    const toUser = USER_STATES.get(to)
    if (toUser) {
      toUser.add(amount, now, prevSupply)
    } else {
      USER_STATES.set(to, new TimeWeightedBalance(amount, now))
    }

    rebalance(prevSupply, now, [to])

  } else if (to === ZERO_ADDRESS) {

    burn(amount, now)

    const fromUser = USER_STATES.get(from)
    if (fromUser) {
      fromUser.sub(amount, now, prevSupply)
    } else {
      throw new Error("from unknown")
    }

    rebalance(prevSupply, now, [from])

  } else {

    const fromUser = USER_STATES.get(from)
    if (fromUser) {
      fromUser.sub(amount, now, prevSupply)
    } else {
      throw new Error("from unknown")
    }

    const toUser = USER_STATES.get(to)
    if (toUser) {
      toUser.add(amount, now, prevSupply)
    } else {
      USER_STATES.set(to, new TimeWeightedBalance(amount, now))
    }

  }

}

function rebalance(supply, now, excludedAddr) {
  Array.from(USER_STATES.keys()).forEach(addr => {
    if (excludedAddr.includes(addr)) return
    const userState = USER_STATES.get(addr)
    userState._update(supply, now)
  })
}

function burn(amount, now) {
  TOTAL_SUPPLY._sub(amount, now)
  if (dataStore.distribution.getValue().length)
    dataStore.setTotalStake(TOTAL_SUPPLY.current)
}

function mint(amount, now) {
  TOTAL_SUPPLY._add(amount, now)
  if (dataStore.distribution.getValue().length)
    dataStore.setTotalStake(TOTAL_SUPPLY.current)
}

initialize()

function subcribeToEvents() {
  ethWeb3.eth.subscribe("newBlockHeaders", (error, event) => {
    if (!error) {
      finalize(event.timestamp)
    }
  })
  if (xdaiIncluded) {
    xdaiWeb3.eth.subscribe("newBlockHeaders", (error, event) => {
      if (!error) {
        finalize(event.timestamp)
      }
    })
  }
  _.keys(POOLS).forEach(poolAddress => {
    const web3 = POOLS[poolAddress].chain === 'eth' ? ethWeb3 : xdaiWeb3
    web3.eth.subscribe('logs', {
      address: poolAddress,
      topics: [TRANSFER_HASH]
    }, async (error, log ) => {
      if (!error) {
        const block = await web3.eth.getBlock(log.blockNumber)
        log.time = block.timestamp
        applyLog(log)
        finalize(block.timestamp)
      }
    })
  })
}


export default dataStore
