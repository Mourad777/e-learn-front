import React, { useEffect } from "react";
import { reduxForm, getFormValues } from "redux-form";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import McSection from "./mcSection";
import EssaySection from "./essaySection";
import SpeakingSection from "./speakingSection";
import FillblankSection from "./fillBlankSection";
import Summary from "./Summary";
import TestMaterials from "../Test/TestMaterials/TestMaterials";
import Accordion from "../../../components/UI/Accordion/Accordion";
import { previewAudio } from "../../../utility/audioRecorder";
import TestInfo from "../../Forms/GradeTestForm/TestInfo/TestInfo";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const TestReview = ({
  userId,
  notifications,
  markAsSeen,
  test,
  formValues = {},
  assignment,
  initialValues = {},
  isDarkTheme,
  onReviewTest,
  match,
}) => {
  const token = localStorage.getItem('token');
  const url = useHistory().location.pathname
  const { t } = useTranslation('common');
  useEffect(() => {
    const notificationToMark = (notifications || []).find((n) => {
      if (
        n.toSpecificUser === userId &&
        n.documentId === (initialValues.testResult || {}).test &&
        n.documentType === "testReview"
      )
        return n;
    });
    if (notificationToMark) {
      markAsSeen(notificationToMark._id, token);
    }

    const isStudentTestResult = true;
    const workId = match.params.testId || match.params.assignmentId;
    onReviewTest(isStudentTestResult, workId, token);
  }, [])

  const instructorTest = initialValues.instructorTest || {};
  const testResult = initialValues.testResult || {};
  const sections = Object.values(instructorTest.sectionWeights || []).filter(
    (i) => i
  ).length;
  const mcStudInp = testResult.multiplechoiceSection;
  const esStudInp = testResult.essaySection;
  const spStudInp = testResult.speakingSection;
  const fbStudInp = testResult.fillInBlanksSection;
  const fbStudAns = (fbStudInp || {}).answers;
  const audioMaterials =
    ((instructorTest || {}).audioMaterials || [])[4] || {};
  const readingMaterials =
    ((instructorTest || {}).readingMaterials || [])[4] || {};
  const videoMaterials =
    ((instructorTest || {}).videoMaterials || [])[4] || {};
  return (
    <div>
      <TestInfo test={instructorTest} />
      <Accordion
        index={"testSectionReview"}
        summary={assignment ? t("testReview.assignmentResources") : t("testReview.testResources")}
        disabled={!readingMaterials.content && !audioMaterials.audio && !videoMaterials.video}
      >
        <TestMaterials
          isDarkTheme={isDarkTheme}
          audioId={"testAudioMaterialReviewTest"}
          pdfIndex={4}
          readingContent={readingMaterials.content}
          audioSource={audioMaterials.audio}
          videoSource={videoMaterials.video}
          onPreview={() => previewAudio("testAudioMaterialReviewTest")}
          fileUpload={readingMaterials.fileUpload}
        />
      </Accordion>
      {(instructorTest.sectionWeights || {}).mcSection && (
        <div style={{ marginTop: 20 }}>
          <McSection
            isDarkTheme={isDarkTheme}
            formValues={formValues}
            instructorTest={instructorTest}
            test={test}
            sections={sections}
            studentInput={mcStudInp}
            testResult={
              (formValues.testResult || {}).multiplechoiceSection || {}
            }
          />
        </div>
      )}

      {(instructorTest.sectionWeights || {}).essaySection && (
        <div style={{ marginTop: 20 }}>
          <EssaySection
            isDarkTheme={isDarkTheme}
            formValues={formValues}
            instructorTest={instructorTest}
            test={test}
            sections={sections}
            studentInput={esStudInp}
            testResult={formValues.testResult || {}}
          />
        </div>
      )}

      {(instructorTest.sectionWeights || {}).speakingSection && (
        <div style={{ marginTop: 20 }}>
          <SpeakingSection
            isDarkTheme={isDarkTheme}
            test={test}
            instructorTest={instructorTest}
            sections={sections}
            studentInput={spStudInp}
            testResult={(formValues.testResult || {}).speakingSection}
          />
        </div>
      )}

      {(instructorTest.sectionWeights || {}).fillBlankSection && (
        <div style={{ marginTop: 20 }}>
          <FillblankSection
            isDarkTheme={isDarkTheme}
            studentInput={fbStudAns}
            test={test}
            instructorTest={instructorTest}
            sections={sections}
            testResult={
              (formValues.testResult || {}).fillInBlanksSection || {}
            }
          />
        </div>
      )}
      <Summary
        isDarkTheme={isDarkTheme}
        testResult={formValues.testResult}
        test={test}
        instructorTest={formValues.instructorTest || {}}
        testReviewing={initialValues}
      />
    </div>
  );

}

const mapDispatchToProps = (dispatch) => {
  return {
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
    onReviewTest: (isTestResult, testId, token) => {
      dispatch(
        actions.fetchTestStart(
          testId,
          true,
          token,
          false,
          isTestResult,
        )
      );
    },
  };
};

const mapStateToProps = (state, myProps) => {
  const match = myProps.match
  const workId = match.params.testId || match.params.assignmentId
  const testResults = (state.studentTest.testResults || {}).testResults || [];
  const result = testResults.find(r => r.test === workId);
  const initialValues = {
    instructorTest: ((state.common.modalDocument || {}).test || {}).instructorTest,
    testResult: result,
  }
  return {
    formValues: getFormValues("testReview")(state),
    initialValues,
    notifications: state.common.notifications,
    token: state.authentication.token,
    userId: state.authentication.userId,
    isDarkTheme: state.common.isDarkTheme,
  };
};

const wrappedForm = reduxForm({
  form: "testReview",
  enableReinitialize: true,
})(TestReview);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(wrappedForm);
