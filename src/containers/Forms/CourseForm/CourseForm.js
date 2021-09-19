import React, { useState, useEffect, useRef } from "react";
import { reduxForm, getFormValues, getFormSyncErrors, touch } from "redux-form";
import { validate } from "./validate";
import Button from "@material-ui/core/Button";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Typography from "@material-ui/core/Typography";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import Steps from "../../../components/UI/Steps/Steps";
import Spinner from "../../../components/UI/Spinner/Spinner";
import bson from "bson";
import { getUrls } from "../../../utility/getUrls";
import { useTranslation } from "react-i18next";
import { handleDeleteUnsavedImages } from "../../../utility/unsavedImagesHandler";
import SubmitButton from "../../../components/UI/Button/SubmitButton";


const handleWindowClose = (formValues, initialUrls, isUpdating, token, deleteImg, formType) => {
 if (!isUpdating) handleDeleteUnsavedImages(formValues, initialUrls, isUpdating, token, deleteImg, formType);
  return;
};

const CourseForm = ({
  editing,
  deleteImg,
  classes,
  page,
  loadedUser,
  formValues,
  formErrors,
  setCourseFormPage,
  touchField,
  loading,
  submitCourse,
  initialValues,
  setCourseForm,
  fetchCourse,
  match,
  history,
}) => {
  const isAccountActivated = (loadedUser || {}).isAccountActivated;
  const token = localStorage.getItem('token');
  const [initialUrls, setInitialUrls] = useState([]);
  const [newCourseId, setNewCourseId] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { t } = useTranslation('common');

  const currentInitialUrls = useRef();
  currentInitialUrls.current = initialUrls;

  const currentFormValues = useRef();
  currentFormValues.current = formValues;

  const currentIsUpdating = useRef();
  currentIsUpdating.current = isUpdating;

  useEffect(() => {
    //set the initial urls
    const initialUrls = getCourseUrls(
      initialValues,
      "isInitialValues"
    );
    setInitialUrls(initialUrls);

  }, [initialValues])

  useEffect(() => {
    setNewCourseId(!editing
      ? new bson.ObjectId().toHexString()
      : null);
    if (!editing) {
      setCourseForm({})
    } else {
      fetchCourse(match.params.courseIdEditing, token)
    }
    const formType = "courseForm";
    window.addEventListener("beforeunload", () => handleWindowClose(currentFormValues.current, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType));
    return () => {
      setCourseFormPage(1)
      window.removeEventListener("beforeunload", handleWindowClose);
      if (!currentIsUpdating.current) {
        handleDeleteUnsavedImages(currentFormValues.current, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType);
      }
    }
  }, [])

  const getCourseUrls = (values = {}) => {
    const initialUrls = [];
    const urls = getUrls(values.syllabus);
    (urls || []).forEach((url) => {
      if (url) {
        initialUrls.push(
          url.match(
            new RegExp(process.env.REACT_APP_AWS_URL + "(.*)" + "\\?X-Amz")
          )[1]
        );
      }
    });

    initialUrls.push(values.courseImage);
    return initialUrls;
  }
  const checkPageValidity = (formValues = {}, formErrors = {}, page, touchField) => {
    if (page === 1) {
      touchField("courseName");
      touchField("courseImage");
    }
    if (page === 2) {
      [
        "enrollmentPeriod",
        "courseTimeline",
        "courseDropDeadline",
      ].forEach((field) => touchField(field));
    }
    if (page === 3) {
      (formValues.irregularOfficeHours || []).forEach((officeHour, index) => {
        touchField(`irregularOfficeHours.${index}.date`);
        touchField(`irregularOfficeHours.${index}.timeRange`);
      });
      ((formValues.regularOfficeHours || {}).days || []).forEach(
        (day, index) => {
          touchField(`regularOfficeHours.times.${day}.timeRange`);
        }
      );
    }

    //block next page button
    if (page === 1 && formErrors.pageOne) {
      setIsValid(false)
      return false;
    }
    if (page === 2 && formErrors.pageTwo) {
      setIsValid(false)
      return false;
    }
    if (page === 3 && formErrors.pageThree) {
      setIsValid(false)
      return false;
    }
    setIsValid(true)
    return true;
  }

  const getButtons = (
    page,
    classes,
    formValues,
    formErrors,
    setCourseFormPage,
    touchField,
    isError
  ) => {
    return (
      <div
        style={
          page !== 1 ? {
            display: "flex",
            justifyContent: "space-between",
          } : {
            display: "flex",
            justifyContent: "flex-end",
          }
        }
      >
        {page !== 1 && (
          <Button
            color="primary"
            onClick={() => {
              setCourseFormPage(page - 1);
              setIsValid(true); //will reset the next button to blue color
            }}
            startIcon={<ArrowBackIosIcon />}
          >
            {""}
          </Button>
        )}
        {page !== 4 && (
          <Button
            onClick={() => {
              const valid = checkPageValidity(
                formValues,
                formErrors,
                page,
                touchField
              );
              if (!valid) return;
              setCourseFormPage(page + 1);
            }}
            color={!isError ? "primary" : "secondary"}
            startIcon={<ArrowForwardIosIcon />}
          >
            {""}
          </Button>
        )}
      </div>
    );
  }

  const onSubmit = () => {
    setIsUpdating(true)
    const updatedUrls = getCourseUrls(formValues);
    const filesToDelete = (initialUrls || []).filter(
      (initialUrl) => {
        if (!updatedUrls.includes(initialUrl)) return initialUrl;
      }
    );
    submitCourse(
      formValues,
      token,
      editing,
      editing
        ? initialValues._id
        : newCourseId,
      filesToDelete,
      history,
    );
  };
  const stepOneCompleted = !formErrors.courseName && !formErrors.courseImage;
  const courseCreateDate = (formValues || {}).createdAt || null;
  const isError = !(
    isValid ||
    (!formErrors.pageOne &&
      !formErrors.pageTwo &&
      !formErrors.pageThree &&
      !formErrors.pageFour)
  );
  if (!loadedUser) return null;
  if (!isAccountActivated && !loading && loadedUser) return <Typography color="secondary" align="center" >{t('layout.accountNotYetActivated')}</Typography>
  return (
    <div style={{ margin: "auto", padding: '0 15px 0 15x' }}>
      <Spinner active={loading} transparent />
      <Steps
        size="small"
        stepsLabels={["1", "2", "3", "4"]}
        activeStep={page - 1}
        completed={stepOneCompleted ? [0] : null}
      />
      <div>
        {page === 1 && (
          <StepOne
            page={page}
            nextPage={() => setCourseFormPage(2)}
            isImage={(formValues || {}).courseImage}
            createdAt={courseCreateDate}
          />
        )}
        {page === 2 && (
          <StepTwo
            page={page}
            previousPage={() => setCourseFormPage(1)}
            nextPage={() => setCourseFormPage(3)}
            createdAt={courseCreateDate}
          />
        )}
        {page === 3 && (
          <StepThree
            page={page}
            previousPage={() => setCourseFormPage(2)}
            nextPage={() => setCourseFormPage(4)}
            createdAt={courseCreateDate}
          />
        )}
        {page === 4 && (
          <StepFour
            page={page}
            previousPage={() => setCourseFormPage(3)}
            newCourseId={newCourseId}
          />
        )}
        {isError && (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <Typography color="error">
              {t("courseForm.errors.correctForm")}
            </Typography>
          </div>
        )}
      </div>

      {getButtons(
        page,
        classes,
        formValues,
        formErrors,
        setCourseFormPage,
        touchField,
        isError
      )}
      {page === 4 && (
        <SubmitButton
          // isError={!(isValid || formErrors.isValid)}
          // disabled={submitting}
          clicked={onSubmit}
        >
          {editing ? t("courseForm.buttons.update") : t("courseForm.buttons.publish")}
        </SubmitButton>

      )}
    </div>
  );

}

