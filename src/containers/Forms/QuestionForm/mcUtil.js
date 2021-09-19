import React from 'react';
import Button from "@material-ui/core/Button";
import classes from "./QuestionForm.module.css";
import { List, ListItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { Field } from "redux-form";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";

const renderField = ({ input, label, type, meta: { touched, error } }) => (
    <div>
      <label>{label}</label>
      <div>
        <input
          className={[classes.InputField, classes.FullWidth].join(" ")}
          {...input}
          placeholder={label}
          type={type}
        />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  );
  
  export const renderAnswers = ({ clearAnswers, fields, t,meta: { error } }) => (
    <Aux>
      <Button
        fullWidth
        type="button"
        color="primary"
        onClick={() => fields.push()}
        startIcon={<AddIcon />}
        size="small"
      >
       {t("questionForm.buttons.addAnswer")}
      </Button>
      <Typography variant="body1" style={{fontSize:'0.8rem'}} gutterBottom>
      {t("questionForm.writeAnswers")}
      </Typography>
      <List>
        {fields.map((answer, index) => (
          <ListItem key={index}>
            <Button
              onClick={() => {
                fields.remove(index);
                clearAnswers();
              }}
              color="secondary"
              // variant="outlined"
              startIcon={<DeleteIcon />}
            >
              {""}
            </Button>
            <Field
              name={answer}
              type="text"
              component={renderField}
              label={``}
            />
          </ListItem>
        ))}
        {error && <ListItem className="error">{error}</ListItem>}
      </List>
    </Aux>
  );
  