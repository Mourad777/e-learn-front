import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { reduxForm, getFormValues, change, Field } from "redux-form";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
}));

const RenderContents = ({ modalDocument, changeField, input }) => {
  const classes = useStyles();
  const { tests, assignments, lessons, field } = modalDocument;
  const inputValue = input.value;
  const {t} = useTranslation()
  return (
    <List className={classes.root} subheader={<li />}>
      {[
        { type: "lesson", list: lessons },
        { type: "test", list: tests },
        { type: "assignment", list: assignments },
      ].map((subheader) => (
        <li key={`subheader-${subheader.type}`} className={classes.listSection}>
          <ul className={classes.ul}>
            <Aux>
              <ListSubheader>
                {subheader.type === "lesson" ? t("instructorModules.lessons") : ""}
                {subheader.type === "test" ?  t("instructorModules.tests") : ""}
                {subheader.type === "assignment" ?  t("instructorModules.assignments") : ""}
              </ListSubheader>
              {(subheader.list || []).map((item, index) => {
                const handleChange = (event) => {
                  const arr = [...inputValue];
                  if (event.target.checked) {
                    arr.push({
                      documentId: item._id,
                      documentType: subheader.type,
                    });
                  } else {
                    arr.splice(
                      arr.findIndex(
                        (arrItem) => item._id === arrItem.documentId
                      ),
                      1
                    );
                  }
                  return changeField(field, arr);
                };
                const checked = (inputValue || []).find(
                  (inputValueItem) => item._id === inputValueItem.documentId
                );

                return (
                  <ListItem key={`item-${subheader.type}-${item._id}`}>
                    <FormControlLabel
                      key={`checkbox-${index}`}
                      control={
                        <Checkbox
                          name={
                            subheader.type === "lesson"
                              ? `${item.lessonName}[${index}]`
                              : `${item.testName}[${index}]`
                          }
                          value={item._id}
                          checked={checked ? true : false}
                          onChange={handleChange}
                        />
                      }
                      label={
                        subheader.type === "lesson"
                          ? item.lessonName
                          : item.testName
                      }
                    />
                  </ListItem>
                );
              })}
            </Aux>
          </ul>
        </li>
      ))}
    </List>
  );
};

const Contents = ({modalDocument,changeField}) => (
    <Field name={modalDocument.field} modalDocument={modalDocument} changeField={changeField} component={RenderContents}/>
)

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("category")(state),
    modalDocument: state.common.modalDocument,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (field, value) => {
        dispatch(change("category", field, value))
    },
  };
};

const wrappedForm = reduxForm({
  form: "category",
  enableReinitialize: true,
  destroyOnUnmount: false,
})(Contents);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