const mapStateToProps = (state, myProps) => {
  const initialValues = state.instructorCourse.loadedCourseFormData;
  const instructorCourses = state.common.courses;
  const editing = myProps.editing
  return {
    formValues: getFormValues("courseForm")(state),
    formErrors: getFormSyncErrors("courseForm")(state),
    token: state.authentication.token,
    editing: editing,
    page: state.instructorCourse.courseFormPage,
    initialValues: editing
      ? { ...initialValues, instructorCourses }
      : { instructorCourses: instructorCourses, courseActive: true, regularOfficeHours: { days: [], times: {} }, irregularOfficeHours: [] },
    loading: state.instructorCourse.loading,
    loadedUser: state.authentication.loadedUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseFormPage: (page) => {
      dispatch(actions.setCourseFormPage(page));
    },
    submitCourse: (formValues, token, editing, courseId, filesToDelete, history) => {
      dispatch(
        actions.createUpdateCourseStart(
          formValues,
          token,
          editing,
          courseId,
          null,
          filesToDelete,
          history
        )
      );
    },
    touchField: (field) => {
      dispatch(touch("courseForm", field));
    },
    clearCourseForm: () => dispatch(actions.clearLoadedInstructorData()),
    setCourseForm: () => {
      dispatch(actions.setCreateCourseForm({}));
    },
    deleteImg: (img, token) => {
      dispatch(actions.deleteFilesStart(img), token);
    },
    fetchCourse: (id, token) => dispatch(actions.fetchCourseStart(id, token)),
  };
};

const wrappedForm = reduxForm({
  form: "courseForm",
  enableReinitialize: true,
  validate: validate,
  // forceUnregisterOnUnmount:true,
  destroyOnUnmount: true,
})(CourseForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrappedForm);
