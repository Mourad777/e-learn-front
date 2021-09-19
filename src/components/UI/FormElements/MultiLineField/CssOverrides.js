import React from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const MultilineInputTheme = createMuiTheme({
  overrides: {
    // MuiOutlinedInput: {
    //   root: {
    //     borderRadius: '2px',
    //     position: 'relative',
    //     '& $notchedOutline': {
    //         borderColor: 'rgba(0, 0, 0, 0.23)',
    //     },
    //     '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
    //         borderColor: '#2196f3',
    //         // Reset on touch devices, it doesn't add specificity
    //         '@media (hover: none)': {
    //             borderColor: 'rgba(0, 0, 0, 0.23)',
    //         },
    //     },
    //     '&$focused $notchedOutline': {
    //         borderColor: '#2196f3',
    //         borderWidth: 1.5,
    //     },
    //   }
    // }
  }
});

const CssOverrides = (props) => <ThemeProvider theme={MultilineInputTheme}>{props.children}</ThemeProvider>

// export default CssOverrides