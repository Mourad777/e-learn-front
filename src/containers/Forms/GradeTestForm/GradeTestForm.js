import React, { useEffect, useState, useRef } from "react";
import {
  Field,
  reduxForm,
  change,
  getFormValues,
  getFormSyncErrors,
  touch,
} from "redux-form";
import { OutlinedInput } from "@material-ui/core";
import validate from "./validate";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import Button from "@material-ui/core/Button";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Switch from "../../../components/UI/Switch/Switch";
import NumberPicker from "../../../components/UI/FormElements/NumberPicker/NumberPicker";
import MultiLineField from "../../../components/UI/FormElements/MultiLineField/MultiLineField";
import McSection from "./MultipleChoice";
import EssaySection from "./Essay";
import SpeakingSection from "./Speaking";
import FillInBlankSection from "./FillInBlank";
import Summary from "./Summary";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { getUrls } from "../../../utility/getUrls";
import TestMaterials from "../../StudentPanel/Test/TestMaterials/TestMaterials";
import Accordion from "../../../components/UI/Accordion/Accordion";
import { getTestRecources } from "../../../utility/getTestResources";
import { previewAudio } from "../../../utility/audioRecorder";
import TestInfo from "./TestInfo/TestInfo";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import setInitialValues from "../../InstructorPanel/GradeDetail/setInitialGradeValues"
import SubmitButton from "../../../components/UI/Button/SubmitButton";
import { handleDeleteUnsavedImages } from "../../../utility/unsavedImagesHandler";

const handleWindowClose = (formValues, initialUrls, isUpdating, token, deleteImg, formType) => {
  if (!isUpdating) handleDeleteUnsavedImages(formValues, initialUrls, isUpdating, token, deleteImg, formType);
};

