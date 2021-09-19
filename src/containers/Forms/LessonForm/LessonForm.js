import React, { useState, useEffect, useRef } from "react";
import {
  Field,
  FieldArray,
  reduxForm,
  change,
  touch,
  getFormSyncErrors,
} from "redux-form";
import { connect } from "react-redux";
import validate from "./validate";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import Switch from "../../../components/UI/Switch/Switch";
import DateTimePicker from "../../../components/UI/FormElements/DateTimePicker/DateTimePicker";
import SubmitButton from "../../../components/UI/Button/SubmitButton"
import Typography from "@material-ui/core/Typography";
import classes from "./LessonForm.module.css";
import * as actions from "../../../store/actions/index";
import bson from "bson";
import { getUrls } from "../../../utility/getUrls";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import { useLocation, matchPath } from "react-router-dom";
import { handleDeleteUnsavedImages } from "../../../utility/unsavedImagesHandler";
import renderSlides from './RenderSlides';

const handleWindowClose = (formValues, initialUrls, isUpdating, token, deleteImg) => {
  // ev.preventDefault();
  const formType = "lessonForm";
  if (!isUpdating) handleDeleteUnsavedImages(formValues, initialUrls, isUpdating, token, deleteImg, formType);
  return;
};

const LessonForm = ({ submitting,
  formValues = {},
  editing,
  course,
  changeField,
  formErrors,
  touchField,
  deleteImg,
  initialValues,
  addNewLesson,
  clearLessonForm,
  fetchLesson,
}) => {
  const token = localStorage.getItem('token')
  const [initialUrls, setInitialUrls] = useState([]);
  const [newLessonId, setNewLessonId] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation('common')
  const currentLocation = useLocation().pathname

  const currentInitialUrls = useRef();
  currentInitialUrls.current = initialUrls;

  const currentFormValues = useRef();
  currentFormValues.current = formValues;

  const currentIsUpdating = useRef();
  currentIsUpdating.current = isUpdating;

  useEffect(() => {

    setNewLessonId(
      !editing
        ? new bson.ObjectId().toHexString()
        : null
    );
    if (editing) {
      let lessonId;
      const match = matchPath(currentLocation, {
        path: "/instructor-panel/course/:courseId/lesson/:lessonId/edit",
        exact: false,
      });

      if (match) {
        lessonId = match.params.lessonId
        fetchLesson(lessonId, token)
      }
    }
    const formType = "lessonForm";
    window.addEventListener("beforeunload", () => handleWindowClose(currentFormValues.current.values, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType));
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      clearLessonForm();

      if (!isUpdating) handleDeleteUnsavedImages(currentFormValues.current.values, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType);
    }

  }, [])

  useEffect(() => {
    // window.addEventListener("beforeunload", handleWindowClose);
    //set the initial urls
    if (initialValues) {
      const initialUrls = getUrls(initialValues, "lessonForm");
      setInitialUrls(initialUrls);
    }

  }, [initialValues])

  const checkPageValidity = () => {
    ((formValues.values || {}).slides || []).forEach((slide, index) => {
      touchField(`slides.${index}.slideContent`);
      touchField(`slides.${index}.videoFile`);
      touchField(`slides.${index}.audioFile`);
    });
    touchField("availableOnDate");
    touchField("lessonName");
    if (formErrors.isValid) return true;
  };

  const onSubmit = () => {
    const valid = checkPageValidity();
    if (!valid) {
      setIsValid(false)
      return;
    }
    const updatedUrls = getUrls(formValues.values, "lessonForm");
    const filesToDelete = (initialUrls || []).filter(
      (initialUrl) => {
        if (!updatedUrls.includes(initialUrl)) return initialUrl;
        return null;
      }
    );
    setIsUpdating(true)
    addNewLesson(
      editing
        ? formValues.values
        : { ...formValues.values, _id: newLessonId },
      token,
      editing,
      course._id,
      filesToDelete
    );
  };

  const initiateRecording = (recorder, timeout, index) => {
    changeField(`slides.${index}.recording`, true);
    changeField(`slides.${index}.recorder`, recorder);
    changeField(`slides.${index}.recordingTimeout`, timeout);
  };

  const setAudioData = (blob, file, index) => {
    changeField(`slides.${index}.recording`, false);
    changeField(`slides.${index}.recordedBlob`, blob);
    changeField(`slides.${index}.audioFile`, file);
  };

  const getAudioSource = (formValues, index) => {
    return ((formValues.slides || [])[index] || {}).recordedBlob;
  };

  const getAudioRecording = (formValues, index) => {
    return ((formValues.slides || [])[index] || {}).recording;
  };

  const getRecorderFromClick = (formValues, index) => {
    return ((formValues.slides || [])[index] || {}).recorder || {};
  };

  const getRecordingTimeout = (formValues, index) => {
    return ((formValues.slides || [])[index] || {}).recordingTimeout;
  };

  const publishSwitchOptions = {
    label: t("lessonForm.fields.publish"),
    checked: false,
  };
  const createdAt = (formValues.values || {}).createdAt;
  if (!course._id) return null;
  return (
    <Aux>
      <div style={{ paddingTop: "20px" }}>
        <Typography paragraph variant="h4" gutterBottom>
          {t("lessonForm.lessonCustomization")}
        </Typography>
        <Field
          className={classes.center}
          name="lessonName"
          type="text"
          component={TextField}
          label={t("lessonForm.fields.lessonName")}
        />
        <Field
          name="published"
          options={publishSwitchOptions}
          component={Switch}
        />
        <Field
          name="availableOnDate"
          type="dateTime"
          handleChange={(date) => changeField("availableOnDate", date)}
          component={DateTimePicker}
          fullWidth
          options={{
            disablePast: true,
            label: t("lessonForm.fields.availableOnDate"),
            minDate: createdAt,
          }}
        />
      </div>
      <FieldArray
        formValues={formValues.values}
        name="slides"
        component={renderSlides}
        course={course}
        formErrors={formErrors}
        touchField={touchField}
        t={t}
        editing={editing}
        newLessonId={newLessonId}
        changeField={changeField}
        getAudioRecording={getAudioRecording}
        getAudioSource={getAudioSource}
        setAudioData={setAudioData}
        initiateRecording={initiateRecording}
        getRecorderFromClick={getRecorderFromClick}
        getRecordingTimeout={getRecordingTimeout}
      />

      {!isValid && !formErrors.isValid && (
        <Typography
          style={{ textAlign: "center", marginBottom: "20px" }}
          gutterBottom
          color="error"
        >
          {t("lessonForm.errors.correctForm")}
        </Typography>
      )}
      <SubmitButton
        isError={!(isValid || formErrors.isValid)}
        disabled={submitting}
        clicked={onSubmit}
      >
        {editing
          ? t("lessonForm.buttons.update")
          : t("lessonForm.buttons.publish")}
      </SubmitButton>
    </Aux>
  );

}

