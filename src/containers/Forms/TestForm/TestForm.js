import React, { useState, useEffect, useRef } from "react";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import { reduxForm, getFormSyncErrors, touch, getFormValues } from "redux-form";
import { getUrls } from "../../../utility/getUrls";
import Stepper from "../../../components/UI/Steps/Steps";
import TestInfoStepOne from "./TestInfoSection/TestInfoStepOne";
import TestInfoStepTwo from "./TestInfoSection/TestInfoStepTwo";
import TestInfoStepThree from "./TestInfoSection/TestInfoStepThree";
import TestInfoStepFour from "./TestInfoSection/TestInfoStepFour";
import MultipleChoiceSection from "./MultipleChoiceSection/MultipleChoiceSection";
import EssaySection from "./EssaySection/EssaySection";
import FillInBlankSection from "./FillInBlankSection/FillInBlankSection";
import SpeakingSection from "./SpeakingSection/SpeakingSection";
import validate from "./validate";
import classes from "./TestForm.module.css";
import Typography from "@material-ui/core/Typography";
import Spinner from "../../../components/UI/Spinner/Spinner";
import bson from "bson";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import { useLocation, matchPath } from "react-router-dom";
import { getSectionPages } from "./util/getSectionPages";
import { getTestSection } from "./util/getTestSection";
import { getButtons } from "./util/getButtons";
import { getInitialValues } from "./util/getinitialValues";
import { checkFormErrors } from "./util/checkFormErrors";
// import { handleUnsavedImages } from "./util/handleUnsavedImages"
import { checkValidity } from "./util/checkValidity";
import { handleDeleteUnsavedImages } from "../../../utility/unsavedImagesHandler";

const handleWindowClose = (formValues, initialUrls, isUpdating, token, deleteImg, formType, questions) => {
  if (!isUpdating) handleDeleteUnsavedImages(formValues, initialUrls, isUpdating, token, deleteImg, formType, questions);
  return;
};

