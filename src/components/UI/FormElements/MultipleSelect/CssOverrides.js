import React from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const DOBPickerTheme = createMuiTheme({
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%'
      }
    },
    MuiOutlinedInput: {
      root: {
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
                    borderWidth: 1.5,
                },
      },
    },
    MuiFormLabel: {
      root: {
          '&$focused': {
              color: '#2196f3'
          }
      }
  },
    MuiCheckbox: {
            colorSecondary: { 
             '&$checked': {
                color: '#2196f3',
                '&:hover': {
                  backgroundColor: 'rgba(33,150,243,0.4)'
              },
              },
            }
    },
    MuiIconButton: {
            colorSecondary: {
              '&:hover': {
                backgroundColor: 'rgba(33,150,243,0.4)'
              }
            }
          },
  },
});

const CssOverrides = (props) => <ThemeProvider theme={DOBPickerTheme}>{props.children}</ThemeProvider>

export default CssOverrides