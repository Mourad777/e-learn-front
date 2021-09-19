import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import classes from "./Switch.module.css";

export default function CustomizedSwitches({ input, options }) {
  const { name, onChange } = input;
  const handleChange = (name) => (event) => {
    onChange(event.target.checked);
  };

  return (
    <div className={options.label ? classes.Margin : classes.MarginNoLabel }>
      <span className={classes.Label}>{options.optionOne}</span>
      <div className={classes.Inline}>
        <FormControlLabel
          
          style={{fontSize:'0.7rem'}}
          className={classes.noMargin}
          onChange={handleChange()}
          disabled={options.disabled}
          checked={"" || !input.value ? false : input.value}
          control={
            <Switch
              color="primary"
            />
          }
          // inputRef={<span style={{fontSize:'0.3em'}} />}
          label={options.label}
        />
      </div>
      <span className={classes.Label}>{options.optionTwo}</span>
    </div>
  );
}