const TestForm = ({
  clearTestForm,
  editing,
  initialValues,
  deleteImg,
  addNewTest,
  formValues = {},
  course,
  selectedCourse,
  userId,
  questions,
  students,
  setTestSection,
  setQuestionEditing,
  addQuestionToTest,
  loading,
  isTest,
  formErrors,
  testFormSection,
  touchField,
  fetchTest,
  fetchQuestionBank,
}) => {
  const { t } = useTranslation("common")
  const currentLocation = useLocation().pathname
  const [page, setPage] = useState(1);
  const [initialUrls, setInitialUrls] = useState([]);
  const [latestFillBlankAnswers, setLatestFillBlankAnswers] = useState([]);
  const [newTestId, setNewTestId] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isBlockedByStudent, setisBlockedByStudent] = useState(false);

  const token = localStorage.getItem('token');

  const latestFillBlankAnswersRef = useRef();
  latestFillBlankAnswersRef.current = latestFillBlankAnswers;

  const currentInitialUrls = useRef();
  currentInitialUrls.current = initialUrls;

  const currentFormValues = useRef();
  currentFormValues.current = formValues;

  const currentIsUpdating = useRef();
  currentIsUpdating.current = isUpdating;

  const currentQuestions = useRef();
  currentQuestions.current = questions;


  useEffect(() => {
    fetchQuestionBank(selectedCourse,token)
  }, [])

  useEffect(() => {
    //need to listen to initial values since they arrive from the server if editing
    const initialUrls = getUrls(initialValues, "testForm");
    setInitialUrls(initialUrls);
  }, [initialValues])

  useEffect(() => {
    setLatestFillBlankAnswers(
      ((formValues || {}).fillBlankQuestions || {}
      ).answers)
  }, [formValues])

  useEffect(() => {
    if (editing) {
      let testId;
      const match = matchPath(currentLocation, {
        path: `/instructor-panel/course/:courseId/${isTest ? 'test/:testId' : 'assignment/:assignmentId'}/edit`,
        exact: false,
      });
      if (match) {
        testId = match.params[isTest ? 'testId' : 'assignmentId']
        fetchTest(testId, token)
      }
    }
    const formType = "testForm";
    window.addEventListener("beforeunload",()=> handleWindowClose(currentFormValues.current, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType, currentQuestions.current));
    setNewTestId(!editing ? new bson.ObjectId().toHexString() : null)

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      if (!currentIsUpdating.current) handleDeleteUnsavedImages(currentFormValues.current, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType, currentQuestions.current)
      // if (!isUpdating) handleUnsavedImages(formValues, questions, deleteImg);
      clearTestForm();
    }
  }, [])

  useEffect(() => {
    if (!isUpdating) return
    const questionUrls = getUrls(questions, "courseQuestions") || [];
    const updatedUrls = getUrls(formValues, "testForm") || [];
    const filesToDelete = (initialUrls || [])
      .filter((initialUrl) => {
        if (!updatedUrls.includes(initialUrl)) return initialUrl;
        return null;
      })
      .filter((item) => {
        //check urls in question documents to make sure the files arn't used elsewhere
        if (!questionUrls.includes(item)) return item;
        return null;
      });
    addNewTest(
      formValues,
      token,
      editing,
      course._id,
      userId,
      editing ? initialValues._id : newTestId,
      isTest ? "test" : "assignment",
      filesToDelete
    );
  }, [isUpdating])

  const testSections = (formValues || {}).testSections || [];
  const isMcSection = testSections.findIndex((item) => item === "mc") > -1;
  const isEssaySection = testSections.findIndex((item) => item === "essay") > -1;
  const isSpeakingSection = testSections.findIndex((item) => item === "speaking") > -1;
  const isFillBlankSection = testSections.findIndex((item) => item === "fillblanks") > -1;
  const formPages = testSections.length + 4;

  const { essaySectionPage, speakingSectionPage, fillBlankSectionPage } = getSectionPages(isMcSection, isEssaySection, formPages);
  useEffect(() => {
    setTestSection(getTestSection(
      page,
      isMcSection,
      isEssaySection,
      isSpeakingSection,
      isFillBlankSection,
      essaySectionPage,
      speakingSectionPage,
      fillBlankSectionPage,
    ))

  }, [page])

  useEffect(() => {
    checkValidity(isValid, testFormSection, formErrors)
  }, [formErrors])

  const onSubmit = () => {
    const valid = checkFormErrors(
      formValues,
      page,
      isTest,
      testFormSection,
      latestFillBlankAnswersRef,
      validate,
      touchField,
      setIsValid,
    );
    if (!valid) return;

    const testsAttempted = [];
    students.forEach((s) => {
      s.testResults.forEach((r) => {
        testsAttempted.push(r.test);
      });
    });

    if (editing && testsAttempted.includes(initialValues._id)) {
      setisBlockedByStudent(true)
      return;
    }
    setIsUpdating(true)
  };

  const nextPage = () => {
    setPage(prevPage => prevPage + 1)
  };

  const previousPage = () => {
    setPage(prevPage => prevPage - 1)
  };


  const resetFormValidity = () => {
    setIsValid(true)

  };
  const path = `courses/${course._id}/tests/${editing ? formValues._id : newTestId}`;
  return (
    <div className={classes.Background}>
      <Spinner active={loading} transparent />
      <Stepper
        activeStep={page - 1}
        steps={formPages + 1}
        progress
      />
      <div style={{ paddingTop: "20px" }}>
        {page === 1 && <TestInfoStepOne isTest={isTest} />}
        {page === 2 && <TestInfoStepTwo isTest={isTest} />}
        {page === 3 && <TestInfoStepThree isTest={isTest} />}
        {page === 4 && <TestInfoStepFour path={path} isTest={isTest} />}
        {page === 5 && isMcSection && (
          <MultipleChoiceSection
            path={path}
            questions={questions}
            setQuestionEditing={(id) => setQuestionEditing(id)}
            addQuestionToTest={(question, index) =>
              addQuestionToTest(question, index)
            }
          />
        )}
        {page === essaySectionPage && isEssaySection && (
          <EssaySection
            path={path}
            questions={questions}
            setQuestionEditing={(id) => setQuestionEditing(id)}
            addQuestionToTest={(question, index) =>
              addQuestionToTest(question, index)
            }
          />
        )}
        {page === speakingSectionPage && isSpeakingSection && (
          <SpeakingSection
            path={path}
            questions={questions}
            setQuestionEditing={(id) => setQuestionEditing(id)}
            addQuestionToTest={(question, index) =>
              addQuestionToTest(question, index)
            }
          />
        )}
        {page === fillBlankSectionPage && isFillBlankSection && (
          <FillInBlankSection
            path={path}
            form="testForm"
            questions={questions}
            setQuestionEditing={(id) => setQuestionEditing(id)}
            addQuestionToTest={(question, index) =>
              addQuestionToTest(question, index)
            }
          />
        )}
      </div>
      {!checkValidity(isValid, testFormSection, formErrors) && (
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Typography color="error">{t('testForm.errors.correctForm')}</Typography>
        </div>
      )}
      {isBlockedByStudent && editing && (
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Typography
            variant="caption"
            color="error"
          >
            {initialValues.assignment ? t("testForm.errors.studentTakingAssignment") : t("testForm.errors.studentTakingTest")}
          </Typography>
        </div>
      )}
      {getButtons(page, formPages, null, editing, !checkValidity(isValid, testFormSection, formErrors), t, previousPage, nextPage, resetFormValidity, () => checkFormErrors(

        formValues,
        page,
        isTest,
        testFormSection,
        latestFillBlankAnswersRef,
        validate,
        touchField,
        setIsValid,
      ), isBlockedByStudent, onSubmit)}
    </div>
  );
}

