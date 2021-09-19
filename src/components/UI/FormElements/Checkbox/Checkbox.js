import React, { Component } from "react";
import { Field } from "redux-form";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import { FormLabel, Typography } from "@material-ui/core";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";

const styles = () => ({
  MuiFormLabel: {
    fontSize: "1.2em",
    // color: "black",
  },
  Margin: {
    marginBottom: "15px",
  },
});

class CheckboxGroup extends Component {
  field = ({ input, meta, options, classes, column, error }) => {
    const { name, onChange } = input;
    let inputValue = input.value;

    const checkboxes = options.map(({ label, value, name }, index) => {
      const handleChange = (event) => {
        const arr = [...inputValue];
        if (event.target.checked) {
          arr.push(value);
        } else {
          arr.splice(arr.indexOf(value), 1);
        }
        return onChange(arr);
      };

      const checked = inputValue.includes(value);

      return (
        
          <div key={label+index} style={{ display: 'flex',alignItems:'center' }}>

            {this.props.numbered && <Typography style={{marginRight:10}} variant="subtitle1">{index + 1}</Typography>}
            <FormControlLabel
              key={`checkbox-${index}`}
              control={
                <Checkbox
                  name={`${name}[${index}]`}
                  value={value}
                  checked={checked}
                  onChange={handleChange}
                />
              }
              label={label}
            />
          </div>
        
      );
    });

    return (
      <FormControl component="fieldset">
        <Typography variant="h6">
        {this.props.title}
        </Typography>
        <FormGroup row={!column} className={classes.Margin}>
          {checkboxes}
        </FormGroup>
        <FormHelperText>
          {(meta.error || error) && meta.touched ? error || meta.error : ""}
        </FormHelperText>
      </FormControl>
    );
  };

  render() {
    return (
      <Field
        name="checkbox"
        {...this.props}
        type="checkbox"
        component={this.field}
      />
    );
  }
}

export default withStyles(styles)(CheckboxGroup);
