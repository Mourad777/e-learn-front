import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as actions from "../../../store/actions/index";
import classes from "./RefreshSessionAlert.module.css";
const RefreshSessionAlert = ({
  token,
  refreshTokenExpiration,
  sessionExpiration,
  refreshToken,
}) => {
  const [timeLeft, setTimeLeft] = useState(
    new Date(sessionExpiration).getTime() - Date.now()
  );
  const [isBlockedRefresh, setIsBlockedRefresh] = useState(false);

  const handleSessionRefresh = () => {
    if(!token)return;
    refreshToken(token);
  };

  const handleSetTime = () => {
    setTimeLeft(new Date(sessionExpiration).getTime() - Date.now());
  };

  let intervalId;
  useEffect(() => {
    intervalId = setInterval(() => {
      handleSetTime();
    }, 1000);
    let timeoutId;
    timeoutId = setTimeout(() => {
      setIsBlockedRefresh(true);
    }, refreshTokenExpiration - Date.now());
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={[classes.alert,isBlockedRefresh ? classes.refreshBlocked : ''].join(' ')}>
      <Typography
        style={{ textAlign: "center" }}
      >{`Your session will expire in ${new Date(timeLeft).getMinutes()}:${
        new Date(timeLeft).getSeconds() < 10 ? "0" : ""
      }${new Date(timeLeft).getSeconds()}`}</Typography>
      {!isBlockedRefresh && (
        <Button
          style={{ display: "block", margin: "auto" }}
          color="primary"
          onClick={handleSessionRefresh}
        >
          Stay logged in
        </Button>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    refreshToken: (token) => dispatch(actions.refreshTokenStart(token)),
  };
};

const mapStateToProps = (state) => {
  return {
    token: state.authentication.token,
    sessionExpiration: state.authentication.sessionExpiration,
    refreshTokenExpiration: state.authentication.refreshTokenExpiration,
    
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RefreshSessionAlert);
