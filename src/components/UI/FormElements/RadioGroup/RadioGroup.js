import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
 margin: {
  marginBottom: '15px',
 },
 MuiFormLabel:{
    fontSize: '1.2em',
},
errorText:{
  color:'#e91313',
  fontFamily:'Helvetica',
  fontSize:'0.75rem'
},
font:{
  fontSize:'0.7em !important'
}
}));


const RadioButtonsGroup = ({ input, meta={}, options, title, error, row=false}) =>  {
    const classes = useStyles()
    const errorText= meta.touched && (meta.error || error )
    const radioButtons = options.map(option => {
       return (
        <FormControlLabel
          key={option.label}
          {...input}
          value={option.value}
          control={<Radio color={option.color} />}
          label={option.label}
          labelPlacement={option.placement}
          checked={option.checked}
          className={classes.font}
       />
       ) 
    })
    return (
        <div className={classes.margin}>
        <FormControl margin="dense" component="fieldset">
          <FormLabel className={classes.MuiFormLabel}>{title}</FormLabel>
          <RadioGroup row={row} value={input.value} aria-label="gender">
                {radioButtons}
          </RadioGroup>
          <span className={classes.errorText}>{errorText ? meta.error || error : ''} </span>
        </FormControl>
      </div>
    )

};


export default RadioButtonsGroup