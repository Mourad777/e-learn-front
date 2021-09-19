import React from "react";
import {connect} from "react-redux"
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  textField: {
    minWidth: "80px",
    width: "100%",
    marginBottom: "20px",
  },
  InputField: {
    boxSizing: "border-box",
    border: "1px solid #C2C2C2",
    // boxShadow: "1px 1px 4px #EBEBEB",
    margin: "0 3px",
    flexGrow: 1,
    borderRadius: "3px",
    padding: "7px",
    outline: "none",
    width: "100%",
  },
  InputFieldBlueShadow: {
    boxSizing: "border-box",
    border: "1px solid #C2C2C2",
    // boxShadow: "1px 1px 4px #66b1e8",
    margin: "0 3px",
    flexGrow: 1,
    borderRadius: "3px",
    padding: "7px",
    outline: "none",
    width: "100%",
  },
  textLabel: {
    margin: "0 3px 10px 3px",
  },
  languageContainer: {
    paddingRight: "4px",
    width: "100%",
  },
  errorText: {
    color: "#e91313",
    fontFamily: "Helvetica",
    fontSize: "0.75rem",
  },
  errorTextContainer: {
    marginLeft: "13px",
  },
  darkTheme:{
    background:'transparent',
    color:'white',
  }
}));

const TextInput = ({
  input,
  label,
  meta = {},
  options,
  disabled,
  size,
  error,
  type,
  fullWidth,
  simple,
  blueBackground,
  textLabel,
  language,
  width,
  required,
  errorAbsolutePosition,
  isDarkTheme,
}) => {
  const classes = useStyles();
  let display = (
    <div style={fullWidth ? { width: "100%" } : {}}>
      <FormControl className={classes.textField} variant="outlined">
        <InputLabel required={required} htmlFor="component-outlined">
          {label}
        </InputLabel>
        <OutlinedInput
          error={(meta.error || error) && meta.touched}
          type={type}
          size={!size ? "medium" : size}
          label={label}
          disabled={disabled}
          autoComplete="off"
          {...input}
          {...options}
        />
        <FormHelperText>
          {(meta.error || error) && meta.touched ? error || meta.error : ""}
        </FormHelperText>
      </FormControl>
    </div>
  );
  if (simple) {
    const inputWidth = fullWidth ? "100%" : width;
    display = (
      <div  className={language ? classes.languageContainer : ""}>
        {textLabel && <div className={classes.textLabel}>{`${label}`}</div>}
        <input
          onClick={(e) => {
            e.stopPropagation();
          }}
          type={type ? type : "text"}
          style={{ width: inputWidth ? inputWidth : "95%" }}
          className={
            [blueBackground ? classes.InputFieldBlueShadow : classes.InputField,
            isDarkTheme ? classes.darkTheme : ''].join(' ')
          }
          placeholder={textLabel ? "" : label}
          {...input}
          disabled={disabled}
        />
        <div style={{position:errorAbsolutePosition ? 'absolute': 'relative'}} className={classes.errorTextContainer}>
          <span className={classes.errorText}>
            {" "}
            {(meta.error || error) && meta.touched ? error || meta.error : ""}
          </span>
        </div>
      </div>
    );
  }
  return display;
};

const mapStateToProps = (state) => {
  return {
    isDarkTheme: state.common.isDarkTheme,
  };
};
export default connect(mapStateToProps)(TextInput);
