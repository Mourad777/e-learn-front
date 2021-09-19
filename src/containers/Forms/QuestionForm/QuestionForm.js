import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import McQuestionForm from "../../Forms/QuestionForm/McQuestionForm";
import EssayQuestionForm from "../../Forms/QuestionForm/EssayQuestionForm";
import SpeakingQuestionForm from "../../Forms/QuestionForm/SpeakingQuestionForm";
import FillInBlankQuestionForm from "../../Forms/TestForm/FillInBlankSection/FillInBlankSection";
import Button from "@material-ui/core/Button";
import SubmitButton from "../../../components/UI/Button/SubmitButton"
import {
  Field,
  reduxForm,
  getFormValues,
  getFormSyncErrors,
  change,
  touch,
} from "redux-form";
import * as actions from "../../../store/actions/index";
import TagInput from "../../../components/UI/FormElements/TagInput/TagInput";
import DropdownSelect from "../../../components/UI/FormElements/DropdownSelect/DropdownSelect";
import TextField from "../../../components/UI/FormElements/TextField/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import validate from "./validate";
import { getUrls } from "../../../utility/getUrls";
import Spinner from "../../../components/UI/Spinner/Spinner";
import bson from "bson";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import { getInitialValues } from "../../InstructorPanel/Questions/initialValues";
import { adjustQuestionData } from "../../InstructorPanel/Questions/adjustQuestionData";
import { handleDeleteUnsavedImages } from "../../../utility/unsavedImagesHandler";

const handleWindowClose = (
  formValues, initialUrls, isUpdating, token, deleteImg, formType, questions, tests, questionType
) => {
  if (!isUpdating) handleDeleteUnsavedImages(formValues, initialUrls, isUpdating, token, deleteImg, formType, questions, tests, questionType);
  return;
};

