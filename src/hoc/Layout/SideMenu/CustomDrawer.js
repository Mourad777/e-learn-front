import React from 'react'
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { useTheme } from '@material-ui/core';

const CustomDrawer = ({container,children, onHandleDrawerToggle,mobileOpen, classes}) => {
  return(
    <nav className={classes.drawer} aria-label="mailbox folders">
    <Hidden smUp implementation="css">
      <Drawer
        style={{overflowX:'hidden'}}
        container={container}
        variant="temporary"
        anchor={useTheme().direction === "rtl" ? "right" : "left"}
        open={mobileOpen}
        onClose={onHandleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {children}
      </Drawer>
    </Hidden>
    <Hidden xsDown implementation="css">
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="permanent"
        open
      >
        {children}
      </Drawer>
    </Hidden>
  </nav>
)}

export default CustomDrawer