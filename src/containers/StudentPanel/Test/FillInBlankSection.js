// import React, {useEffect } from "react";
// import { connect } from "react-redux";
// import { reduxForm, change } from "redux-form";
// import validate from "./validate";
// import Aux from "../../../hoc/Auxiliary/Auxiliary";
// import TestMaterials from "./TestMaterials/TestMaterials";
// import { previewAudio } from "../../../utility/audioRecorder";
// import { useTranslation } from "react-i18next";
// import { getProcessedFillblankText } from './getProcessedFillblankText';

// const blankListener = (e,formValues,updateAnswer) => {
//   const pattern = /\d+/;
//   const index = parseInt((e.target.id.match(pattern) || [])[0]);
//   const elementIds = (
//     ((formValues || {}).fillBlankQuestions || {}).answers || []
//   ).map((item, index) => {
//     return `blank-input-[${index}]`;
//   });
//   if (elementIds.includes(e.target.id)) {
//     console.log('e.target.value',e.target.value)
//     updateAnswer(e.target.value, index);
//   }
// };

// const FillInBlankSection = ({ formValues, testInSession,updateAnswer }) => {

//   useEffect(() => {
//     document.addEventListener("change", (e) => {
//       blankListener(e,formValues,updateAnswer);
//     });
//   }, [])
//   const { t } = useTranslation('common');

//   const blanks = (testInSession.fillInBlanksQuestions || {}).blanks || [];

//   const readingMaterials = testInSession.readingMaterials[3] || {};
//   const audioMaterials = testInSession.audioMaterials[3] || {};
//   const videoMaterials = testInSession.videoMaterials[3] || {};

//   const processedFillblankText = getProcessedFillblankText(testInSession, blanks, formValues, t);

//   return (
//     <Aux>
//       <TestMaterials
//         audioId={"fillBlankAudioMaterial"}
//         pdfIndex={1}
//         readingContent={readingMaterials.content}
//         audioSource={audioMaterials.audio}
//         videoSource={videoMaterials.video}
//         onPreview={() => previewAudio("fillBlankAudioMaterial")}
//         fileUpload={readingMaterials.fileUpload}
//       />
//       <div dangerouslySetInnerHTML={{ __html: processedFillblankText }} />

