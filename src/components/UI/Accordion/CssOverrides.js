import React from "react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const AccordionTheme = createMuiTheme({
  overrides: {
    // MuiButton: {
    //   outlinedPrimary: {
        
    //   }
    // },
    MuiButton: {
      root: {
        marginBottom: "10px",
        marginTop: "10px",
        margin: '0 10px'
      },
      startIcon: {
        marginLeft:'0',
        marginRight:'0',
      },
      outlinedPrimary: {
        color: '#2196f3',
        '&:hover':{
          border:'1px solid #1976d2',
          backgroundColor:'rgba(33,150,243,0.4)',
          color: '#1976d2',
        }
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        flexDirection: 'column'
      }
    }
  },
});

const CssOverrides = (props) => <ThemeProvider theme={AccordionTheme}>{props.children}</ThemeProvider>

export default CssOverrides