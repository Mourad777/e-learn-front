import React, { useLayoutEffect, useState, useEffect } from "react";
import { connect } from "react-redux";
import Aux from "../Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../store/actions/index";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Toolbar from "@material-ui/core/Toolbar";
import { useDefaultStyles } from "./styles/styles";
import { useDarkThemeStyles, } from "./styles/darkThemeStyles";
import CustomDrawer from "./SideMenu/CustomDrawer";
import Modal from "../../containers/Common/ModalContent/ModalContent";
import { throttle } from "throttle-debounce";
import momentTZ from "moment-timezone";
import { useLocation, useHistory, matchPath } from "react-router-dom";
import RefreshSessionAlert from "../../components/UI/RefreshSessionAlert/RefreshSessionAlert";
import LanguageChooser from "../../components/UI/LanguageChooser/LanguageChooser";
import Switch from "../../components/UI/Switch/Switch"
import { Avatar, Divider } from "@material-ui/core";
import TopMenu from "./TopMenu/TopMenu";
import SideMenu from "./SideMenu/SideMenu";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../utility/getCourse";
import logo from "../../assets/images/white-logo512.png";

const languages = ["en", "es"];

function Layout({
  populatedCourse,
  children,
  testInSession,
  loadedUser,
  width,
  isDarkTheme,
  sessionAlert,
  refreshTokenExpiration,
  sessionExpiration,
  setRefreshSessionAlert,
  changeWidth,
  setTheme,
  handleDrawerWidth,
  isSmallDrawer,
  logout,
}) {
  const currentRoute = useLocation().pathname;
  const matchVerifyAccount = !!matchPath(currentRoute, {
    path: "/verify-account/:accountType/:token",
    exact: true,
  });
  const isAuthenticated = (!!localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') && !matchVerifyAccount;
  const [seToId, setSeToId] = useState(null); //for the purpose of cleaning up the timeouts when component unmounts
  const [seRToId, setSeRToId] = useState(null);
  const { t } = useTranslation("common")

  const darkThemeOptions = {
    label: t("layout.darkMode"),
    size: "small",
  };
  const defaultThemeclasses = useDefaultStyles({ isSmallDrawer });
  const darkThemeclasses = useDarkThemeStyles({ isSmallDrawer });
  let classes = defaultThemeclasses
  if (isDarkTheme) classes = darkThemeclasses
  const history = useHistory()
  useEffect(() => {
    if (!languages.includes(localStorage.getItem("i18nextLng"))) {
      if ((localStorage.getItem("i18nextLng") || "").includes("es")) {
        localStorage.setItem("i18nextLng", "es");
      } else {
        localStorage.setItem("i18nextLng", "en");
      }
    }

    localStorage.setItem("timezone", momentTZ.tz.guess());

    if (sessionExpiration && !(loadedUser || {}).isStayLoggedIn && loadedUser) {
      clearTimeout(seToId);
      clearTimeout(seRToId);
      const sessionTimeLeft =
        new Date(sessionExpiration).getTime() - Date.now();
      const sessionExpiredTOId = setTimeout(() => {
        logout(history);
      },
        sessionTimeLeft

      );
      setSeToId(sessionExpiredTOId);
      const sessionRefreshTOId = setTimeout(() => {
        setRefreshSessionAlert("on");
      }, sessionTimeLeft - 600000);
      setSeRToId(sessionRefreshTOId);
      if (Date.now() > refreshTokenExpiration) {
        clearTimeout(seRToId);
      }
    }
    return () => {
      clearTimeout(seToId);
      clearTimeout(seRToId);
    };
  }, [sessionExpiration, loadedUser]);

  useEffect(() => {
    setMobileOpen(false);
  }, [isAuthenticated]);

  function handleUpdateSize() {
    changeWidth(window.innerWidth);
  }

  useLayoutEffect(() => {
    window.addEventListener(
      "resize",
      throttle(
        150,
        false,
        () => {
          handleUpdateSize();
        },
        false
      )
    );
    handleUpdateSize();
    return () => window.removeEventListener("resize", handleUpdateSize);
  }, []);

  const [mobileOpen, setMobileOpen] = React.useState(true);

  const handleDrawerToggle = (action) => {
    if (action === 'close') {
      setMobileOpen(false)
    } else {
      setMobileOpen(!mobileOpen);
    }
  };

  const handlePanelChange = () => {
    if (mobileOpen) handleDrawerToggle();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={[isAuthenticated ? classes.appBar : classes.appBarNoDrawer, isDarkTheme ? classes.AppStyle : ''].join(' ')}

      >
        <Toolbar className={classes.toolbarLayout}>
          {!isAuthenticated && <Aux>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              minWidth: width > 600 ? 190 : 0,
              alignItems: 'center',
            }}>
              <Avatar
                src={logo}
              />

              <Typography variant="h6" noWrap>
                {isSmallDrawer && (populatedCourse || {}).courseName ? populatedCourse.courseName : "Boukacademy"}
              </Typography>

            </div>
            <LanguageChooser />
          </Aux>}
          {isAuthenticated && (
            <Aux>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                minWidth: width > 600 ? 190 : 0,
                alignItems: 'center',
              }}>
                <Avatar
                  src={logo}
                />
                {(width > 600) && (
                  <Typography variant="h6" noWrap>
                    {isSmallDrawer && (populatedCourse || {}).courseName ? populatedCourse.courseName : "Boukacademy"}
                  </Typography>
                )}
              </div>


              <TopMenu
                handlePanelChange={handlePanelChange}
                testInSession={testInSession}
              />
            </Aux>
          )}
        </Toolbar>
      </AppBar>

      {/* Side Panel with links */}
      {isAuthenticated && (
        <CustomDrawer
          currentRoute={currentRoute}
          classes={classes}
          mobileOpen={mobileOpen}
          onHandleDrawerToggle={handleDrawerToggle}
        >
          {!isSmallDrawer && (
            <div style={{ position: 'absolute', top: 15, left: 27 }}>
              <Switch options={{ ...darkThemeOptions, labelFontSize: '0.9rem' }} input={{ value: isDarkTheme, onChange: () => setTheme(isDarkTheme ? 'light' : 'dark') }} />

            </div>
          )}

          <div style={{ position: 'absolute', top: 10, left: 0 }}>
            <IconButton onClick={() => {
              handleDrawerWidth()
            }}>
              {isSmallDrawer ? <ArrowForward /> : <ArrowBackIcon />}
            </IconButton>

          </div>

          <SideMenu handleDrawer={handleDrawerToggle} isSmallDrawer={isSmallDrawer} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} classes={classes} />
        </CustomDrawer>
      )}


      <div
        className={[
          classes.panelContainer,
        ].join(" ")}
      >
        {children}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography style={{ width: '100%' }} align="center" gutterBottom variant="caption">
            © 2021 Boukacademy Inc. All rights reserved.
          </Typography>
        </div>
      </div>
      <Modal />
      {sessionAlert && <RefreshSessionAlert />}
    </div>
  );
}

Layout.propTypes = {
  container: PropTypes.any,
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeWidth: (dimensions) => {
      dispatch(actions.setWidth(dimensions));
    },
    setRefreshSessionAlert: (alert) => {
      dispatch(actions.setSessionAlert(alert));
    },
    setTheme: (theme) => {
      dispatch(actions.setTheme(theme));
    },
    logout: (history) => {
      dispatch(actions.logout(history));
    },
  };
};

const mapStateToProps = (state) => {
  const selectedCourse = state.common.selectedCourse;
  const courses = state.common.courses;
  const populatedCourse = getCourse(courses, selectedCourse);
  return {
    isAuthenticated: state.authentication.token !== null,
    userId: state.authentication.userId,
    testInSession: state.studentTest.testInSession,
    sessionAlert: state.common.sessionAlert,
    width: state.common.width,
    sessionExpiration: state.authentication.sessionExpiration,
    refreshTokenExpiration: state.authentication.refreshTokenExpiration,
    loadedTestDataInProgress: state.studentTest.loadedTestDataInProgress,
    isDarkTheme: state.common.isDarkTheme,
    course: state.common.selectedCourse,
    loadedUser: state.authentication.loadedUser,
    populatedCourse,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);