const QuestionForm = ({
  editing,
  formValues = {},
  formErrors,
  course,
  selectedCourse,
  questions,
  submitQuestion,
  deleteQuestion,
  questionType,
  changeField,
  touchField,
  loadedQuestion,
  loading,
  deleteImg,
  clearQuestionForm,
  setQuestionForm,
  fetchQuestionBank,
  match,
  history,
}) => {
  const { t } = useTranslation();
  const tests = course.tests;
  const [initialUrls, setInitialUrls] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [latestFillBlankAnswers, setLatestFillBlankAnswers] = useState(
    []
  );
  const [latestFillBlankErrors, setLatestFillBlankErrors] = useState([]);
  const [newQuestionId, setNewQuestionId] = useState(null);

  const token = localStorage.getItem('token');

  const latestFV = useRef();
  const latestIsUp = useRef();

  const currentInitialUrls = useRef();
  currentInitialUrls.current = initialUrls;

  const currentTests = useRef();
  currentTests.current = tests;

  const currentQuestionType = useRef();
  currentQuestionType.current = questionType;

  useEffect(() => {
    const formType = "questionForm"
    window.addEventListener("beforeunload", (e) =>
      { 
        handleWindowClose(latestFV.current, currentInitialUrls.current, latestIsUp.current, token, deleteImg, formType, null, currentTests.current, currentQuestionType.current)}
    );
    fetchQuestionBank(selectedCourse, token);
    setNewQuestionId(!editing ? new bson.ObjectId().toHexString() : null);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      if (!latestIsUp.current) handleDeleteUnsavedImages(latestFV.current, currentInitialUrls.current, latestIsUp.current, token, deleteImg, formType, null, currentTests.current, currentQuestionType.current)

      clearQuestionForm();
    }
  }, [])

  useEffect(() => {
    latestFV.current = formValues;
    latestIsUp.current = isUpdating;
  }, [formValues, isUpdating]);

  useEffect(() => {
    const questionId = match.params.questionId
    if (!questions) return
    const qType = match.params.qType
    if (qType) {
      setQuestionForm(qType, false, getInitialValues(qType, t));
    }
    if (questionId) {
      const q = (questions || []).find(
        (q) => q._id === questionId
      );
      if (q) {
        setQuestionForm(q.type, false, adjustQuestionData(q));
      }
    }

  }, [questions])

  useEffect(() => {
    if (isUpdating) {
      //get test urls to make sure to not delete a file that
      //is being used in tests
      const testUrls = getUrls(tests, "courseTests") || [];
      const updatedUrls = getUrls(
        formValues,
        "questionForm",
        questionType
      ).filter((updatedUrl) => {
        if (!testUrls.includes(updatedUrl)) return updatedUrl;
        return null;
      });
      const filesToDelete = (initialUrls || [])
        .filter((initialUrl) => {
          if (!updatedUrls.includes(initialUrl)) return initialUrl;
          return null;
        })
        .filter((item) => {
          //check urls in test documents to make sure the files arn't used elsewhere
          if (!testUrls.includes(item)) return item;
          return null;
        });
      submitQuestion(
        editing ? formValues : { ...formValues, _id: newQuestionId },
        token,
        editing,
        course._id,
        filesToDelete,
        questionType
      );
    }
  }, [isUpdating]);

  const dropdownOptions = [
    { value: "easy", primaryText: t("questionForm.fields.easy") },
    { value: "medium", primaryText: t("questionForm.fields.medium") },
    { value: "hard", primaryText: t("questionForm.fields.hard") },
  ];

  useEffect(() => {
    const initialUrls = getUrls(loadedQuestion, "questionForm", questionType);
    setInitialUrls(initialUrls);

  }, [loadedQuestion]);

  useEffect(() => {
    const latestAnswers = (formValues.fillBlankQuestions || {}).answers;
    const latestErrors = (formErrors.fillBlankQuestions || {}).answers;
    setLatestFillBlankAnswers(latestAnswers);
    setLatestFillBlankErrors(latestErrors);
  }, [formValues, formErrors]);


  const validateForm = () => {
    if (formValues.mcQuestion) {
      touchField("mcQuestion.question");
      touchField("mcQuestion.correctAnswers");
    }
    if (formValues.essayQuestion) touchField("essayQuestion.question");
    if (formValues.speakingQuestion) {
      touchField("speakingQuestion.0.question");
      touchField("speakingQuestion.0.recordedBlob");
      touchField("speakingQuestion.0.questionRecordedBlob");
    }
    if (formValues.fillBlankQuestions) {
      Array.from(latestFillBlankAnswers).forEach((question, index) => {
        touchField(`fillBlankQuestions.answers.${index}.browserAudioFile`);
        touchField(
          `fillBlankQuestions.answers.${index}.answerOptions.incorrectAnswerThree`
        );
      });
    }
    if (formValues.mcQuestion && formErrors.mcQuestionError) return false;
    if (formValues.essayQuestion && formErrors.essayQuestionError) return false;
    if (formValues.speakingQuestion && formErrors.speakingQuestionError)
      return false;
    if (formValues.fillBlankQuestions) {
      const areAnswerErrors = latestFillBlankAnswers.map((answer, index) => {
        if (
          (((latestFillBlankErrors || [])[index] || {}).answerOptions || {})
            .incorrectAnswerThree ||
          ((latestFillBlankErrors || [])[index] || {}).browserAudioFile
        ) {
          return "error";
        }
        return null;
      });
      const isQuestionError = (formErrors.fillBlankQuestions || {}).question;
      if (areAnswerErrors.includes("error") || "" || isQuestionError)
        return false;
    }
    return true;
  };

  const onSubmit = () => {
    //check if files to delete are not in test documents
    const formIsValid = validateForm();

    if (!formIsValid) {
      setIsValid(false);
      return;
    }

    setIsUpdating(true);
  };
  const qId = editing ? formValues._id : newQuestionId
  const path = `courses/${course._id}/questions/${qId}`;
  if (!(course || {})._id || !qId) return null;
  return (
    <Aux>
      <Spinner active={loading} transparent />
      {questionType === "mc" && (
        <McQuestionForm path={path} question={questionType} />
      )}
      {questionType === "essay" && (
        <EssayQuestionForm path={path} question={questionType} />
      )}
      {questionType === "speaking" && (
        <SpeakingQuestionForm path={path} question={questionType} />
      )}
      {questionType === "fillInBlank" && (
        <FillInBlankQuestionForm
          path={path}
          isModal
          form="questionForm"
          question={questionType}
        />
      )}
      <Divider />
      <div style={{ display: "flex", marginTop: 10 }}>
        <Field
          name="difficulty"
          simple
          component={DropdownSelect}
          options={dropdownOptions}
          textLabel={t("questionForm.fields.difficulty")}
          defaultValue="medium"
        />
        <Field
          component={TextField}
          name="language"
          label={t("questionForm.fields.language")}
          simple
          textLabel
          language
          fullWidth
        />
      </div>
      <Field
        name="tags"
        label={t("questionForm.fields.tags")}
        component={TagInput}
        onTagChange={(tags) => {
          changeField("tags", tags);
        }}
        tagValues={(formValues || {}).tags || []}
      />
      <Divider />
      {!isValid && !validateForm() && (
        <Typography
          style={{ textAlign: "center", marginBottom: "20px" }}
          gutterBottom
          color="error"
        >
          {t("questionForm.errors.correctForm")}
        </Typography>
      )}
      <SubmitButton
        isError={!(isValid || validateForm())}
        clicked={onSubmit}
      >
        {editing
          ? t("questionForm.buttons.updateQuestion")
          : t("questionForm.buttons.saveQuestion")}
      </SubmitButton>
      {editing && (
        <Button
          fullWidth
          color="secondary"
          onClick={() =>
            deleteQuestion((formValues || {})._id, token, course._id)
          }
        >
          {t("questionForm.buttons.removeQuestion")}
        </Button>
      )}
    </Aux>
  );
};