const GradeTestForm = ({
  formValues = {},
  initialValues,
  notifications,
  clearTestGrading,
  postGrades,
  errors,
  test = {},
  results = {},
  student = {},
  loading,
  studentGrading,
  testGrading,
  course = {},
  markAsSeen,
  deleteImg,
  touchField,
  changeField,
  history,
}) => {
  const [initialUrls, setInitialUrls] = useState([]);
  const [confirmCheckBox, setConfirmCheckBox] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [micBlockedWarning, setMicBlockedWarning] = useState(false);
  const [micBlockedWarningTO, setMicBlockedWarningTO] = useState(null);
  const token = localStorage.getItem('token');

  const currentInitialUrls = useRef();
  currentInitialUrls.current = initialUrls;

  const currentFormValues = useRef();
  currentFormValues.current = formValues;

  const currentIsUpdating = useRef();
  currentIsUpdating.current = isUpdating;

  const { t } = useTranslation('common')

  const isError = !(errors || {}).isValid && !isValid;
  const mcSectionStudentInput = results.multiplechoiceSection;
  const essaySectionStudentInput = results.essaySection;
  const speakingSectionStudentInput = results.speakingSection;
  const fillblankSectionStudentInput = results.fillInBlanksSection;
  const fillInBlanksStudentAnswers = (fillblankSectionStudentInput || {})
    .answers;
  const filePath = `courses/${course._id}/tests/${test._id}/results/${results._id}`;

  const handleMicAlert = () => {
    clearTimeout(micBlockedWarningTO);
    setMicBlockedWarning(true)

    const timeoutId = setTimeout(() => {
      setMicBlockedWarning(false)
    }, 5000);
    setMicBlockedWarningTO(timeoutId)
  };

  useEffect(()=>{
    const formType = "gradeTestForm"
    window.addEventListener("beforeunload",()=> handleWindowClose(currentFormValues.current, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType));
    const notificationToMark = (notifications || []).find((n) => {
      if (
        n.fromUser === studentGrading &&
        n.documentId === testGrading &&
        (n.documentType === "testSubmitted" ||
          n.documentType === "assignmentSubmitted")
      )
        return n;
    });

    if (notificationToMark) {
      markAsSeen(notificationToMark._id, token);
    }
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);

      if (!currentIsUpdating.current) handleDeleteUnsavedImages(currentFormValues.current, currentInitialUrls.current, currentIsUpdating.current, token, deleteImg, formType)

      clearTimeout(micBlockedWarningTO);
    }
  },[])

  useEffect(() => {
    //set the initial urls
    const initialUrls = getUrls(initialValues, "gradeTest");
    setInitialUrls(initialUrls)

  }, [initialValues])

  const handleSubmit = (submissionType, results, test, errors, filePath) => {
    touchField("latePenalty");
    touchField("gradeAdjusted");
    setIsUpdating(true);
    if (!errors.isValid) {
      setValidity(false);
      return;
    }
    postGrades(
      formValues,
      token,
      studentGrading,
      test,
      submissionType === "post" ? true : false,
      true,
      getSectionGrades(test),
      submissionType === "post" ? false : true,
      getFinalGrade(test),
      getFilesToDelete(formValues, results),
      filePath,
      history,
    );

    clearTestGrading();
  };

  const getFilesToDelete = (updatedValues, testResult) => {
    const studentAnswersUrls = getUrls(testResult, "gradeTestAnswers") || [];
    //making sure to not delete file from student answer while instructor
    //corrects the test, the instructor can remove the image from correction
    //but a copy of the students answer must remain intact
    const updatedUrls = getUrls(updatedValues, "gradeTest");
    const filesToDelete = (initialUrls || []).filter(
      (initialUrl) => {
        if (
          !updatedUrls.includes(initialUrl) &&
          !studentAnswersUrls.includes(initialUrl)
        ) {
          return initialUrl;
        }
      }
    );
    return filesToDelete;
  }

  const handleCheckboxChange = (event) => {
    setConfirmCheckBox(confirmCheckBox => !confirmCheckBox)
  };


  const getTestSections = (type) => {
    if (type === "camelCase") {
      return ["multipleChoice", "essay", "speaking", "fillInBlanks"];
    }
    if (type === "camelCaseSection") {
      return [
        "mcSection",
        "essaySection",
        "speakingSection",
        "fillInBlankSection",
      ];
    }
    if (type === "camelCaseQuestions") {
      return [
        "multipleChoiceQuestions",
        "essayQuestions",
        "speakingQuestions",
        "fillInBlanksQuestions",
      ];
    }
    return [
      "Multiple-choice section",
      "Essay section",
      "Speaking section",
      "Fill-in-the-blanks section",
    ];
  }

  const getTotalMarks = (test, section) => {
    const totalMarks = getTestSections("camelCaseQuestions")
      .map((sectionQuestions, index) => {
        const sections = getTestSections("camelCase");
        if (section === sections[index]) {
          return (index !== 3
            ? (test || {})[sectionQuestions] || []
            : ((test || {})[sectionQuestions] || {}).blanks || []
          ).reduce((a, b) => {
            return a + b.marks;
          }, 0);
        }
      })
      .find((item) => item);
    return totalMarks || 0;
  }

  const getDaysLate = (test, results) => {
    if (test) return;
    if (!(test || {}).allowLateSubmission) return;
    if (parseInt((results || {}).submittedOn) < parseInt((test || {}).dueDate))
      return;
    const timeStampDifference =
      parseInt((results || {}).submittedOn) - parseInt((test || {}).dueDate);
    const daysLate = timeStampDifference / (1000 * 60 * 60 * 24);
    return Math.ceil(daysLate);
  }

  const getStudentSectionMarks = (section) => {
    const sectionMarks = getTestSections("camelCase")
      .map((item, index) => {
        if (section === item) {
          const sectionValues = (
            (
              (formValues || {})[
              getTestSections("camelCaseSection")[index]
              ] || []
            ).map((item) => (item.marks === "" ? 0 : parseFloat(item.marks))) ||
            []
          ).reduce((a, b) => a + b, 0);
          return sectionValues;
        }
      })
      .find((item) => item);
    return sectionMarks || 0;
  }

  const initiateRecording = (recorder, timeout, index, isRecording) => {
    if (!isRecording) {
      handleMicAlert();
      return;
    }
    changeField(`speakingSection.${index}.recording`, isRecording);
    changeField(`speakingSection.${index}.recorder`, recorder);
    changeField(`speakingSection.${index}.recorderTimeout`, timeout);
  };

  const setAudioData = (blob, file, index) => {
    changeField(`speakingSection.${index}.recording`, false);
    changeField(`speakingSection.${index}.recordedBlob`, blob);
    changeField(`speakingSection.${index}.audioFile`, file);
  };

  const getRecordingTimeout = (index) => {
    return ((formValues.speakingSection || [])[index] || {}).recorderTimeout;
  }

  const getRecorderFromClick = (index) => {
    return ((formValues.speakingSection || [])[index] || {}).recorder;
  }

  const getFinalGrade = (test) => {
    const numberOfSections = getTestSections("camelCase")
      .map((section) => getTotalMarks(test, section))
      .filter((item) => item !== 0).length;

    const finalGrade =
      getTestSections("camelCase")
        .map((section, index) => {
          const finalSectionGrade =
            getTotalMarks(test, section) > 0
              ? (getStudentSectionMarks(section) /
                getTotalMarks(test, section)) *
              ((test || {}).sectionWeights || {})[
              index !== 3
                ? getTestSections("camelCaseSection")[index]
                : "fillBlankSection"
              ] *
              numberOfSections
              : 0;
          return finalSectionGrade;
        })
        .reduce((a, b) => a + b) / numberOfSections;

    const finalGradeAdjustedForPenalty = !test
      ? parseFloat(finalGrade.toFixed(2)) -
      ((formValues || {}).latePenalty || 0)
      : parseFloat(finalGrade.toFixed(2));
    if (finalGradeAdjustedForPenalty === NaN) return 0;
    return finalGradeAdjustedForPenalty;
  }

  const createData = (info, value) => {
    return { info, value };
  }

  const getSections = (test) => {
    const sections = (
      Object.values((test || {}).sectionWeights || []).filter(
        (item) => item !== null
      ) || []
    ).length;
  }

  const getRowSectionMarks = (test) => {
    const rowsSectionsMarks = getTestSections("camelCase").map(
      (section, index) => {
        const sectionMarks =
          parseFloat(getTotalMarks(test, section).toFixed(2)) > 0
            ? createData(
              getTestSections()[index],
              `${parseFloat(
                getStudentSectionMarks(section).toFixed(2)
              )} / ${parseFloat(
                getTotalMarks(test, section).toFixed(2)
              )}`
            )
            : null;
        return sectionMarks;
      }
    );
    return rowsSectionsMarks || [];
  }

  const getFinalGradeRow = (test) => {
    const finalGradeRow = [
      createData(
        test ? "Test grade" : "Assignment grade",
        `${getFinalGrade(test) < 0 ? 0 : getFinalGrade(test)}%`
      ),
    ];
    return finalGradeRow || [];
  }

  const getSectionGrades = (test) => {
    const sectionGrades = getTestSections("camelCase").map((section) => {
      const sectionGrade =
        (getStudentSectionMarks(section) /
          getTotalMarks(test, section)) *
        100;
      return sectionGrade;
    });
    return sectionGrades;
  }

  const setValidity = (isValid) => {
    setIsValid(isValid)
  }

  let postGradesButtonStyle;
  if (!confirmCheckBox && !(results || {}).graded)
    postGradesButtonStyle = {
      color: "rgba(0,0,0,0.12)",
      borderColor: "rgba(0,0,0,0.12)",
      backgroundColor: "white",
    };
  if (confirmCheckBox && isError)
    postGradesButtonStyle = {
      color: "#FF4136",
      borderColor: "#FF4136",
      backgroundColor: "#ffcdd2",
    };
  if (confirmCheckBox && !isError)
    postGradesButtonStyle = {
      color: "#43a047",
      borderColor: "#43a047",
      backgroundColor: "#e8f5e9",
    };
  if (!(course || {})._id || !(test || {})._id || !(results || {})._id)return null;
  return (
    <div>
      <Spinner active={loading} transparent />
      <TestInfo test={test} student={student} />
      <Accordion
          index="testSectionReview"
          summary={`${test.assignment ? "Assignment" : "Test"} resources`}
          summary={
            test.assignment
              ? t("gradeTestForm.assignmentResources")
              : t("gradeTestForm.testResources")
          }
          disabled={
            !getTestRecources(test, "test").readingMaterials.content &&
            !getTestRecources(test, "test").audioMaterials.audio &&
            !getTestRecources(test, "test").videoMaterials.video
          }
        >
          <TestMaterials
            audioId="testAudioMaterialReviewTest"
            pdfIndex={4}
            readingContent={
              getTestRecources(test, "test").readingMaterials.content
            }
            audioSource={getTestRecources(test, "test").audioMaterials.audio}
            videoSource={getTestRecources(test, "test").videoMaterials.video}
            onPreview={() => previewAudio("testAudioMaterialReviewTest")}
            fileUpload={
              getTestRecources(test, "test").readingMaterials.fileUpload
            }
          />
        </Accordion>
      {((test || {}).sectionWeights || {}).mcSection && (
        <div style={{ marginTop: 20 }}>
          <McSection
            formValues={formValues}
            sections={getSections(test)}
            mcSectionStudentInput={mcSectionStudentInput}
            isTest={test}
            test={test}
          />
         <Accordion
              index="mcSectionPreview"
              summary={t("gradeTestForm.sectionResources")}
              disabled={
                !getTestRecources(test, "mc").readingMaterials.content &&
                !getTestRecources(test, "mc").audioMaterials.audio &&
                !getTestRecources(test, "mc").videoMaterials.video
              }
            >
              <TestMaterials
                audioId="mcAudioMaterialPreviewTest"
                pdfIndex={0}
                readingContent={
                  getTestRecources(test, "mc").readingMaterials.content
                }
                audioSource={getTestRecources(test, "mc").audioMaterials.audio}
                videoSource={getTestRecources(test, "mc").videoMaterials.video}
                onPreview={() => previewAudio("mcAudioMaterialPreviewTest")}
                fileUpload={
                  getTestRecources(test, "mc").readingMaterials.fileUpload
                }
              />
            </Accordion>
        </div>
      )}

      {((test || {}).sectionWeights || {}).essaySection && (
        <div style={{ marginTop: 20 }}>
          <EssaySection
            formValues={formValues}
            sections={getSections(test)}
            essaySectionStudentInput={essaySectionStudentInput}
            isTest={test}
            test={test}
            path={filePath}
          />
          <Accordion
              index="essaySectionPreview"
              summary={t("gradeTestForm.sectionResources")}
              disabled={
                !getTestRecources(test, "essay").readingMaterials.content &&
                !getTestRecources(test, "essay").audioMaterials.audio &&
                !getTestRecources(test, "essay").videoMaterials.video
              }
            >
              <TestMaterials
                audioId="essayAudioMaterialPreviewTest"
                pdfIndex={1}
                readingContent={
                  getTestRecources(test, "essay").readingMaterials.content
                }
                audioSource={
                  getTestRecources(test, "essay").audioMaterials.audio
                }
                videoSource={
                  getTestRecources(test, "essay").videoMaterials.video
                }
                onPreview={() => previewAudio("essayAudioMaterialPreviewTest")}
                fileUpload={
                  getTestRecources(test, "essay").readingMaterials.fileUpload
                }
              />
            </Accordion>
        </div>
      )}

      {((test || {}).sectionWeights || {}).speakingSection && (
        <div style={{ marginTop: 20 }}>
          <SpeakingSection
            formValues={formValues}
            micBlockedWarning={micBlockedWarning}
            sections={getSections(test)}
            speakingSectionStudentInput={speakingSectionStudentInput}
            isTest={test}
            test={test}
            onInitiateRecording={(recorder, timout, index, isRecording) =>
              initiateRecording(recorder, timout, index, isRecording)
            }
            onSetAudioData={(blob, file, index) =>
              setAudioData(blob, file, index)
            }
            onGetRecordingTimeout={(index) => getRecordingTimeout(index)}
            onGetRecorderFromClick={(index) =>
              getRecorderFromClick(index)
            }
          />
          <Accordion
              index="speakingSectionPreview"
              summary={t("gradeTestForm.sectionResources")}
              disabled={
                !getTestRecources(test, "speaking").readingMaterials.content &&
                !getTestRecources(test, "speaking").audioMaterials.audio &&
                !getTestRecources(test, "speaking").videoMaterials.video
              }
            >
              <TestMaterials
                audioId="speakingAudioMaterialPreviewTest"
                pdfIndex={2}
                readingContent={
                  getTestRecources(test, "speaking").readingMaterials.content
                }
                audioSource={
                  getTestRecources(test, "speaking").audioMaterials.audio
                }
                videoSource={
                  getTestRecources(test, "speaking").videoMaterials.video
                }
                onPreview={() =>
                  previewAudio("speakingAudioMaterialPreviewTest")
                }
                fileUpload={
                  getTestRecources(test, "speaking").readingMaterials.fileUpload
                }
              />
            </Accordion>
        </div>
      )}

      {((test || {}).sectionWeights || {}).fillBlankSection && (
        <div style={{ marginTop: 20 }}>
          <FillInBlankSection
            formValues={formValues}
            fillInBlanksStudentAnswers={fillInBlanksStudentAnswers}
            sections={getSections(test)}
            fillblankSectionStudentInput={fillblankSectionStudentInput}
            isTest={test}
            test={test}
          />
         <Accordion
              index="fillblanksSectionPreview"
              summary={t("gradeTestForm.sectionResources")}
              disabled={
                !getTestRecources(test, "fillblanks").readingMaterials
                  .content &&
                !getTestRecources(test, "fillblanks").audioMaterials.audio &&
                !getTestRecources(test, "fillblanks").videoMaterials.video
              }
            >
              <TestMaterials
                audioId="fillblanksAudioMaterialPreviewTest"
                pdfIndex={3}
                readingContent={
                  getTestRecources(test, "fillblanks").readingMaterials.content
                }
                audioSource={
                  getTestRecources(test, "fillblanks").audioMaterials.audio
                }
                videoSource={
                  getTestRecources(test, "fillblanks").videoMaterials.video
                }
                onPreview={() =>
                  previewAudio("fillblanksAudioMaterialPreviewTest")
                }
                fileUpload={
                  getTestRecources(test, "fillblanks").readingMaterials
                    .fileUpload
                }
              />
            </Accordion>
        </div>
      )}
      {(test || {}).allowLateSubmission && (
        <Aux>
          <Typography style={{ marginTop: 40 }} variant="h6" gutterBottom>
            {t("gradeTestForm.latePenalty")}
          </Typography>
          <Field
            name="latePenalty"
            // input={{ value: "" }}
            simple
            component={NumberPicker}
          />
          <Typography variant="caption" gutterBottom paragraph>
            {`${getDaysLate(test, results) || 0} ${getDaysLate(test, results) === 1
              ? t("gradeTestForm.dayLateSingular")
              : t("gradeTestForm.dayLatePlural")
              } x ${(test || {}).latePenalty}% ${t(
                "gradeTestForm.latePenalty"
              ).toLowerCase()}`}
          </Typography>
        </Aux>
      )}
      <div style={{ marginTop: 20 }}>
        <Summary
          isTest={test}
          test={test}
          formValues={formValues}
          onGetRowSectionMarks={(test) => getRowSectionMarks(test)}
          onGetFinalGradeRow={(test) => getFinalGradeRow(test)}
        />
      </div>
      <Field
        name="gradeOverride"
        options={{
          label: t("gradeTestForm.fields.overrideGrade"),
          checked: false,
        }}
        component={Switch}
      />

      <div style={{ display: "flex", justifyContent: "start" }}>
        <Field
          name="gradeAdjusted"
          component={NumberPicker}
          options={{
            label: t("gradeTestForm.fields.gradeAdjustment"),
            size: "small",
            disabled: !(formValues || {}).gradeOverride,
          }}
        />
        {(test || {}).passingGrade &&
          formValues.gradeOverride &&
          parseFloat(formValues.gradeAdjusted) >= 0 &&
          parseFloat(formValues.gradeAdjusted) <= 100 && (
            <Aux>
              {parseFloat(formValues.gradeAdjusted) >=
                (test || {}).passingGrade ? (
                <span
                  style={{
                    color: "#4caf50",
                    marginLeft: 25,
                    lineHeight: 3,
                  }}
                >
                  {t("gradeTestForm.passed")}
                </span>
              ) : (
                <span style={{ color: "red", marginLeft: 25, lineHeight: 3 }}>
                  {t("gradeTestForm.failed")}
                </span>
              )}
            </Aux>
          )}
      </div>
      <Typography style={{ marginTop: 15 }} variant="body1" gutterBottom>
        {t("gradeTestForm.fields.gradeAdjustmentExplanation")}
      </Typography>
      <Field
        name="gradeAdjustmentExplanation"
        component={MultiLineField}
        options={{
          multiline: true,
          rows: 3,
          variant: OutlinedInput,
          disabled: !(formValues || {}).gradeOverride,
        }}
      />
      {!(results || {}).graded && (
        <Button
          onClick={() => {
            handleSubmit("save", results, test, errors, filePath);
          }}
          color={isError ? "secondary" : "primary"}
          fullWidth
        >
          {t("gradeTestForm.buttons.saveGradesExit")}
        </Button>
      )}
      {(test || {}).gradeReleaseDate ? (
        <Typography paragraph variant="body1" gutterBottom>
          {parseInt((test || {}).gradeReleaseDate) < Date.now()
            ? t("gradeTestForm.gradeRelaseDatePassedWarning")
            : `${t(
              "gradeTestForm.gradeReleaseDateNotYetPassedWarning"
            )} ${moment(parseInt((test || {}).gradeReleaseDate))
              .locale(localStorage.getItem("i18nextLng"))
              .format("dddd, MMMM DD YYYY, HH:mm")}.`}
        </Typography>
      ) : (
        <Typography paragraph variant="body1" gutterBottom>
          {t("gradeTestForm.noGradeReleaseDateWarning")}
        </Typography>
      )}
      {!(results || {}).graded && (
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmCheckBox}
              onChange={handleCheckboxChange}
              value="checked"
            />
          }
          label={t("gradeTestForm.fields.agree")}
        />
      )}
      {isError && (
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Typography color="error">
            {" "}
            {t("gradeTestForm.errors.correctForm")}
          </Typography>
        </div>
      )}

      <SubmitButton
        isError={isError}
        disabled={!confirmCheckBox && !(results || {}).graded}
        clicked={() => {
          handleSubmit("post", results, test, errors, filePath);
        }}
      >
        {!(results || {}).graded
          ? t("gradeTestForm.buttons.postGrades")
          : t("gradeTestForm.buttons.updateGrades")}
      </SubmitButton>
    </div>
  );

}

