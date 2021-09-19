import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, getFormValues, change, getFormSyncErrors } from "redux-form";
import classes from "./QuestionForm.module.css";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../Editor/Editor";
import Switch from "../../../components/UI/Switch/Switch";
import FileInput from "../../../components/UI/FormElements/FileInput/FileInput";
import { Player } from './audioUtil'
import { useTranslation } from "react-i18next";

const SpeakingQuestion = ({
  changeField,
  formValues = {},
  formErrors = {},
  path,
}) => {
  const {t} = useTranslation('common')
  const switchOptionsQuestion = { label: t("questionForm.fields.audioQuestion"), checked: false };
  const switchOptionsAnswer = { label: t("questionForm.fields.audioAnswer"), checked: false };
  const index = 0;
  const speakingQuestion = (formValues.speakingQuestion || [])[index] || {};
  const switchField = ["question", "answer"].map((type) => (
    <Field
      name={`speakingQuestion.${index}.${type === "question" ? "audioQuestion" : "audioAnswer"
        }`}
      options={
        type === "question" ? switchOptionsQuestion : switchOptionsAnswer
      }
      component={Switch}
      type="checkbox"
    />
  ));
  return (
    <Aux className={classes.QuestionCustomizationContainer}>
      <Aux>
        {switchField[0]}
        {!speakingQuestion.audioQuestion ? (
          <div className={classes.TextEditor}>
            <Field
              name={`speakingQuestion.${index}.question`}
              field={`speakingQuestion.${index}.question`}
              reduxForm="questionForm"
              component={Editor}
              label={t("questionForm.question")}
              path={path}
              error={(formErrors.speakingQuestion || {}).question}
            />
          </div>
        ) : (
          <Aux>
            <div className={classes.flexPositioningEven}>
              <Field
                name={`speakingQuestion.${index}.audioFileQuestion`}
                index={`q${index}`}
                onChangeFile={(audio) => {
                  changeField(
                    `speakingQuestion.${index}.questionRecordedBlob`,
                    audio
                  );
                }}
                component={FileInput}
                loadedFile={speakingQuestion.questionRecordedBlob}
                mimeTypesAllowed={"audio/*"}
                extensionsAllowed={["mp3", "wav", "wma"]}
              />
            </div>
            <Player isQuestion index={0} />
          </Aux>
        )}
        <div>
          {switchField[1]}
          {(speakingQuestion.audioAnswer === true) && (
            <Aux>
              <div className={classes.flexPositioningEven}>
                <Field
                  name={`speakingQuestion.${index}.audioFile`}
                  component={FileInput}
                  index={`a${index}`}
                  onChangeFile={(audio) => {
                    changeField(
                      `speakingQuestion.${index}.recordedBlob`,
                      audio
                    );
                  }}
                  loadedFile={speakingQuestion.recordedBlob}
                  mimeTypesAllowed={"audio/*"}
                  extensionsAllowed={["mp3", "wav", "wma"]}
                />
              </div>

              <Player isAnswer index={0} />
            </Aux>
          )}
        </div>
      </Aux>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("questionForm")(state),
    formErrors: getFormSyncErrors("questionForm")(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (field, value) => {
      dispatch(change("questionForm", field, value));
    },
  };
};
const wrappedForm = reduxForm({
  form: "questionForm",
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
})(SpeakingQuestion);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