const mapStateToProps = (state) => {
  const instructorFileSizeLimit =
    state.common.configuration.instructorFileSizeLimit;
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse);
  return {
    formValues: getFormValues("questionForm")(state),
    formErrors: getFormSyncErrors("questionForm")(state),
    token: state.authentication.token,
    selectedCourse: state.common.selectedCourse,
    course: populatedCourse,
    questionType: state.instructorQuestion.creatingQuestionType,
    initialValues: {
      ...state.instructorQuestion.loadedQuestionFormData,
      instructorFileSizeLimit,
    },
    loading: state.instructorQuestion.loading,
    loadedQuestion: state.instructorQuestion.loadedQuestionFormData,
    questions: state.instructorQuestion.questionBank,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (field, value) => {
      dispatch(change("questionForm", field, value));
    },
    touchField: (field) => {
      dispatch(touch("questionForm", field));
    },
    submitQuestion: (
      formValues,
      token,
      editing,
      courseId,
      filesToDelete,
      questionType
    ) => {
      dispatch(
        actions.createUpdateQuestionStart(
          formValues,
          questionType,
          token,
          editing,
          courseId,
          filesToDelete
        )
      );
    },
    deleteQuestion: (questionId, token, courseId) => {
      dispatch(actions.deleteQuestionStart(questionId, token, courseId));
    },
    deleteImg: (img, token) => {
      dispatch(actions.deleteFilesStart(img), token);
    },
    clearQuestionForm: () => dispatch(actions.clearLoadedInstructorData()),
    setQuestionForm: (qType, editing, questionFormData) => {
      dispatch(
        actions.setQuestionForm(qType, editing ? true : false, questionFormData)
      );
      // dispatch(actions.openModal({ qType, questionFormData }, "question"));
    },
    fetchQuestionBank: (courseId, token) =>
      dispatch(actions.fetchQuestionBankStart(courseId, token)),
  };
};

const wrappedForm = reduxForm({
  form: "questionForm",
  enableReinitialize: true,
  validate: validate,
})(QuestionForm);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
