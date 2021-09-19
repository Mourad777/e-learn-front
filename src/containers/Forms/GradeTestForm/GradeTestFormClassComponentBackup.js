import React, { Component } from "react";
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
import { withTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";

class GradeTestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialUrls: [],
      confirmCheckBox: false,
      isValid: true,
      isUpdating: false,
      micBlockedWarning: false,
      micBlockedWarningTO: null,
    };
  }

  handleMicAlert = () => {
    clearTimeout(this.state.micBlockedWarningTO);
    this.setState({ micBlockedWarning: true });

    const timeoutId = setTimeout(() => {
      this.setState({ micBlockedWarning: false });
    }, 5000);
    this.setState({ micBlockedWarningTO: timeoutId });
  };

  handleWindowClose = (ev) => {
    ev.preventDefault();
    if (!this.state.isUpdating) this.handleDeleteUnsavedImages();
    return ev.returnValue;
  };

  handleDeleteUnsavedImages = () => {
    const updatedUrls = getUrls(this.props.formValues, "gradeTest");
    const imagesToDelete = [];
    (updatedUrls || []).forEach((imgUrl) => {
      if (this.state.initialUrls.findIndex((u) => u === imgUrl) === -1) {
        imagesToDelete.push(imgUrl);
      }
    });

    if (imagesToDelete.length > 0)
      this.props.deleteImg(imagesToDelete, this.props.token);
  };

  componentDidMount() {
    window.addEventListener("beforeunload", this.handleWindowClose);
    //set the initial urls
    const initialUrls = getUrls(this.props.initialValues, "gradeTest");
    this.setState({ initialUrls: initialUrls });
    const notificationToMark = (this.props.notifications || []).find((n) => {
      if (
        n.fromUser === this.props.studentGrading &&
        n.documentId === this.props.testGrading &&
        (n.documentType === "testSubmitted" ||
          n.documentType === "assignmentSubmitted")
      )
        return n;
    });

    if (notificationToMark) {
      this.props.markAsSeen(notificationToMark._id, this.props.token);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.handleWindowClose);
    if (!this.state.isUpdating) this.handleDeleteUnsavedImages();
    clearTimeout(this.state.micBlockedWarningTO);
  }

  handleSubmit = (submissionType, results, test, errors, filePath) => {
    this.props.touchField("latePenalty");
    this.props.touchField("gradeAdjusted");
    this.setState({ isUpdating: true }, () => {
      //submit form here
      const {
        formValues,
        token,
        studentGrading,
        clearTestGrading,
        postGrades,
      } = this.props;
      if (!errors.isValid) {
        this.setValidity(false);
        return;
      }
      postGrades(
        formValues,
        token,
        studentGrading,
        test,
        submissionType === "post" ? true : false,
        true,
        this.getSectionGrades(test),
        submissionType === "post" ? false : true,
        this.getFinalGrade(test),
        this.getFilesToDelete(formValues, results),
        filePath
      );

      clearTestGrading();
    });
  };

  getFilesToDelete(updatedValues, testResult) {
    const studentAnswersUrls = getUrls(testResult, "gradeTestAnswers") || [];
    //making sure to not delete file from student answer while instructor
    //corrects the test, the instructor can remove the image from correction
    //but a copy of the students answer must remain intact
    const updatedUrls = getUrls(updatedValues, "gradeTest");
    const filesToDelete = (this.state.initialUrls || []).filter(
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

  handleCheckboxChange = (event) => {
    this.setState({ confirmCheckBox: !this.state.confirmCheckBox });
  };

  getResults() {
    const testResults = this.props.results;
    return (
      (testResults || []).find((item) => {
        if (
          item.test._id === this.props.testGrading &&
          item.student._id === this.props.studentGrading
        )
          return item;
      }) || {}
    );
  }

  getTestSections(type) {
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

  getTotalMarks(test, section) {
    const totalMarks = this.getTestSections("camelCaseQuestions")
      .map((sectionQuestions, index) => {
        const sections = this.getTestSections("camelCase");
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

  getDaysLate(test, results) {
    if (this.props.test) return;
    if (!(test || {}).allowLateSubmission) return;
    if (parseInt((results || {}).submittedOn) < parseInt((test || {}).dueDate))
      return;
    const timeStampDifference =
      parseInt((results || {}).submittedOn) - parseInt((test || {}).dueDate);
    const daysLate = timeStampDifference / (1000 * 60 * 60 * 24);
    return Math.ceil(daysLate);
  }

  getStudentSectionMarks(section) {
    const formValues = this.props.formValues || {};
    const sectionMarks = this.getTestSections("camelCase")
      .map((item, index) => {
        if (section === item) {
          const sectionValues = (
            (
              (formValues || {})[
                this.getTestSections("camelCaseSection")[index]
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

  initiateRecording = (recorder, timeout, index, isRecording) => {
    if (!isRecording) {
      this.handleMicAlert();
      return;
    }
    const { changeField } = this.props;
    changeField(`speakingSection.${index}.recording`, isRecording);
    changeField(`speakingSection.${index}.recorder`, recorder);
    changeField(`speakingSection.${index}.recorderTimeout`, timeout);
  };

  setAudioData = (blob, file, index) => {
    const { changeField } = this.props;
    changeField(`speakingSection.${index}.recording`, false);
    changeField(`speakingSection.${index}.recordedBlob`, blob);
    changeField(`speakingSection.${index}.audioFile`, file);
  };

  getRecordingTimeout(index) {
    const { formValues } = this.props;
    return ((formValues.speakingSection || [])[index] || {}).recorderTimeout;
  }

  getRecorderFromClick(index) {
    const { formValues } = this.props;
    return ((formValues.speakingSection || [])[index] || {}).recorder;
  }

  getFinalGrade(test) {
    const { formValues } = this.props;
    const numberOfSections = this.getTestSections("camelCase")
      .map((section) => this.getTotalMarks(test, section))
      .filter((item) => item !== 0).length;

    const finalGrade =
      this.getTestSections("camelCase")
        .map((section, index) => {
          const finalSectionGrade =
            this.getTotalMarks(test, section) > 0
              ? (this.getStudentSectionMarks(section) /
                  this.getTotalMarks(test, section)) *
                ((test || {}).sectionWeights || {})[
                  index !== 3
                    ? this.getTestSections("camelCaseSection")[index]
                    : "fillBlankSection"
                ] *
                numberOfSections
              : 0;
          return finalSectionGrade;
        })
        .reduce((a, b) => a + b) / numberOfSections;

    const finalGradeAdjustedForPenalty = !this.props.test
      ? parseFloat(finalGrade.toFixed(2)) -
        ((formValues || {}).latePenalty || 0)
      : parseFloat(finalGrade.toFixed(2));
    if (finalGradeAdjustedForPenalty === NaN) return 0;
    return finalGradeAdjustedForPenalty;
  }

  createData(info, value) {
    return { info, value };
  }

  getSections(test) {
    const sections = (
      Object.values((test || {}).sectionWeights || []).filter(
        (item) => item !== null
      ) || []
    ).length;
  }

  getRowSectionMarks(test) {
    const rowsSectionsMarks = this.getTestSections("camelCase").map(
      (section, index) => {
        const sectionMarks =
          parseFloat(this.getTotalMarks(test, section).toFixed(2)) > 0
            ? this.createData(
                this.getTestSections()[index],
                `${parseFloat(
                  this.getStudentSectionMarks(section).toFixed(2)
                )} / ${parseFloat(
                  this.getTotalMarks(test, section).toFixed(2)
                )}`
              )
            : null;
        return sectionMarks;
      }
    );
    return rowsSectionsMarks || [];
  }

  getFinalGradeRow(test) {
    const finalGradeRow = [
      this.createData(
        this.props.test ? "Test grade" : "Assignment grade",
        `${this.getFinalGrade(test) < 0 ? 0 : this.getFinalGrade(test)}%`
      ),
    ];
    return finalGradeRow || [];
  }

  getSectionGrades(test) {
    const sectionGrades = this.getTestSections("camelCase").map((section) => {
      const sectionGrade =
        (this.getStudentSectionMarks(section) /
          this.getTotalMarks(test, section)) *
        100;
      return sectionGrade;
    });
    return sectionGrades;
  }

  setValidity(isValid) {
    this.setState({ isValid });
  }

  render() {
    const {
      errors,
      loading,
      formValues = {},
      course = {},
      modalDocument,
      t,
    } = this.props;
    const isError = !errors.isValid && !this.state.isValid;
    const test = this.getResults().test || {};
    const results = this.getResults().testResult || {};
    const mcSectionStudentInput = results.multiplechoiceSection;
    const essaySectionStudentInput = results.essaySection;
    const speakingSectionStudentInput = results.speakingSection;
    const fillblankSectionStudentInput = results.fillInBlanksSection;
    const fillInBlanksStudentAnswers = (fillblankSectionStudentInput || {})
      .answers;
    const filePath = `courses/${course._id}/tests/${test._id}/results/${results._id}`;
    let postGradesButtonStyle;
    if (!this.state.confirmCheckBox && !(results || {}).graded)
      postGradesButtonStyle = {
        color: "rgba(0,0,0,0.12)",
        borderColor: "rgba(0,0,0,0.12)",
        backgroundColor: "white",
      };
    if (this.state.confirmCheckBox && isError)
      postGradesButtonStyle = {
        color: "#FF4136",
        borderColor: "#FF4136",
        backgroundColor: "#ffcdd2",
      };
    if (this.state.confirmCheckBox && !isError)
      postGradesButtonStyle = {
        color: "#43a047",
        borderColor: "#43a047",
        backgroundColor: "#e8f5e9",
      };

    const studentResult =
      modalDocument.results.find((r) => r.student._id === results.student) ||
      {};
    return (
      <div>
        <Spinner active={loading} transparent />
        <TestInfo test={test} student={studentResult.student} />
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
              sections={this.getSections(test)}
              mcSectionStudentInput={mcSectionStudentInput}
              isTest={this.props.test}
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
              sections={this.getSections(test)}
              essaySectionStudentInput={essaySectionStudentInput}
              isTest={this.props.test}
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
              micBlockedWarning={this.state.micBlockedWarning}
              sections={this.getSections(test)}
              speakingSectionStudentInput={speakingSectionStudentInput}
              isTest={this.props.test}
              test={test}
              onInitiateRecording={(recorder, timout, index, isRecording) =>
                this.initiateRecording(recorder, timout, index, isRecording)
              }
              onSetAudioData={(blob, file, index) =>
                this.setAudioData(blob, file, index)
              }
              onGetRecordingTimeout={(index) => this.getRecordingTimeout(index)}
              onGetRecorderFromClick={(index) =>
                this.getRecorderFromClick(index)
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
              sections={this.getSections(test)}
              fillblankSectionStudentInput={fillblankSectionStudentInput}
              isTest={this.props.test}
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
              {`${this.getDaysLate(test, results) || 0} ${
                this.getDaysLate(test, results) === 1
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
            isTest={this.props.test}
            test={test}
            formValues={formValues}
            onGetRowSectionMarks={(test) => this.getRowSectionMarks(test)}
            onGetFinalGradeRow={(test) => this.getFinalGradeRow(test)}
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
              this.handleSubmit("save", results, test, errors, filePath);
            }}
            style={
              isError
                ? {
                    color: "#FF4136",
                    borderColor: "#FF4136",
                    backgroundColor: "#ffcdd2",
                  }
                : {}
            }
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
                checked={this.state.confirmCheckBox}
                onChange={this.handleCheckboxChange}
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
        <Button
          onClick={() => {
            this.handleSubmit("post", results, test, errors, filePath);
          }}
          style={postGradesButtonStyle}
          disabled={!this.state.confirmCheckBox && !(results || {}).graded}
        >
          {!(results || {}).graded
            ? t("gradeTestForm.buttons.postGrades")
            : t("gradeTestForm.buttons.updateGrades")}
        </Button>
      </div>
    );
  }
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
      filePath
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
          filePath
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

const mapStateToProps = (state) => {
  const initialGradeValues = state.instructorTest.initialGradeValues;
  const modalDocument = state.common.modalDocument;
  const populatedCourse = getCourse(state.common.courses,state.common.selectedCourse);
  const instructorTest = (populatedCourse.tests || []).find(
    (test) => test._id === modalDocument.testId
  );
  return {
    formValues: getFormValues("gradeForm")(state),
    errors: getFormSyncErrors("gradeForm")(state),
    loading: state.instructorTest.loading,
    token: state.authentication.token,
    course:populatedCourse,
    testGrading: modalDocument.testId,
    studentGrading: modalDocument.studentId,
    results: modalDocument.results,
    initialValues: { ...initialGradeValues, instructorTest: instructorTest },
    isTest: state.common.tab === 0,
    notifications: state.common.notifications,
    modalDocument: state.common.modalDocument,
    test: state.common.tab === 0,
  };
};

const wrappedForm = reduxForm({
  form: "gradeForm",
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true,
  validate: validate,
})(GradeTestForm);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(wrappedForm));
