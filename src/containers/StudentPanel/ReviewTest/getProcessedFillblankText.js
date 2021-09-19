import React from 'react'
import DOMPurify from "dompurify";
import reactStringReplace from "react-string-replace";
import ReactDOMServer from "react-dom/server";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import classes from "./ReviewTest.module.css";

export const getProcessedFillblankText = (htmlString,answersList, studentInput) => {

    const replacedHtml = reactStringReplace(
        htmlString || "",
        /<mark [^>]+>(.*?)<\/mark>/g,
        (match, i) => {
          const idx = i / 2 - 0.5;
          const answer = answersList[idx] || {};
          const correctAnswer = answer.correctAnswer;
          if (answer.selectableAnswer === true) {
            const selAns = (
              (studentInput || []).find(
                (item) => item.questionNumber === idx + 1
              ) || {}
            ).answer;
            return (
              <Aux key={match + idx}>
                <span className={classes.BlankPreview}>{idx + 1} </span>
                {answer.audio && (
                  <td
                    dangerouslySetInnerHTML={{
                      __html: `
                    <audio id="audio[${idx}]" src="${answer.audio}">
                    </audio>
                     <span class="${classes.Pointer}" onClick="(function(){
                       const audio = document.getElementById('audio[${idx}]');
                       audio.play()
                       return false;
                       })();return false;" >
                       <i class="fa fa-volume-down"></i>
                       </span>
                  `,
                    }}
                  />
                )}
                <select
                  readOnly
                  value="student selected"
                  className={classes.SelectField}
                >
                  <option
                    disabled
                    value={
                      correctAnswer === selAns
                        ? "student selected"
                        : "Correct Option"
                    }
                  >
                    {correctAnswer}
                  </option>
                  {["1", "2", "3"].map((option, index) => (
                    <option
                      disabled
                      key={`incorrectOption[${option}]`}
                      value={
                        (answer.incorrectAnswers || [])[index] === selAns
                          ? "student selected"
                          : `Incorrect option ${option}`
                      }
                    >
                      {(answer.incorrectAnswers || [])[index]}
                    </option>
                  ))}
                </select>
                {correctAnswer === selAns ? (
                  <span className={classes.GreenText}>
                    <i className="fa fa-check"></i>
                  </span>
                ) : (
                  <span className={classes.RedText}>
                    <i className="fa fa-times"></i>
                  </span>
                )}
              </Aux>
            );
          }
          if (answer.selectableAnswer === false) {
            const studentEssayAnswer = (
              (studentInput || []).find(
                (item) => item.questionNumber === idx + 1
              ) || {}
            ).answer;
            return (
              <Aux key={match + idx}>
                <span className={classes.Inline}>
                  <span className={classes.BlankPreview}>{idx + 1} </span>
                  {answer.audio && (
                    <Aux>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: `
                          <audio id="audio[${idx}]" src="${answer.audio}">
                          </audio>
                          <span class="${classes.Pointer}" onClick="(function(){
                          const audio = document.getElementById('audio[${idx}]');
                          audio.play()
                          return false;
                          })();return false;" >
                          <i class="fa fa-volume-down"></i>
                          </span>
                      `,
                        }}
                      />
                    </Aux>
                  )}
                  <input
                    readOnly
                    type="text"
                    className={classes.InputField}
                    value={`${studentEssayAnswer || ""}`}
                  />
                  {(correctAnswer || "").toLowerCase() ===
                  (studentEssayAnswer || "").toLowerCase() ? (
                    <span className={classes.GreenText}>
                      <i className="fa fa-check"></i>
                    </span>
                  ) : (
                    <span className={classes.RedText}>
                      <i className="fa fa-times"></i>
                    </span>
                  )}
                </span>
              </Aux>
            );
          }
        }
      )

      const htmlContent = [];

      replacedHtml.forEach((element, index) => {
        if (typeof element === "string") {
          htmlContent.push(element);
        } else {
          htmlContent.push(ReactDOMServer.renderToString(element));
        }
      });

      return DOMPurify.sanitize(htmlContent.join(""), {
        ADD_ATTR: ["src", "onclick"],
        ADD_TAGS: ["audio"],
      })

}