import React from 'react'
import {withStore} from '@spyna/react-store'

import NavContainer from './Nav'
import StatsContainer from './Stats'
import TradeContainer from './Trade'
import DepositContainer from './Deposit'
import WithdrawContainer from './Withdraw'
import MenuContainer from "./Menu"
import LoginStateContainer from "./LoginState"
import FooterContainer from "./Footer"

import theme from '../theme/theme'

import { withStyles } from '@material-ui/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

const styles = () => ({
  root: { flexGrow: 1, },
  footer: { textAlign: 'center', color: '#fff', },
  a: { color: '#fff', opacity: 0.9 },
  navContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    minHeight: 52
  },
  contentContainer: {
      // boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.05)',
      borderRadius: theme.shape.borderRadius,
      padding: 0,
      marginBottom: theme.spacing(3)
  },
  grid: { color: 'white' }
})

class AppContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = { }
        this.views =[ StatsContainer, TradeContainer, DepositContainer, WithdrawContainer ];
    }

    async componentDidMount() { }

    render() {
        const { store, classes } = this.props
        const viewState = store.get('viewState')

        function injectView (index) {
            if (viewState === 0) return <StatsContainer/>
            else if (viewState === 1) return <TradeContainer/>
            else if (viewState === 2) return <DepositContainer/>
            else if (viewState === 3) return <WithdrawContainer/>
        }

        return (
            <Container maxWidth="xs">
                <LoginStateContainer /> 
                <Grid container >
                    <NavContainer />
                    <MenuContainer />
                    <Grid item xs={12} className={classes.grid}>
                        { injectView(viewState) }
                    </Grid>
                </Grid>
                <FooterContainer />
            </Container>
        )
    }
}

export default withStyles(styles)(withStore(AppContainer))
