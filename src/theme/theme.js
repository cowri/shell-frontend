import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

export default createMuiTheme({
    palette: {
        primary: {
            light: '#fff',
            main: '#fff',
            dark: '#fff',
            contrastText: '#000',
        },
        secondary: grey,
    },
    overrides: {
        // Style sheet name ⚛️
        // MuiButton: {
        //   // Name of the rule
        //   text: {
        //     // Some CSS
        //     color: 'white',
        //   },
        // }
        MuiTypography: {
            body1: { color: '#EBEBEB !important' }
        },
        PrivateNotchedOutline: {
            root: {
            }
        },
        // '.MuiOutlinedInput-root:hover':{
        //     borderColor: '#EBEBEB !important'
        // },
        MuiInputAdornment: {
            root: { color: '#EBEBEB !important' },
            positionEnd: { color: '#EBEBEB !important' }
        },
        MuiFormHelperText: {
            root: {
                color: '#EBEBEB !important',
            }
        },
        MuiFormLabel: {
            root: {
                color: '#EBEBEB !important',
            }
        },
        MuiInput: {
            root: {
                fontSize: '100px'
            }
        },
        MuiOutlinedInput: {
            root:{
            //     '&:hover': {
            //         // notchedOutline: {
            //             borderColor: '#EBEBEB'
            //         // }
            //     }
                color: '#EBEBEB !important',
                height: '70px',
                fontSize: '27.5px',
                fontWeight: 100
            },
            notchedOutline: {
                display: 'none',
                borderColor: '#EBEBEB !important',
                borderWidth: '1px !important'
            }
        },
        MuiTextField: {
            root: {
            }

        },
        MuiToggleButtonGroup: {
          grouped: {
            '&:not(:first-child)': {
              borderLeft: '1px solid #EBEBEB'
            }
          }
        },
        // .MuiToggleButtonGroup-grouped:not(:first-child)
        MuiToggleButton: {
            root: {
                border: '1px solid #EBEBEB',
                backgroundColor: '#fff',
                '&.Mui-selected': {
                    // back
                    backgroundColor: '#fff !important',
                    color: '#000',
                    fontWeight: '500',
                    '&:hover': {
                        backgroundColor: '#fff !important',
                    }
                },
                '&:hover': {
                    backgroundColor: '#fff !important',
                }
            }
        }
    }
});
