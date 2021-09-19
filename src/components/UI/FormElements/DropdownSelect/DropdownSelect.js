import React from "react";
import { connect } from "react-redux"
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 80,
    width: "100%",
    marginBottom: "20px",
  },
  textLabel: {
    margin: "0 3px 10px 3px",
  },
  SelectField: {
    boxSizing: "border-box",
    border: "1px solid #C2C2C2",
    // boxShadow: "1px 1px 4px #EBEBEB",
    borderRadius: "3px",
    padding: "7px",
    outline: "none",
    margin: "0 3px 0 0",
    cursor:'pointer'
  },
  SelectFieldDark:{
    background: 'transparent',
    color:'white',
  },
  errorSelect: {
    '&:before': {
        borderColor: 'red',
    },
    '&:after': {
        borderColor: 'red',
    }
},
}));

const DropdownSelect = ({
  input,
  meta = {},
  options,
  label,
  fullWidth,
  simple,
  textLabel,
  error,
  disabled,
  isDarkTheme
}) => {
  const classes = useStyles();
  const selectItems = options.map((option) => (
    <option style={isDarkTheme ? { background: '#424242', color: 'white' } : {}} key={option.primaryText} value={option.value}>
      {option.primaryText}
    </option>
  ));

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth((inputLabel.current || 200).offsetWidth);
  }, []);

  let display = (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel}>{label}</InputLabel>
      <Select
        disabled={disabled}
        native
        error={(meta.error || error) && meta.touched}
        renderValue={() => input.value}
        labelWidth={labelWidth}
        className={classes.cssOutlinedInput}
        {...input}
      >
        {selectItems}
      </Select>
      <FormHelperText>
        {(meta.error || error) && meta.touched ? meta.error || error : ""}
      </FormHelperText>
    </FormControl>
  );
  if (simple)
    display = (
      <div>
        {textLabel && <div className={classes.textLabel}>{`${textLabel}`}</div>}
        <select
          value={!textLabel ? label : ""}
          className={[classes.SelectField,classes.errorSelect, isDarkTheme ? classes.SelectFieldDark : ""].join(' ')}
          style={fullWidth ? { width: "95%" } : null}
          {...input}
        >
          {!textLabel && (
            <option style={isDarkTheme ? { background: '#424242', color: 'white' } : {}} hidden key={-1} value={label}>
              {label}
            </option>
          )}

          {selectItems}
        </select>
        {meta.error && meta.touched && (
          <span
            style={{ color: "#E91313", fontSize: "0.7em", display: "block" }}
          >
            {meta.error}
          </span>
        )}
      </div>
    );
  return display;
};

const mapStateToProps = (state) => {
  return {
    isDarkTheme: state.common.isDarkTheme,
  };
};

export default connect(mapStateToProps)(DropdownSelect);
