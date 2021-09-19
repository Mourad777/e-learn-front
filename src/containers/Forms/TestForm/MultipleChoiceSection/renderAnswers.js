import React from 'react';
import { Field } from "redux-form";
import { renderField } from "./renderField";
import { List, ListItem } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

export const renderAnswers = ({
    clearAnswers,
    questionIndex,
    fields,
    meta: { error },
    t,
}) => (
    <Aux>
        <Typography variant="subtitle1" gutterBottom>
            {t("testForm.writeAnswers")}
        </Typography>
        <List>
            {fields.map((answer, index) => (
                <ListItem key={index}>
                    <Button
                        onClick={() => {
                            fields.remove(index);
                            clearAnswers(questionIndex);
                        }}
                        color="secondary"
                        startIcon={<DeleteIcon />}
                    >
                        {""}
                    </Button>
                    <Field name={answer} type="text" component={renderField} label={``} />
                </ListItem>
            ))}
            {error && <ListItem className="error">{error}</ListItem>}
        </List>
        <div style={{ display: 'flex' }}>
            <Button
                color="primary"
                onClick={() => fields.push()}
            >
                {t("testForm.buttons.addAnswer")}
            </Button>
        </div>
    </Aux>
);