import React from 'react';
import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { WadDecimal, getData, toDai } from '../utils/web3Utils'
import { transfer } from '../actions/main'

import NumeraireDaiBalance from './NumeraireDaiBalance'
import NumeraireUsdcBalance from './NumeraireUsdcBalance'
import NumeraireUsdtBalance from './NumeraireUsdtBalance'
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = () => ({
   input: {
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    actionButton: {
        marginTop: theme.spacing(2),
        margin: '0px auto'
    },
    actionButtonContainer: {
        width: '100%',
        textAlign: 'center'
    },
    accountBalance: {
        float: 'right',
    },
})

class StatsContainer extends React.Component {
    async componentDidMount() {
        // update data periodically
        this.watchData()

    }

    async watchData() {
        await getData.bind(this)();
        setInterval(() => {
            getData.bind(this)();
        }, 10 * 1000);
    }

    transfer() {
        transfer.bind(this)()
    }

    handleInput(event) {
      const {store} = this.props
      try {
        store.set('transferAmount', new WadDecimal(event.target.value))
      } catch {
        if (event.target.value.length === 0) {
          store.set('transferAmount', new WadDecimal(0))
        } else {
          return
        }
      }
    }

    render() {
        const {classes, store} = this.props

        return (
            <Grid container spacing={3}>
               <Grid item xs={12}>
                    <Card>
                        <NumeraireDaiBalance/>
                        <NumeraireUsdcBalance/>
                        <NumeraireUsdtBalance/>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(StatsContainer))
