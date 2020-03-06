import React from 'react'
import { createStore } from '@spyna/react-store'
import Web3 from 'web3'

import { WadDecimal, SixDecimal, EightDecimal } from './utils/web3Utils'

import config from './kovan.config.json'

import AppContainer from './containers/AppContainer'

import theme from './theme/theme'

import { withStyles, ThemeProvider } from '@material-ui/styles'

const styles = () => ({ })

const web3 = new Web3(new Web3.providers.HttpProvider(config.defaultWeb3Provider))

const initialState = {
    web3: web3,
    web3Failure: false,
    network: 1,
    walletAddress: '',
    walletConnecting: false,
    walletType: '',
    daiReserveDecimal: new WadDecimal(0),
    usdcReserveDecimal: new WadDecimal(0),
    usdtReserveDecimal: new WadDecimal(0),
    susdReserveDecimal: new WadDecimal(0),
    totalReserveDecimal: new WadDecimal(0),
    totalShellsDecimal: new WadDecimal(0),
    shellBalanceDecimal: new WadDecimal(0),
    daiReserveRaw: 0,
    usdcReserveRaw: 0,
    usdtReserveRaw: 0,
    susdReserveRaw: 0,
    totalReserveRaw: 0,
    totalShellsRaw: 0,
    daiReserve: '0',
    usdcReserve: '0',
    usdtReserve: '0',
    susdReserve: '0',
    totalReserve: '0',
    totalShells: '0',
    shellBalance: new WadDecimal(0),
    transferAmount: new WadDecimal(0),
    daiDepositAmount: new WadDecimal(0),
    chaiDepositAmount: new WadDecimal(0),
    cdaiDepositAmount: new EightDecimal(0),
    usdcDepositAmount: new SixDecimal(0),
    cusdcDepositAmount: new EightDecimal(0),
    usdtDepositAmount: new SixDecimal(0),
    susdDepositAmount: new SixDecimal(0),
    viewState: 0,
    originSlot:0,
    targetSlot: 1
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }
    }

    async componentDidMount() { }

    render() {
        return (
            <ThemeProvider theme={theme}>
              <AppContainer />
            </ThemeProvider>
        )
    }
}

export default createStore(withStyles(styles)(App), initialState)
