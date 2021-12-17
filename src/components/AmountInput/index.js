import React from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import TokenIcon from '../TokenIcon';
import {StyledLabelBar, MaxAmount, InputContainer, StyledEndAdornment} from './styled.js';
import Button from '../Button';

export function AmountInput({
  balance,
  isError,
  isAllowanceError,
  icon,
  helperText,
  onChange,
  styles,
  symbol,
  value,
  onUnlock,
  fullWidth = false,
}) {


  const inputStyles = styles || makeStyles({
    inputBase: {
      fontSize: '20px',
      height: '60px',
      paddingLeft: '20px',
    },
    helperText: {
      color: 'red',
      fontSize: '13px',
      marginLeft: '10px',
      position: 'absolute',
      top: '100%',
    }
  })()

  return (
    <>
      <StyledLabelBar fullWidth={fullWidth} style={{ marginTop: '18px', marginBottom: '0px' }} >
        <MaxAmount onClick={() => onChange({value: balance})}>
          Max:
          <span className="number"> {balance} </span>
        </MaxAmount>
      </StyledLabelBar>
      <InputContainer fullWidth={fullWidth}>
        <NumberFormat
          fullWidth
          allowNegative={false}
          customInput={TextField}
          error={isError}
          FormHelperTextProps={{className: inputStyles.helperText}}
          helperText={helperText}
          inputMode={"numeric"}
          min="0"
          onValueChange={ onChange }
          placeholder="0"
          thousandSeparator={true}
          type="text"
          value={value}
          InputProps={{
            className: inputStyles.inputBase,
            style: isError ? { color: 'red' } : null,
            endAdornment: (
              <StyledEndAdornment>
                {isAllowanceError ? (
                  <>
                    <Button
                      small
                      withInput
                      onClick={onUnlock}
                    >
                      Approve
                    </Button>
                  </>
                ) : balance !== value && balance != '0' ? (
                  <Button
                    small
                    withInput
                    onClick={() => onChange({value: balance})}
                  >
                    MAX
                  </Button>
                ) : null}
                {icon && <TokenIcon size='24'> <img alt={symbol} src={icon} /> </TokenIcon>}
                <span>{symbol}</span>
              </StyledEndAdornment>
            ),
          }}
        />
      </InputContainer>
    </>
  )
}
