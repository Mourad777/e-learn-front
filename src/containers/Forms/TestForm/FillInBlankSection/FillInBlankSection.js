import React, { useRef, useEffect, useState } from "react";
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
import validate from "../validate";
import TextField from "../../../../components/UI/FormElements/TextField/TextField";
import NumberPicker from "../../../../components/UI/FormElements/NumberPicker/NumberPicker";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import Questions from "../../../InstructorPanel/Questions/Questions";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../../Editor/Editor";
import classes from "../TestForm.module.css";
import Switch from "../../../../components/UI/Switch/Switch";
import FileInput from "../../../../components/UI/FormElements/FileInput/FileInput";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";
import { getProcessedFillblankText } from "./getProcessedFillblankText";
import { handleBlockSync, touchIncorrectAnswerFields } from './util';
import AudioFunctionality from './audioFunctionality'

const FillInBlankSection = ({
  formValues,
  updateErrors,
  formErrors,
  touchField,
  changeField,
  form,
  isModal,
  path,
}) => {
  const { t } = useTranslation('common');

  const [blockSync, setBlockSync] = useState([])

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    const errors = validate(formValues);
    updateErrors("testForm", errors);

  }, [])

  const currentAnswers =
    (formValues.fillBlankQuestions || {}).answers;

  const currentCorrectAnswers =
    (formValues.fillBlankQuestions || {}).correctAnswers;

  const previousCorrectAnswers = usePrevious(currentCorrectAnswers);

  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      if (blockSync) {
        //redux store is synched with text editor, but the sync function
        setBlockSync(false)
        //should not be called if adding text from question bank
      } // or else it will cause a bug (an additional blank created), unblock sync function after update
    }
  });

  const answers = (formValues.fillBlankQuestions || {}).answers || [];
  const errors = (formErrors.fillBlankQuestions || {}).answers || [];
  const answerHasChanged = (
    previousCorrectAnswers || []
  ).findIndex((item, index) => {
    if (item !== currentCorrectAnswers[index]) return item;
    return null;
  });
  if (answerHasChanged > -1) {
    const answersToUpdate = (currentAnswers || []).map(
      (answer, index) => {
        return { ...answer, answer: currentCorrectAnswers[index] };
      }
    );
    changeField(form, "fillBlankQuestions.answers", answersToUpdate);
  }
  const updatedCorrectAnswers = (formValues.fillBlankQuestions || {})
    .correctAnswers;

  if (
    (currentCorrectAnswers || []).length !==
    (previousCorrectAnswers || []).length &&
    !blockSync
  ) {
    const { answersToUpdate, errorsToUpdate } = syncInput(
      previousCorrectAnswers,
      updatedCorrectAnswers,
      currentAnswers,
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
    currentCorrectAnswers.forEach((item, index) => {
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
        touchIncorrectAnswerFields(index, touchField, form);
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
  const correctAnswersFixed = (correctAnswers || []).map((item) => {
    return item.replace(/<[^>]+>/g, "");
  });

  //check if any of the answers changed to prevent infinite loop

  useEffect(() => {
    changeField(form, "fillBlankQuestions.correctAnswers", correctAnswersFixed);
  }, [formValues])


  const processedFillblankText = getProcessedFillblankText(htmlString, answers, t);

  return (
    <Aux>
      {form === "testForm" && (
        <Typography variant="h4" gutterBottom paragraph>
          {t("testForm.fillblanksSection")}
        </Typography>
      )}

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
          blockFillblankSynchronization={blockSync}
        />
      </div>



      {processedFillblankText && (
        <div className={classes.PreviewContainer}>
          <Typography paragraph variant="h6">
            {t("testForm.preview")}
          </Typography>
          <div
            dangerouslySetInnerHTML={{ __html: processedFillblankText }}
          />
        </div>
      )}
      {form === "testForm" && (
        <Accordion summary={t("testForm.textFromQuestionbank")} index={0}>
          <Questions
            questionType="Fill-in-the-blanks questions"
            selecting
            onBlockSync={() => handleBlockSync(true, setBlockSync)}
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
                          label={`${t("testForm.incorrectOption")} ${index + 1
                            }`}
                          margin={"dense"}
                          variant={"outlined"}
                          size={"small"}
                          simple
                          width={"95%"}
                          debounce
                          onChange={() =>
                            touchIncorrectAnswerFields(index, touchField, form)
                          }
                        />
                      </div>
                    ))}
                  </Aux>
                )}

                {(answers[blankIndex] || {}).audio &&
                  (<AudioFunctionality
                    blankIndex={blankIndex}
                    FileInput={FileInput}
                    form={form}
                    answers={answers}
                  />)}
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
)(wrappedForm);
