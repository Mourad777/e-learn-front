import React from 'react'
import ReactDOMServer from "react-dom/server";
import reactStringReplace from "react-string-replace";
import classes from "./Details.module.css";
import DOMPurify from "dompurify";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";

export const getProcessedFillblankText = (test,t) => {

    const htmlString = (test.fillInBlanksQuestions || "").text;

    const answersList = (test.fillInBlanksQuestions || "").blanks;
    
    const replacedHtml = reactStringReplace(
      htmlString || "",
      /<mark [^>]+>(.*?)<\/mark>/g,
      (match, i) => {
        const indexMatch = i / 2 - 0.5;
  
        const correctAnswer = ((answersList || [])[indexMatch] || {})
          .correctAnswer;
        if (((answersList || [])[indexMatch] || {}).selectableAnswer === true) {
          return (
            <Aux key={match + indexMatch}>
              <span className={classes.BlankPreview}>{indexMatch + 1} </span>
              {((answersList || [])[indexMatch] || {}).audio && (
                <td
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      `
                    <audio id="audio[${indexMatch}]" src="${
                        ((answersList || [])[indexMatch] || {}).audio
                      }"> </source>
                    </audio>
                     <span class="${classes.Pointer}" onClick="(function(){
                       const audio = document.getElementById('audio[${indexMatch}]');
                       audio.play()
                       return false;
                       })();return false;" >
                       <i class="fa fa-volume-down"></i>
                       </span>
                  `,
                      { ADD_ATTR: ["src", "onclick"], ADD_TAGS: ["audio"] }
                    ),
                  }}
                />
              )}
              <select
                readOnly
                value={t("testReview.selectCorrectAnswer")}
                className={classes.SelectField}
              >
                <option disabled>{t("testReview.selectCorrectAnswer")}</option>
                <option
                  className={classes.CorrectAnswerHighlight}
                  disabled
                  value="Correct Option"
                >
                  {correctAnswer}
                </option>
                {(((answersList || [])[indexMatch] || {}).incorrectAnswers ||
                  [])[0] && (
                  <option disabled value="Incorrect Option 1">
                    {
                      (((answersList || [])[indexMatch] || {}).incorrectAnswers ||
                        [])[0]
                    }
                  </option>
                )}
                {(((answersList || [])[indexMatch] || {}).incorrectAnswers ||
                  [])[1] && (
                  <option disabled value="Incorrect Option 2">
                    {
                      (((answersList || [])[indexMatch] || {}).incorrectAnswers ||
                        [])[1]
                    }
                  </option>
                )}
                {(((answersList || [])[indexMatch] || {}).incorrectAnswers ||
                  [])[2] && (
                  <option disabled value="Incorrect Option 3">
                    {
                      (((answersList || [])[indexMatch] || {}).incorrectAnswers ||
                        [])[2]
                    }
                  </option>
                )}
              </select>
            </Aux>
          );
        }
        if ((answersList[indexMatch] || {}).selectableAnswer === false) {
          return (
            <Aux key={match + indexMatch}>
              <span className={classes.Inline}>
                <span className={classes.BlankPreview}>{indexMatch + 1} </span>
                {((answersList || [])[indexMatch] || {}).audio && (
                  <Aux>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          `
                          <audio id="audio[${indexMatch}]" src="${
                            ((answersList || [])[indexMatch] || {}).audio
                          }"> </source>
                          </audio>
                          <span class="${classes.Pointer}" onClick="(function(){
                          const audio = document.getElementById('audio[${indexMatch}]');
                          audio.play()
                          return false;
                          })();return false;" >
                          <i class="fa fa-volume-down"></i>
                          </span>
                      `,
                          { ADD_ATTR: ["src", "onclick"], ADD_TAGS: ["audio"] }
                        ),
                      }}
                    />
                  </Aux>
                )}
                <input
                  readOnly
                  type="text"
                  className={classes.InputField}
                  value={`${correctAnswer}`}
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
  
    const joinedNewString = (newString || "").join("");

    return DOMPurify.sanitize(joinedNewString, {
        ADD_ATTR: ["src", "onclick"],
        ADD_TAGS: ["audio"],
      });
}