//     </Aux>
//   );
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     updateAnswer: (answer, index) => {
//       dispatch(
//         change("studentTest", `fillBlankQuestions.answers.${index}`, answer)
//       );
//     },
//   };
// };

// const wrappedForm = reduxForm({
//   form: "studentTest",
//   destroyOnUnmount: false,
//   forceUnregisterOnUnmount: true,
//   validate,
// })(FillInBlankSection);

// export default connect(null, mapDispatchToProps)(wrappedForm);

import React, { Component } from "react";
import ReactDOMServer from "react-dom/server";
import { connect } from "react-redux";
import { reduxForm, change } from "redux-form";
import validate from "./validate";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import reactStringReplace from "react-string-replace";
import classes from "./Test.module.css";
import ReactHtmlParser from "react-html-parser";
import TestMaterials from "./TestMaterials/TestMaterials";
import { previewAudio } from "../../../utility/audioRecorder";
import DOMPurify from "dompurify"
import { withTranslation } from "react-i18next";

class FillInBlankSection extends Component {
  componentDidMount() {
    document.addEventListener("change", (e) => {
      this.blankListener(e);
    });
  }

  blankListener = (e) => {
    const pattern = /\d+/;
    const index = parseInt((e.target.id.match(pattern) || [])[0]);
    const elementIds = (
      ((this.props.formValues || {}).fillBlankQuestions || {}).answers || []
    ).map((item, index) => {
      return `blank-input-[${index}]`;
    });
    if (elementIds.includes(e.target.id)) {
      this.props.updateAnswer(e.target.value, index);
    }
  };

  render() {
    
    const { formValues,t, testInSession = {} } = this.props;
    const blanks = (testInSession.fillInBlanksQuestions || {}).blanks || [];
    const replacedHtml = reactStringReplace(
      testInSession.fillInBlanksQuestions.text,
      "-BLANK-",
      (match, i) => {
        const idx = i / 2 - 0.5;
        const answerOptions = (blanks[idx] || []).answerOptions;
        if ((blanks[idx] || {}).selectableAnswer === true) {
          return (
            <Aux key={match + idx}>
              <span className={classes.BlankPreview}>{idx + 1} </span>
              {(blanks[idx] || []).audio && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(`
                      <audio id="audio[${idx}]" src="${
                      (blanks[idx] || {}).audio
                    }">
                        </audio>
                        <span class="${classes.Pointer}" onClick="(function(){
                          const audio = document.getElementById('audio[${idx}]');
                          audio.play()
                          return false;
                          })();return false;" >
                          <i class="fa fa-volume-down"></i>
                        </span>
                        `,{ADD_ATTR: ['src','onclick'],ADD_TAGS: ["audio"]}),
                  }}
                />
              )}
              <select
                readOnly
                className={classes.SelectField}
                id={`blank-input-[${idx}]`}
                onChange={() => console.log("this is just to prevent error")}
                value={
                  ((((formValues || {}).fillBlankQuestions || {}).answers || [])[
                    idx
                  ]||'').trim()
                }
              >
                <option>{t("testSession.fields.selectAnswer")}</option>
                {answerOptions.map((option, index) => (
                  <option
                    key={option + index}
                    value={(option || "").replace(/"/g, "'").trim()}
                  >
                    {ReactHtmlParser((option || "").replace(/"/g, "'"))}
                  </option>
                ))}
              </select>
            </Aux>
          );
        }
        if ((blanks[idx] || []).selectableAnswer === false) {
          return (
            <Aux key={match + idx}>
              <span className={classes.Inline}>
                <span className={classes.BlankPreview}>{idx + 1} </span>
                {(blanks[idx] || []).audio && (
                  <Aux>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(`
                        <audio id="audio[${idx}]" src="${
                          (blanks[idx] || {}).audio
                        }">
                        </audio>
                        <span class="${classes.Pointer}" onClick="(function(){
                          const audio = document.getElementById('audio[${idx}]');
                          audio.play()
                          return false;
                          })();return false;" >
                          <i class="fa fa-volume-down"></i>
                        </span>
                      `,{ADD_ATTR: ['src','onclick'],ADD_TAGS: ["audio"]}),
                      }}
                    />
                  </Aux>
                )}
                <input
                  type="text"
                  className={classes.InputField}
                  id={`blank-input-[${idx}]`}
                  onChange={() => console.log("this is just to prevent error")}
                  value={
                    (((formValues || {}).fillBlankQuestions || {}).answers ||
                      [])[idx]
                  }
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
    const joinedNewString = (newString || []).join("");
    const readingMaterials = testInSession.readingMaterials[3] || {};
    const audioMaterials = testInSession.audioMaterials[3] || {};
    return (
      <Aux>
        <TestMaterials
          audioId={"fillBlankAudioMaterial"}
          pdfIndex={1}
          readingContent={readingMaterials.content}
          audioSource={audioMaterials.audio}
          onPreview={() => previewAudio("fillBlankAudioMaterial")}
          fileUpload={readingMaterials.fileUpload}
        />
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(joinedNewString,{ADD_ATTR: ['src','onclick'],ADD_TAGS: ["audio"],}) }} />
      </Aux>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAnswer: (answer, index) => {
      dispatch(
        change("studentTest", `fillBlankQuestions.answers.${index}`, answer)
      );
    },
  };
};

const wrappedForm = reduxForm({
  form: "studentTest",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(FillInBlankSection);

export default connect(null, mapDispatchToProps)(withTranslation("common")(wrappedForm));