const mapDispatchToProps = (dispatch) => {
  return {
    postGrades: (
      formValues,
      token,
      student,
      test,
      graded,
      marking,
      sectionGrades,
      gradingInProgress,
      grade,
      filesToDelete,
      filePath,
      history,
    ) => {
      dispatch(
        actions.gradeTestStart(
          formValues,
          token,
          student,
          test,
          graded,
          marking,
          sectionGrades,
          gradingInProgress,
          grade,
          filesToDelete,
          filePath,
          history,
        )
      );
    },
    clearTestGrading: () => dispatch(actions.clearTestToGrade()),
    changeField: (field, value) => {
      dispatch(change("gradeForm", field, value));
    },
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
    deleteImg: (img, token) => {
      dispatch(actions.deleteFilesStart(img), token);
    },
    touchField: (field) => {
      dispatch(touch("gradeForm", field));
    },
  };
};

const mapStateToProps = (state, myProps) => {
  const match = myProps.match;
  const testId = match.params.testId || match.params.assignmentId;
  const studentId = match.params.studentId;
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse) || {};
  const instructorTest = (populatedCourse.tests || []).find(
    (test) => test._id === testId
  );
  const student = ((populatedCourse.studentsEnrollRequests || []).find(rq => rq.student._id === studentId) || {}).student || {};
  const results = student.testResults || [];
  const testResult = results.find(r => r.test === testId)

  const initialValues = setInitialValues(testResult, instructorTest);
  return {
    formValues: getFormValues("gradeForm")(state),
    errors: getFormSyncErrors("gradeForm")(state),
    loading: state.instructorTest.loading,
    token: state.authentication.token,
    course: populatedCourse,
    testGrading: testId,
    studentGrading: studentId,
    student,
    initialValues: { ...initialValues, instructorTest: instructorTest },
    isTest: myProps.isTest,
    notifications: state.common.notifications,
    test: instructorTest,
    results: testResult,
  };
};

const wrappedForm = reduxForm({
  form: "gradeForm",
  destroyOnUnmount: false,
  // forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate: validate,
})(GradeTestForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrappedForm);
