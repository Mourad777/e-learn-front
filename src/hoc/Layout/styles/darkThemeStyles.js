import { makeStyles } from "@material-ui/core/styles";

export const useDarkThemeStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    background: "#424242",
    height:'100%',
  },
  // noOverflow: {
  //   overflowX: "hidden",
  // },
  smallFontSize: {
    fontSize: "0.7em",
  },
  drawer: {
    width: 0,
    [theme.breakpoints.up("sm")]: {
      width: props=>props.isSmallDrawer ? 60 : 200,
      flexShrink: 0,
    },
  },
  appBarNoDrawer: {
    zIndex:2,
    marginLeft: 0,
    backgroundColor: theme.palette.primary.mainColor,
  },
  appBar: {
    marginLeft: 0,
    zIndex:2,
    backgroundColor: theme.palette.primary.mainColor,
    [theme.breakpoints.up("sm")]: {
      width:props=>props.isSmallDrawer ?`calc(100% - 60px)` :  `calc(100% - 200px)`,
      marginLeft: props=>props.isSmallDrawer ? 60 : 200,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,

  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: props=>props.isSmallDrawer ? 60 : 200,
    overflowX: 'hidden'
  },
  content: {
    width: "0",
    flexGrow: 1,
    marginBottom: 80,
  },
  authContent: {
    width: "0",
    flexGrow: 1,
  },
  primaryColor: {
    color: "#2196f3",
    // textAlign: 'center'
  },
  whiteColor: {
    color: "white",
    textAlign: "center",
  },
  blueHeader: {
    backgroundColor: "#01579b",
  },
  toolbarLayout: {
    justifyContent: "space-between",
    minHeight:'64px'
  },
  center: {
    textAlign: "center",
  },
  bottomFixed: {
    // width: '50%',
    ["@media (max-width:500px)"]: {
      // eslint-disable-line no-useless-computed-key
      position: "fixed",
      bottom: "0",
    },
  },
  smallFontSize: {
    fontSize: "0.7em",
  },
  panelContainer: {
    width: "100%",
    background:'#424242',
    margin: "auto",
    marginTop:0,
    marginBottom:0,
    padding: "50px 0 10px 0",
    height:'100%',
    // position:'relative',
    display:'flex',
    flexDirection:'column',
    overflowY:'scroll',
  },
  // panelContainerBreakPoints:{
  //   ["@media (min-width:500px)"]: {
  //     margin: "45px auto 0 auto",
  //   },
  // },
  CustomTabBar:{
    position:'absolute',
    // top:'55px',
    width:'100%',
    ["@media (min-width:500px)"]: {
      top: "64px",
    },
  },
  AppStyle:{
    backgroundColor:theme.palette.primary.dark
  }
}));
// style={{ position: "absolute", top: "55px", width: "100%" }}