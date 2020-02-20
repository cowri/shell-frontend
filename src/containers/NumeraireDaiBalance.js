import React from 'react';

import {withStore} from '@spyna/react-store'
import {withStyles} from '@material-ui/styles';
import theme from '../theme/theme'
import { getData } from '../utils/web3Utils'
import cdaiSvg from '../assets/cdai.svg'

import Grid from '@material-ui/core/Grid';

const styles = () => ({
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    minHeight: 52,
    color: 'white' 
  },
  icon: { width: '50px', height: '50px' }
})

class NumeraireDaiBalance extends React.Component {

    async componentDidMount() {
        this.watchBalance()
    }

    async watchBalance() {
        await getData.bind(this)();
        setInterval(() => {
            getData.bind(this)();
        }, 10 * 1000);
    }

    render() {
        const { classes, store } = this.props
        const daiBalance = store.get('daiReserve')
        return (
            <Grid container direction='row' className={classes.container} item >
                <Grid item sm='3' xs='3'>
                    <img className={classes.icon} src={cdaiSvg} /> 
                </Grid>
                <Grid item sm='7'>
                    <span> Compound Dai </span> 
                </Grid>
                <Grid item sm='2'>
                    <span> { daiBalance } </span>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(withStore(NumeraireDaiBalance))
