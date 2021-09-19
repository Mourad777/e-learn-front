import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Field, reduxForm, change } from "redux-form";
import validate from "./validate";
import Checkbox from "../../../components/UI/FormElements/Checkbox/Checkbox";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { previewAudio } from "../../../utility/audioRecorder";
import TestMaterials from "./TestMaterials/TestMaterials";
import { useTranslation } from "react-i18next";

const MultipleChoiceSection = ({testInSession}) => {
  const {t}= useTranslation();
  const readingMaterials = testInSession.readingMaterials[0] || {};
  const audioMaterials = testInSession.audioMaterials[0] || {};
  const videoMaterials = testInSession.videoMaterials[0] || {};
  const questionBox = {
    background: '#1976d2',
    borderRadius: 4,
    color: 'white',
    padding: 10,
  }
  return (
    <Aux>
        <TestMaterials
          audioId={"mcAudioMaterial"}
          pdfIndex={1}
          readingContent={readingMaterials.content}
          audioSource={audioMaterials.audio}
          videoSource={videoMaterials.video}
          onPreview={() => previewAudio("mcAudioMaterial")}
          fileUpload={readingMaterials.fileUpload}
        />
        {((testInSession || {}).multipleChoiceQuestions || []).map(
          (question, index) => {
            const answerOptions = ((question || {}).answerOptions || []).map(
              (option, index) => {
                return {
                  label: option,
                  value: option,
                  placement: "start",
                  color: "primary",
                  name: "mc",
                };
              }
            );
            return (
              <Aux key={question._id}>
                <Typography paragraph variant="h6">
                  {`${ t("testSession.question")} ${index + 1}`}
                </Typography>
                <div style={questionBox} dangerouslySetInnerHTML={{ __html: question.question }} />
                <Field
                  name={`mcQuestions.${index}`}
                  component={Checkbox}
                  numbered
                  options={answerOptions}
                  required={false}
                  column
                />
              </Aux>
            );
          }
        )}
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearAnswers: (index) => {
      dispatch(change("testForm", `mcQuestions[${index}.correctAnswers]`, []));
    },
  };
};

const wrappedForm = reduxForm({
  form: "studentTest",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(MultipleChoiceSection);

export default connect(null, mapDispatchToProps)(wrappedForm);