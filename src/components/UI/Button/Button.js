import React from "react";
import classes from "./Button.module.css";

const button = (props) => (
  <button
    type={props.type}
    disabled={props.disabled}
    style={props.isDarkTheme ? {borderColor:'#fff',color:'#fff'} : {}}
    className={
      props.modal
        ? [classes.ModalButton, !props.isError ? props.isDarkTheme ? classes.darkBackground : classes.lightBackground : classes.ModalError].join(" ")
        : [
          props.halfWidth ? classes.HalfWidth : classes.FullWidth,
          classes.Button,
          props.isError ? classes.Error : classes.SubmitForm,
        ].join(" ")
    }
    onClick={props.clicked}
  >
    {props.children}
  </button>
);

export default button;