const mapStateToProps = (state, myProps) => {
  const courseId = state.common.selectedCourse
  const courses = state.common.courses
  const course = getCourse(courses, courseId) || {}
  const lessons = course.lessons || [];
  const editing = myProps.editing;
  const instructorFileSizeLimit = state.common.configuration.instructorFileSizeLimit;
  return {
    formErrors: getFormSyncErrors("lessonForm")(state),
    loading: state.instructorLesson.loading,
    token: state.authentication.token,
    formValues: state.form.lessonForm,
    initialValues: {
      ...state.instructorLesson.loadedLessonFormData,
      instructorFileSizeLimit,
      lessons,
      course,
      slides: editing && state.instructorLesson.loadedLessonFormData ? state.instructorLesson.loadedLessonFormData.slides : [{}],
      published: editing
        ? (state.instructorLesson.loadedLessonFormData || {}).published
        : true,
    },
    editing,
    course,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewLesson: (formValues, token, editing, course, filesToDelete) => {
      dispatch(
        actions.createLessonStart(
          formValues,
          token,
          editing,
          course,
          filesToDelete
        )
      );
    },
    changeField: (field, value) => dispatch(change("lessonForm", field, value)),
    touchField: (field) => {
      dispatch(touch("lessonForm", field));
    },
    clearLessonForm: () => dispatch(actions.clearLoadedInstructorData()),
    deleteImg: (img, token) => {
      dispatch(actions.deleteFilesStart(img), token);
    },
    fetchLesson: (id, token) => {
      dispatch(actions.fetchLessonStart(id, token))
    },
  };
};

const wrappedForm = reduxForm({
  form: "lessonForm",
  enableReinitialize: true,
  destroyOnUnmount: false,
  validate: validate,
})(LessonForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrappedForm);
