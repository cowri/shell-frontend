import React from 'react'
import { createStore } from '@spyna/react-store'
import Web3 from 'web3'

import { WadDecimal, SixDecimal, EightDecimal } from './utils/web3Utils'

import config from './mainnet.config.json'

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
    daiBalance: '',
    daiAllowance: '',
    daiBalanceDecimal: new WadDecimal(0),
    allowanceAvailable: false,
    chaiBalance: '',
    chaiBalanceRaw: '',
    chaiBalanceDecimal: new WadDecimal(0),
    dsrRaw: '',
    dsr: '',
    chi: '',
    chiRaw:'',
    chaiTotalSupply:'',
    joinAmount: new WadDecimal(0),
    exitAmount: new WadDecimal(0),
    joinexitAction: 0,
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
