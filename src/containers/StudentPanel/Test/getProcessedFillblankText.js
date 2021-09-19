import React from 'react';
import reactStringReplace from "react-string-replace";
import classes from "./Test.module.css";
import ReactHtmlParser from "react-html-parser";
import ReactDOMServer from "react-dom/server";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import DOMPurify from "dompurify"

export const getProcessedFillblankText = (testInSession,blanks,formValues,t) => {

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

      return DOMPurify.sanitize(joinedNewString,{ADD_ATTR: ['src','onclick'],ADD_TAGS: ["audio"],})
}