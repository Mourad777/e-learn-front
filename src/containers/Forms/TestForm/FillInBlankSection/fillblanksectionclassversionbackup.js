import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  getFormValues,
  change,
  touch,
  updateSyncErrors,
  getFormSyncErrors,
} from "redux-form";
import syncInput from "../../QuestionForm/syncInput";
// import { fillInBlanksInstructions } from "../SectionInstructions";
import validate from "../validate";
import TextField from "../../../../components/UI/FormElements/TextField/TextField";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import Questions from "../../../InstructorPanel/Questions/Questions";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../../Editor/Editor";
import reactStringReplace from "react-string-replace";
import classes from "../TestForm.module.css";
import Switch from "../../../../components/UI/Switch/Switch";
import FileInput from "../../../../components/UI/FormElements/FileInput/FileInput";
import { start, stop, previewAudio } from "../../../../utility/audioRecorder";
import { AudioPlayer } from "../../../../components/UI/AudioPlayer/AudioPlayerRecorder";
import IncorrectStaticSelectableOptions from "./IncorrectStaticSelectableOptions";
import InlineAudioPlayer from "../../../../components/UI/AudioPlayer/InlineAudioPlayer";
import ReactHtmlParser from "react-html-parser";
import Typography from "@material-ui/core/Typography";
import DebounceField from "redux-form-debounce-field";
import DOMPurify from "dompurify";
import { withTranslation } from "react-i18next";

