import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import SubmitButton from "../../../components/UI/Button/SubmitButton";
import { useTranslation } from "react-i18next";
import FileInput from "../../../components/UI/FormElements/FileInput/FileInput";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import IconButton from "@material-ui/core/IconButton";
import validate from "./validate";

import {
  Field,
  FieldArray,
  reduxForm,
  getFormValues,
  change,
  touch,
} from "redux-form";
import AddIcon from "@material-ui/icons/Add";
//documents
const RenderResources = ({
  fields,
  formValues = {},
  changeDocument,
  openModal,
  t,
  isDarkTheme,
}) => {
  return (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.resources")}</Typography>
      <List>
        {fields.map((field, index) => {
          const loadedFile = ((formValues.resources || [])[index] || {})
            .loadedResource;
          const ext =
            ((formValues.resources || [])[index] || {}).resource instanceof File
              ? (
                (((formValues.resources || [])[index] || {}).resource || {})
                  .name || ""
              )
                .toLowerCase()
                .split(".")
                .pop()
              : (((formValues.resources || [])[index] || {}).resource || "")
                .toLowerCase()
                .split(".")
                .pop();
          let icon;
          if (ext === "pdf") icon = <i className="far fa-file-pdf fa-2x"></i>;
          if (ext === "docx" || ext === "doc")
            icon = <i className="fas fa-file-word fa-2x"></i>;
          if (ext === "jpeg" || ext === "jpg" || ext === "jfif")
            icon = <i className="fas fa-file-image fa-2x"></i>;
          if (ext === "avi" || ext === "mp4")
            icon = <i className="far fa-file-video fa-2x"></i>;
          return (
            <ListItem key={index}>
              {loadedFile && icon && (
                <span
                  style={{ marginRight: 20, cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal({ loadedFile, ext }, "courseResource");
                  }}
                >
                  {icon}
                </span>
              )}
              <Field
                simple
                label={t("resources.buttons.resourceName")}
                name={`resources.${index}.resourceName`}
                component={TextField}
                errorAbsolutePosition
              />
              <Field
                name={`resources.${index}.resource`}
                component={FileInput}
                loadedFile={loadedFile}
                mimeTypesAllowed={
                  "video/*, image/jpeg, application/pdf, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                }
                extensionsAllowed={[
                  "jpeg",
                  "jpg",
                  "jfif",
                  "pdf",
                  "docx",
                  "doc",
                  "mp4",
                  "avi",
                ]}
                onChangeFile={(resource) => {
                  changeDocument(`resources.${index}.loadedResource`, resource);
                }}
                preview={false}
                compressImage
                index={index}
                uploadButtonText={t("resources.buttons.select")}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  fields.remove(index);
                }}
              >
                <DeleteIcon fontSize="small" style={{ color: "red" }} />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
      <ListItem button onClick={() => fields.push()}>
        <AddIcon style={{ color: isDarkTheme ? "#2196f3" : "#0058AE" }} />
        <Typography style={{ color: isDarkTheme ? "#2196f3" : "#0058AE" }}>
          {t("resources.buttons.addResource")}
        </Typography>
      </ListItem>
    </Aux>
  );
};

const CourseResources = ({
  token,
  course={},
  formValues,
  updateResources,
  changeDocument,
  initialValues,
  openModal,
  touchField,
  configuration,
  isDarkTheme,
}) => {
  const [initialUrls, setInitialUrls] = useState(null);
  const [isSubmitTouched, setIsSubmitTouched] = useState(false);

  useEffect(() => {
    const urls = initialValues.resources.map((r) => r.resource);
    setInitialUrls(urls);
  }, [initialValues]);
  const { t } = useTranslation();

  const handleSubmit = () => {
    const { isValid } = validate(formValues, configuration);
    formValues.resources.forEach((r, i) => {
      touchField(`resources.${i}.resourceName`);
      touchField(`resources.${i}.resource`);
    });
    setIsSubmitTouched(true)
    if (!isValid) return;
    const updatedUrls = formValues.resources.map((r) => r.resource);

    const filesToDelete = (initialUrls || []).filter((initialUrl) => {
      if (!updatedUrls.includes(initialUrl)) return initialUrl;
    });
    updateResources(course._id, formValues.resources, filesToDelete, token);
  };
  const { isValid } = validate(formValues, configuration);

  return (
    <Aux>
      <FieldArray
        name="resources"
        formValues={formValues}
        component={RenderResources}
        changeDocument={changeDocument}
        openModal={openModal}
        isDarkTheme={isDarkTheme}
        t={t}
      />
      <SubmitButton
        clicked={handleSubmit}
        isError={isSubmitTouched && !isValid}
      >
        {t("resources.buttons.updateResources")}
      </SubmitButton>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateResources: (courseId, resources, filesToDelete, token) =>
      dispatch(
        actions.updateCourseResourcesStart(
          courseId,
          resources,
          filesToDelete,
          token
        )
      ),
    changeDocument: (field, resource) => {
      dispatch(change("courseResources", field, resource));
    },
    openModal: (doc, type) => {
      dispatch(actions.openModal(doc, type));
    },
    touchField: (field) => {
      dispatch(touch("courseResources", field));
    },
  };
};

const mapStateToProps = (state) => {
  const course = (state.common.courses || []).find(
    (c) => c._id === state.common.selectedCourse
  );
  const resources = (course || {}).resources || [];
  const instructorFileSizeLimit =
    state.common.configuration.instructorFileSizeLimit;
  const initialValues =
    resources.length === 0 ? [{ resourceName: "" }] : resources;
  return {
    formValues: getFormValues("courseResources")(state),
    modalDocument: state.common.modalDocument,
    configuration: state.common.configuration,
    token: state.authentication.token,
    initialValues: { resources: initialValues, instructorFileSizeLimit },
    isDarkTheme: state.common.isDarkTheme,
    course,
  };
};

const wrappedForm = reduxForm({
  form: "courseResources",
  enableReinitialize: true,
  destroyOnUnmount: true,
  validate,
})(CourseResources);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
