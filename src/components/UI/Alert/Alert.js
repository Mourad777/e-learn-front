import React from "react";
import classes from "./Alert.module.css";
import Typography from "@material-ui/core/Typography";

const Alert = ({ successMessage, failMessage, noDrawer }) => (
  <div
    style={{
      transform: successMessage || failMessage ? "translateY(0)" : "translateY(-100vh)",
      opacity: successMessage || failMessage ? "1" : "0",
    }}
    className={[
      classes.alert,
      successMessage ? classes.success : classes.fail,
      noDrawer ? classes.noDrawer : classes.withDrawer
    ].join(" ")}
  >
    {successMessage ? (
      <Typography variant="subtitle1">{successMessage}</Typography>
    ) : (
      <Typography variant="subtitle1">{failMessage}</Typography>
    )}
  </div>
);

export default Alert;
