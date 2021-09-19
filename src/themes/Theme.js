import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#2196f3",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      main: '#FF4136'
    },
    // success:{
    //   main:"#3D9970"
    // },
    success: {
      main: "#4caf50"
    }
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiButton: {
      variant: "outlined",
      size: "small"
    }
  },
  overrides: {
    MuiGrid:{
      root:{
        backgroundColor:'#fff'
      }
    },
    //lazy loading causes the tab indicator to dissapear on initial load
    //so i removed it completeley
    PrivateTabIndicator: {
      colorPrimary: {
        backgroundColor: "#fff"
      }
    },
    MuiCheckbox: {
      colorSecondary: {
        '&$checked': {
          color: '#2196f3',
          '&:hover': {
            backgroundColor: 'rgb(33, 150, 243,0.4)',
          },
        },
      },
    },
    MuiIconButton: {
      colorSecondary: {
        '&:hover': {
          backgroundColor: 'rgb(33, 150, 243,0.4)',
        },
      },
    },
    MuiFormHelperText: {
      root: {
        color: '#e91313'
      }
    },
    MuiTabs: {
      centered: {
        justifyContent: "space-evenly",
      },
    },
    MuiSvgIcon: {
      root: {
        colorPrimary: '#2196f3 !important'
      }
    },


    MuiAppBar: {
      root: {
        zIndex: 1,
      },
    },
    MuiCard: {
      root: {
        overflow: "none",
      },
    },
    MuiDrawer: {
      paper: {
        zIndex: "100",
      },
    },
    MuiButton: {
      root: {
        marginBottom: "10px",
        marginTop: "10px",
        backgroundColor: "white",
      },
      outlinedPrimary: {
        border: '1px solid #2196f3'
      },
      startIcon: {
        marginLeft: "0",
        marginRight: "0",
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: "8px 5px 24px",
        display: "block",
      },
    },
  },
});



export default theme