import React from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
// .MuiInputBase-input-247:focus

const NumberPickerDark = createMuiTheme({
  overrides: {
    PrivateNotchedOutline: {
      legendLabelled: {
        fontSize: '0.65em'
      }
    },
    MuiFormHelperText:{
      root:{
        color:"#e91313"
      }
    },
    MuiInputLabel:{
      formControl:{
        color:'white'
      }
    },
    MuiInputBase:{
      root:{
        color:'white'
      }
    },
    MuiOutlinedInput: {
      notchedOutline: {
        // borderColor:"#2196f3 !important",
        "&:hover":{
          color:"white !important",
        },
        // "&$focused":{
        //   color:"#2196f3 !important",
        // },
      },
      root: {
        // color:'rgba(255, 255, 255, 0.3) !important',
        "&$focused":{
          color:"#2196f3",
        },
        borderRadius: '4px',
        position: 'relative',
        '& $notchedOutline': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: '#2196f3',
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
        },
        '&$focused $notchedOutline': {
          borderColor: '#2196f3',
          borderWidth: 2,
        },
      }
    },
    MuiFormLabel: {
      // color:'rgba(255, 255, 255, 0.3) !important',
      root: {
        '&$focused': {
          color: '#2196f3'
        }
      }
    },
  }
});

const NumberPickerLight = createMuiTheme({
  overrides: {
    PrivateNotchedOutline: {
      legendLabelled: {
        fontSize: '0.65em'
      }
    },
    MuiFormHelperText:{
      root:{
        color:"#e91313"
      }
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '4px',
        position: 'relative',
        '& $notchedOutline': {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        },
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: '#2196f3',
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            borderColor: 'rgba(0, 0, 0, 0.23)',
          },
        },
        '&$focused $notchedOutline': {
          borderColor: '#2196f3',
          borderWidth: 2,
        },
      }
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: '#2196f3'
        }
      }
    },

  }
});

const CssOverrides = ({ isDarkTheme, children }) => <ThemeProvider theme={isDarkTheme ? NumberPickerDark : NumberPickerLight}>{children}</ThemeProvider>

export default CssOverrides