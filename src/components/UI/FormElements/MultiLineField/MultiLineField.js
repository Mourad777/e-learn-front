import React, {Fragment} from 'react'
import {connect} from "react-redux"
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
// import CssOverrides from './CssOverrides'

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      width: '100%',
      borderRadius:'1px',
      margin:'0 auto 5px',
      // background: 'white',
    },
    textLabel:{
      margin: '0 3px 10px 3px'
    },
    marginTop:{
      marginTop:'5px'
    },
    darkBackground:{
      background:'#424242',
      color:'white'
    },
    lightBackground:{
      background:'white'
    },
  }));
const MultiLineField = ({input, label, meta, options={}, placeholder, textLabel,isDarkTheme}) =>{ 
    const classes = useStyles()
    return (

        <Fragment>
          <div className={[ classes.root, options.marginTop ? classes.marginTop : null].join(' ')}>
              {textLabel ? <div className={classes.textLabel}>{`${label}:`}</div> : null}
              <TextField 
                  className={[classes.textField,isDarkTheme ? classes.darkBackground : classes.lightBackground].join(' ')}
                  autoComplete="off"
                  {...input}
                  rows={options.rows}
                  variant={options.variant}
                  multiline
                  variant="outlined"
                  placeholder={placeholder}
                  InputProps={{
                    readOnly: options.readOnly,
                  }}
                  disabled={options.disabled}
              />
          </div>
        </Fragment>
     
    )
};

const mapStateToProps = (state) => {

  return {
    isDarkTheme:state.common.isDarkTheme,
  }
}

export default connect(mapStateToProps)(MultiLineField);