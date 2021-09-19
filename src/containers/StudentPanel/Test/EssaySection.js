import React from "react";
import { reduxForm, Field } from "redux-form";
import validate from "./validate";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../Editor/Editor";
import Typography from "@material-ui/core/Typography";
import { previewAudio } from "../../../utility/audioRecorder";
import TestMaterials from "./TestMaterials/TestMaterials";
import { useTranslation } from "react-i18next";

const EssaySection = ({ testInSession, path }) => {
  const {t} = useTranslation()
  const readingMaterials = testInSession.readingMaterials[1] || {};
  const audioMaterials = testInSession.audioMaterials[1] || {};
  const videoMaterials = testInSession.videoMaterials[1] || {};
  const questionBox = {
    background: '#1976d2',
    borderRadius: 4,
    color: 'white',
    padding: 10,
    marginBottom:30,
  }
  return (
    <Aux>
      <TestMaterials
        audioId={"essayAudioMaterial"}
        pdfIndex={2}
        readingContent={readingMaterials.content}
        audioSource={audioMaterials.audio}
        videoSource={videoMaterials.video}
        onPreview={() => previewAudio("essayAudioMaterial")}
        fileUpload={readingMaterials.fileUpload}
      />
      {((testInSession || {}).essayQuestions || []).map((question, index) => {
        return (
          <Aux key={question._id}>
            <Typography paragraph variant="h6">
            {`${ t("testSession.question")} ${index + 1}`}
            </Typography>
            <div style={questionBox} dangerouslySetInnerHTML={{ __html: question.question }} />
            <Field
              component={Editor}
              noImage
              name={`essayQuestions.${index}`}
              field={`essayQuestions.${index}`}
              reduxForm="studentTest"
              path={path}
            />
          </Aux>
        );
      })}
    </Aux>
  );
};

const wrappedForm = reduxForm({
  form: "studentTest",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(EssaySection);

export default wrappedForm
