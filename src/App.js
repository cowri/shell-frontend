import React from 'react'
import { createStore } from '@spyna/react-store'
import Web3 from 'web3'

import { WadDecimal, SixDecimal, EightDecimal } from './utils/web3Utils'

import config from './config.json'
import daiABI from './abi/Dai.abi.json'
import potABI from './abi/Pot.abi.json'
import chaiABI from './abi/Chai.abi.json'
import ctokenABI from './abi/CToken.abi.json'
import erc20ABI from './abi/ERC20.abi.json'
import loihiABI from './abi/Loihi.abi.json'

import AppContainer from './containers/AppContainer'

import theme from './theme/theme'

import { withStyles, ThemeProvider } from '@material-ui/styles'

const styles = () => ({ })

const web3 = new Web3(new Web3.providers.HttpProvider(config.defaultWeb3Provider))

const initialState = {
    web3: web3,
    web3Failure: false,
    network: 42,
    walletAddress: '',
    walletConnecting: false,
    walletType: '',
    daiBalance: '',
    daiAllowance: '',
    daiBalanceDecimal: new WadDecimal(0),
    allowanceAvailable: false,
    daiDepositAmount: new WadDecimal(0),
    chaiDepositAmount: new WadDecimal(0),
    usdtDepositAmount: new SixDecimal(0),
    usdcDepositAmount: new SixDecimal(0),
    cdaiDepositAmount: new EightDecimal(0),
    cusdcDepositAmount: new EightDecimal(0),
    viewState: 0
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