class FillInBlankSection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      previousCorrectAnswers: [],
      currentCorrectAnswers: [],
      previousAnswers: [],
      currentAnswers: [],
      blockSync: false,
      micBlockedWarning: false,
      micBlockedWarningTO: null,
    };
  }

  componentDidMount() {
    const errors = validate(this.props.formValues);
    // this.props.updateErrors("testForm",{})
    this.props.updateErrors("testForm", errors);
  }

  componentWillReceiveProps(nextProps) {
    const { formValues: previousFormValues = {} } = this.props;
    const { formValues: currentFormValues = {} } = nextProps;
    const previousFillBlankQuestions =
      previousFormValues.fillBlankQuestions || [];
    const currentFillBlankQuestions =
      currentFormValues.fillBlankQuestions || [];
    this.setState({
      previousAnswers: previousFillBlankQuestions.answers,
      currentAnswers: currentFillBlankQuestions.answers,
      previousCorrectAnswers: previousFillBlankQuestions.correctAnswers,
      currentCorrectAnswers: currentFillBlankQuestions.correctAnswers,
    });
  }

  componentDidUpdate() {
    if (this.state.blockSync) {
      //redux store is synched with text editor, but the sync function
      this.setState({ blockSync: false }); //should not be called if adding text from question bank
    } // or else it will cause a bug (an additional blank created), unblock sync function after update
  }

  componentWillUnmount() {
    clearTimeout(this.state.micBlockedWarningTO);
  }

  handleMicAlert = () => {
    clearTimeout(this.state.micBlockedWarningTO);
    this.setState({ micBlockedWarning: true });

    const timeoutId = setTimeout(() => {
      this.setState({ micBlockedWarning: false });
    }, 5000);
    this.setState({ micBlockedWarningTO: timeoutId });
  };

  initiateRecording = (recorder, timeout, index, isRecording) => {
    if (!isRecording) {
      this.handleMicAlert();
      return;
    }
    const { changeField, form } = this.props;
    const answersPath = "fillBlankQuestions.answers";
    changeField(form, `${answersPath}.${index}.recordingQuestion`, isRecording);
    changeField(form, `${answersPath}.${index}.questionRecorder`, recorder);
    changeField(
      form,
      `${answersPath}.${index}.questionRecordingTimeout`,
      timeout
    );
  };

  setAudioData = (blob, file, index) => {
    const { changeField, touchField, form } = this.props;
    const answersPath = "fillBlankQuestions.answers";
    changeField(form, `${answersPath}.${index}.recordingQuestion`, false);
    changeField(form, `${answersPath}.${index}.browserAudioFile`, blob);
    changeField(form, `${answersPath}.${index}.audioFile`, file);
    touchField(form, `${answersPath}.${index}.browserAudioFile`);
  };

  getRecordingTimeoutQuestion(index) {
    const { formValues } = this.props;
    const recordingTimeoutQuestion = (
      ((formValues.fillBlankQuestions || []).answers || [])[index] || {}
    ).questionRecordingTimeout;
    return recordingTimeoutQuestion;
  }

  getRecorderFromClickQuestion(index) {
    const { formValues } = this.props;
    const recorderFromClickQuestion = (
      ((formValues.fillBlankQuestions || []).answers || [])[index] || {}
    ).questionRecorder;
    return recorderFromClickQuestion;
  }

  touchIncorrectAnswerFields(index) {
    const path = `fillBlankQuestions.answers.${index}.answerOptions.incorrectAnswer`;
    ["One", "Two", "Three"].forEach((option) => {
      this.props.touchField(this.props.form, path + option);
    });
  }

  handleBlockSync(block) {
    this.setState({ blockSync: block ? true : false });
  }

  render() {
    const {
      formValues = {},
      formErrors = {},
      touchField,
      changeField,
      updateErrors,
      form,
      isModal,
      path,
      t,
    } = this.props;
    const answers = (formValues.fillBlankQuestions || {}).answers || [];
    const errors = (formErrors.fillBlankQuestions || {}).answers || [];
    const answerHasChanged = (
      this.state.previousCorrectAnswers || []
    ).findIndex((item, index) => {
      if (item !== this.state.currentCorrectAnswers[index]) return item;
      return null;
    });
    if (answerHasChanged > -1) {
      const answersToUpdate = (this.state.currentAnswers || []).map(
        (answer, index) => {
          return { ...answer, answer: this.state.currentCorrectAnswers[index] };
        }
      );
      changeField(form, "fillBlankQuestions.answers", answersToUpdate);
    }
    const updatedCorrectAnswers = (formValues.fillBlankQuestions || {})
      .correctAnswers;

    if (
      (this.state.currentCorrectAnswers || []).length !==
        (this.state.previousCorrectAnswers || []).length &&
      !this.state.blockSync
    ) {
      const { answersToUpdate, errorsToUpdate } = syncInput(
        this.state.previousCorrectAnswers,
        updatedCorrectAnswers,
        this.state.currentAnswers,
        errors
      );
      changeField(form, "fillBlankQuestions.answers", answersToUpdate);
      updateErrors(form, {
        ...formErrors,
        fillBlankQuestions: {
          question: (formErrors.fillBlankQuestions || {}).question,
          answers: errorsToUpdate,
        },
      });
      this.state.currentCorrectAnswers.forEach((item, index) => {
        const latestFormValues = {
          fillBlankQuestions: {
            answers: answersToUpdate,
          },
        };
        if (!item.marks)
          touchField(`fillBlankQuestions.answers.${index}.marks`);
        const latestErrors = validate(latestFormValues);
        if (
          (
            (latestErrors.fillBlankQuestions.answers[index] || {})
              .answerOptions || {}
          ).incorrectAnswerThree
        ) {
          this.touchIncorrectAnswerFields(index);
        }
        if (
          (latestErrors.fillBlankQuestions.answers[index] || {})
            .browserAudioFile
        ) {
          touchField(`fillBlankQuestions.answers.${index}.browserAudioFile`);
        }
      });
    }

    const htmlString = (formValues.fillBlankQuestions || {}).question || "";
    const correctAnswers = htmlString.match(/<mark [^>]+>(.*?)<\/mark>/g);
    const replacedHtml = reactStringReplace(
      htmlString,
      /<mark [^>]+>(.*?)<\/mark>/g,
      (match, i) => {
        const indexMatch = i / 2 - 0.5;
        const correctAnswer = ((answers || [])[indexMatch] || {}).answer;
        const audioSource = (answers[indexMatch] || {}).browserAudioFile;
        const selectableAnswer = ((answers || [])[indexMatch] || {})
          .selectableAnswer;
        if (selectableAnswer === true) {
          return (
            <Aux key={match + indexMatch}>
              <span className={classes.BlankPreview}>{indexMatch + 1} </span>
              {(answers[indexMatch] || {}).audio && audioSource && (
                <InlineAudioPlayer
                  id={`audio[${indexMatch}]`}
                  source={audioSource}
                />
              )}
              <IncorrectStaticSelectableOptions
                blankIndex={indexMatch}
                answers={answers}
                t={t}
              />
            </Aux>
          );
        }
        if (selectableAnswer === false) {
          return (
            <Aux key={match + indexMatch}>
              <span className={classes.Inline}>
                <span className={classes.BlankPreview}>{indexMatch + 1} </span>
                {(answers[indexMatch] || {}).audio && audioSource && (
                  <InlineAudioPlayer
                    id={`audio[${indexMatch}]`}
                    source={audioSource}
                  />
                )}
                <input
                  readOnly
                  type="text"
                  className={classes.InputField}
                  value={`${ReactHtmlParser(correctAnswer)}`}
                />
              </span>
            </Aux>
          );
        }
      }
    );
    const newString = [];
    replacedHtml.forEach((element, index) => {
      if (typeof element === "string") {
        newString.push(element);
      } else {
        newString.push(ReactDOMServer.renderToString(element));
      }
    });

    const joinedNewString = (newString || [])
      .join("")
      .replace(/<img/g, '<img style="width:100%"');

    const correctAnswersFixed = (correctAnswers || []).map((item) => {
      return item.replace(/<[^>]+>/g, "");
    });

    //check if any of the answers changed to prevent infinite loop
    changeField(form, "fillBlankQuestions.correctAnswers", correctAnswersFixed);

    return (
      <Aux>
        {form === "testForm" && (
          <Typography variant="h4" gutterBottom paragraph>
            {t("testForm.fillblanksSection")}
          </Typography>
        )}
        {/* <div>{fillInBlanksInstructions}</div> */}
        <div className={classes.TextEditor}>
          <Field
            component={Editor}
            isModal={isModal}
            name="fillBlankQuestions.question"
            label={t("testForm.fillblanksText")}
            field="fillBlankQuestions.question"
            reduxForm={form}
            error={(formErrors.fillBlankQuestions || {}).question}
            path={path}
            blockFillblankSynchronization={this.state.blockSync}
          />
        </div>

        {joinedNewString && (
          <div className={classes.PreviewContainer}>
            <Typography paragraph variant="h6">
              {t("testForm.preview")}
            </Typography>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(joinedNewString, {
                  ALLOW_UNKNOWN_PROTOCOLS: true,
                  ADD_ATTR: ["src", "onclick"],
                  ADD_TAGS: ["audio"],
                }),
              }}
            />
          </div>
        )}
        {form === "testForm" && (
          <Accordion summary={t("testForm.textFromQuestionbank")} index={0}>
            <Questions
              questionType="Fill-in-the-blanks questions"
              selecting
              onBlockSync={() => this.handleBlockSync(true)}
            />
          </Accordion>
        )}

        {answers.length > 0 ? (
          <Typography
            style={{ marginTop: 20 }}
            variant="h6"
            gutterBottom
            paragraph
          >
            {t("testForm.customizeAnswers")}
          </Typography>
        ) : (
          ""
        )}
        <ul className={classes.TestFormList}>
          {answers.map((item, blankIndex) => {
            const audioFunctionality = (
              <Aux>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Field
                    name={`fillBlankQuestions.answers.${blankIndex}.audioFile`}
                    component={FileInput}
                    uploadButtonText={t("testForm.buttons.selectAudioFile")}
                    index={blankIndex}
                    onChangeFile={(audio, index) => {
                      changeField(
                        form,
                        `fillBlankQuestions.answers.${index}.browserAudioFile`,
                        audio
                      );
                    }}
                    mimeTypesAllowed={"audio/*"}
                    extensionsAllowed={["mp3", "wav", "wma"]}
                  />
                </div>
                <Field
                  component={AudioPlayer}
                  name={`fillBlankQuestions.answers.${blankIndex}.browserAudioFile`}
                  onStart={async (e) => {
                    const startData =
                      (await start(e, null, blankIndex, null, async (data) => {
                        const timeoutData = await data;
                        this.setAudioData(
                          timeoutData.blob,
                          timeoutData.file,
                          blankIndex
                        );
                      })) || {};
                    this.initiateRecording(
                      startData.recorder,
                      startData.recordingTimeout,
                      blankIndex,
                      startData.isRecording
                    );
                  }}
                  onStop={async (e) => {
                    const stoppedData =
                      (await stop(
                        e,
                        null,
                        blankIndex,
                        this.getRecordingTimeoutQuestion(blankIndex),
                        this.getRecorderFromClickQuestion(blankIndex)
                      )) || {};
                    this.setAudioData(
                      stoppedData.blob,
                      stoppedData.file,
                      blankIndex
                    );
                  }}
                  onPreview={() => {
                    previewAudio(`audioQuestion[${blankIndex}]`);
                  }}
                  onClear={() => this.setAudioData(null, null, blankIndex)}
                  id={`audioQuestion[${blankIndex}]`}
                  recordDisabled={(answers[blankIndex] || {}).recordingQuestion}
                  audioSource={(answers[blankIndex] || {}).browserAudioFile}
                  isMicAlert={this.state.micBlockedWarning}
                />
              </Aux>
            );

            return (
              <li key={`blanks[${blankIndex}]`}>
                <div className={classes.QuestionCustomizationContainer}>
                  <Typography variant="h6" gutterBottom>
                    {`${t("testForm.blank")} ${blankIndex + 1}`}
                  </Typography>
                  <Typography
                    className={classes.CorrectAnswer}
                    variant="body1"
                    gutterBottom
                    paragraph
                  >
                    {`${t("testForm.correctAnswer")}: `}
                    {answers[blankIndex]
                      ? answers[blankIndex].answer.replace(/&nbsp;/g, " ")
                      : ""}
                  </Typography>
                  <Field
                    name={`fillBlankQuestions.answers.${blankIndex}.selectableAnswer`}
                    options={{
                      checked: false,
                      label: t("testForm.fields.selectableAnswer"),
                    }}
                    component={Switch}
                    type="checkbox"
                  />
                  <Field
                    name={`fillBlankQuestions.answers.${blankIndex}.audio`}
                    type="checkbox"
                    options={{
                      checked: false,
                      label: t("testForm.audio"),
                    }}
                    component={Switch}
                  />

                  {answers[blankIndex].selectableAnswer && (
                    <Aux>
                      <Typography variant="body1" gutterBottom paragraph>
                        {t("testForm.incorrectAnswerOptions")}
                      </Typography>
                      {[
                        "incorrectAnswerOne",
                        "incorrectAnswerTwo",
                        "incorrectAnswerThree",
                      ].map((field, index) => (
                        <div
                          key={`${field}[${index}]`}
                          className={classes.TextField}
                        >
                          <Field
                            wait={250}
                            // error={((errors[blankIndex]||{}).answerOptions||{}).incorrectAnswerThree}
                            component={TextField}
                            name={`fillBlankQuestions.answers.${blankIndex}.answerOptions.${field}`}
                            label={`${t("testForm.incorrectOption")} ${
                              index + 1
                            }`}
                            margin={"dense"}
                            variant={"outlined"}
                            size={"small"}
                            simple
                            width={"95%"}
                            debounce
                            onChange={() =>
                              this.touchIncorrectAnswerFields(index)
                            }
                          />
                        </div>
                      ))}
                    </Aux>
                  )}

                  {(answers[blankIndex] || {}).audio
                    ? audioFunctionality
                    : null}
                  {form === "testForm" && (
                    <div style={{ marginTop: 15 }}>
                      <Field
                        name={`fillBlankQuestions.answers.${blankIndex}.marks`}
                        component={NumberPicker}
                        error={(errors[blankIndex] || {}).marks}
                        options={{
                          label: t("testForm.fields.marks"),
                          size: "small",
                        }}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Aux>
    );
  }
}

const mapStateToProps = (state, { form }) => {
  return {
    formValues: getFormValues(form)(state),
    formErrors: getFormSyncErrors(form)(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    touchField: (form, field) => {
      dispatch(touch(form, field));
    },
    changeField: (form, field, value) => {
      dispatch(change(form, field, value));
    },
    updateErrors: (form, values) => {
      dispatch(updateSyncErrors(form, values));
    },
  };
};

const wrappedForm = reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: false,
  validate,
})(FillInBlankSection);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("common")(wrappedForm));
