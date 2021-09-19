import React, { Fragment } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import CssOverrides from "./CssOverrides";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root:{
    // marginLeft:25,
    maxWidth:574,
    width:'100%'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelect({ input, label }) {
  const { t, i18n } = useTranslation("common");
  const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const classes = useStyles();
  const inputLabel = React.useRef(null);
  const placeholder = label;
  const value = input.value;
  return (

      <Fragment>
        <FormControl className={classes.root} variant="outlined">
          <InputLabel
            htmlFor="select-multiple-chip"
            ref={inputLabel}
            shrink={label && (!!placeholder || value !== undefined)}
          >
            {label}
          </InputLabel>
          <Select
            {...input}
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            multiple
            ref={inputLabel}
            // variant="outlined"
            value={input.value || []}
            // onChange={handleChange}
            input={<OutlinedInput label={label} notched />}
            renderValue={(selected) => {
              const translatedSelected = (selected||[]).map((i) => {
                return t(`courseForm.days.${i.toLowerCase()}`);
              });
              return translatedSelected.join(", ");
            }}
            MenuProps={MenuProps}
          >
            {daysOfTheWeek.map((day) => (
              <MenuItem key={day} value={day}>
                <Checkbox checked={(input.value || []).indexOf(day) > -1} />
                <ListItemText
                  primary={t(`courseForm.days.${day.toLowerCase()}`)}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Fragment>
   
  );
}
