import React from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const CardTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main:'#FF4136'
    }
  },
  // .MuiLinearProgress-colorPrimary
  //.MuiLinearProgress-barColorPrimary
  overrides: {
    MuiLinearProgress: {
          colorPrimary: {
            backgroundColor: '#ff8a80'
          },
          barColorPrimary:{
            backgroundColor: '#d32f2f'
          }
        },

  },
});

const CssOverrides = (props) => <ThemeProvider theme={CardTheme}>{props.children}</ThemeProvider>

export default CssOverrides