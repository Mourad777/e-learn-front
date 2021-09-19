import React from "react";
import {connect} from "react-redux"
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import CssOverrides from "./CssOverrides";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  textField: {
    width: "180px",
    marginBottom: "20px",
  },
  fullWidth: {
    minWidth: "180px",
    width: "100%",
    marginBottom: "20px",
  },
  InputField: {
    boxSizing: "border-box",
    border: "1px solid #C2C2C2",
    // boxShadow: "1px 1px 4px #EBEBEB",
    borderRadius: "3px",
    padding: "7px",
    outline: "none",
    backgroundColor:'transparent'
  },
  InputFieldDark:{
    color:'white'
  },
  position: {
    display: "block",
    marginRight: 10,
  },
  errorText: {
    color: "red",
    fontSize: "0.7em",
    display: "block",
  },
  minWidth: {
    minWidth: 250,
  },
}));

function NumberInput({
  options,
  readOnly,
  input,
  disabled,
  fullWidth,
  simple,
  width,
  meta = {},
  error,
  customMargin,
  borderColor,
  compact,
  minWidth,
  errorBottomPosition,
  configInput,
  isDarkTheme,

}) {
  const classes = useStyles();
  let display = (
    <div style={{ marginBottom: 20, maxWidth:fullWidth ? "" : 250 }}>
      <TextField
        className={classes.position}
        {...input}
        {...options}
        fullWidth={fullWidth}
        type="number"
        // style={{ minWidth }}
        helperText={
          (meta.error || error) && meta.touched ? error || meta.error : null
        }
        variant="outlined"
      />
    </div>
  );
  if (compact)
    display = (
      <CssOverrides isDarkTheme={isDarkTheme}>
        <TextField
          style={{ marginBottom: 20 }}
          inputProps={{ style: { fontSize: 14, minWidth: options.minWidth || minWidth } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 14 } }} // font size of input label
         
          className={[
            fullWidth,
            classes.position,
          ].join(" ")}
          {...input}
          {...options}
          type="number"
          helperText={
            (meta.error || error) && meta.touched ? error || meta.error : null
          }
          variant="outlined"
        />
      </CssOverrides>
    );
  if (simple) {
    const inputLength = {
      width,
      borderColor,
      marginBottom: meta.error && configInput ? 40 : 0
    };
    display = (
      <Aux>
        {!errorBottomPosition && (
          <span className={classes.errorText}>
            {(meta.error || error) && meta.touched ? error || meta.error : null}{" "}
          </span>
        )}
        <input
          disabled={disabled}
          type="number"
          className={[classes.InputField, isDarkTheme ? classes.InputFieldDark : ""].join(' ')}
          {...input}
          style={inputLength}
        />
        {errorBottomPosition && (
          <span style={{ transform: configInput ? 'translateY(-35px)' : '', textAlign: configInput ? 'left' : "", position: configInput ? "absolute" : "" }} className={classes.errorText}>
            {(meta.error || error) && meta.touched ? error || meta.error : null}{" "}
          </span>
        )}
      </Aux>
    );
    if (readOnly)
      display = (
        <input
          type="number"
          className={[classes.InputField, isDarkTheme ? classes.InputFieldDark : ""].join(' ')}
          value={input.value}
          readOnly
          style={inputLength}
        />
      );
  }
  return display;
}
const mapStateToProps = (state) => {
  return {
    isDarkTheme: state.common.isDarkTheme,

  };
};
export default connect(mapStateToProps)(NumberInput)