const mapStateToProps = (state, myProps) => {
  const course = getCourse(state.common.courses, state.common.selectedCourse);
  const students = (course.studentsEnrollRequests||[]).map(rq=>rq.student);
  return {
    formValues: getFormValues("testForm")(state),
    formErrors: getFormSyncErrors("testForm")(state),
    token: state.authentication.token,
    userId: state.authentication.userId,
    initialValues: getInitialValues(state, myProps),
    selectedCourse:state.common.selectedCourse,
    course,
    testForm: state.form.testForm,
    testFormSection: state.instructorTest.testFormSection,
    section: state.instructorTest.testSection,
    coursePanel: state.common.coursePanel,
    questions: state.instructorQuestion.questionBank,
    loading: state.instructorTest.loading,
    students: students,
    loadedTest: state.instructorTest.loadedTestFormData,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewTest: (
      formValues,
      token,
      editing,
      courseId,
      userId,
      testId,
      formType,
      oldTest
    ) => {
      dispatch(
        actions.createUpdateTestStart(
          formValues,
          token,
          editing,
          courseId,
          userId,
          testId,
          formType,
          oldTest
        )
      );
    },
    clearTestForm: () => dispatch(actions.clearLoadedInstructorData()),
    setTestSection: (section) => dispatch(actions.setTestFormSection(section)),
    touchField: (field) => {
      dispatch(touch("testForm", field));
    },
    deleteImg: (img, token) => {
      dispatch(actions.deleteFilesStart(img), token);
    },
    fetchTest: (id, token) => {
      dispatch(actions.fetchTestStart(id, false, token));
    },
    fetchQuestionBank: (courseId, token) =>
      dispatch(actions.fetchQuestionBankStart(courseId, token)),

  };
};

const wrappedForm = reduxForm({
  form: "testForm",
  enableReinitialize: true,
  validate: validate,
  destroyOnUnmount: false,
  // forceUnregisterOnUnmount: true,
})(TestForm);

export default connect(mapStateToProps, mapDispatchToProps)((wrappedForm));