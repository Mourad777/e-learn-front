import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      //   light: "#757ce8",
      // main: "#01579b",
      main: "#2196f3",
      dark: "#01579b",
      //   contrastText: "#fff",
    },
    secondary: {
      main: '#c62828'
    },
    background: {
      default: '#424242'
    },


    // secondary: {
    //   main:'#FF4136'
    // },
    // success:{
    //   main:"#3D9970"
    // },
    type: 'dark'
    // background: {
    //   default: "blue"
    // },
    // text:{
    //   primary:'red'
    // }
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,

    },
    MuiButton: {
      variant: "contained",
      size: "small"
    }
  },
  overrides: {
    //lazy loading causes the tab indicator to dissapear on initial load
    //so i removed it completeley
    PrivateTabIndicator: {
      colorPrimary: {
        backgroundColor: "#424242"
      }
    },
    // MuiInputLabel: {
    //   outlined: {
    //     color: '#fff'
    //   }
    // },
    // MuiSelect:{
    //   outlined:{
    //     color:'#fff'
    //   }
    // },
    MuiOutlinedInput: {
      // root: {
      //   color: '#fff'
      // },
      input: {
        "&:-webkit-autofill": {
          '-webkit-box-shadow': '0 0 0 100px #424242 inset'
        }
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
      contained: {
        color: "#e91313",
      },
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
      colorDefault: {
        backgroundColor: '#424242'
      },
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