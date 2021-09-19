import React from 'react';
import IncorrectStaticSelectableOptions from "./IncorrectStaticSelectableOptions";
import InlineAudioPlayer from "../../../../components/UI/AudioPlayer/InlineAudioPlayer";
import ReactHtmlParser from "react-html-parser";
import reactStringReplace from "react-string-replace";
// import DebounceField from "redux-form-debounce-field";
import ReactDOMServer from "react-dom/server";
import DOMPurify from "dompurify";
import classes from "../TestForm.module.css";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";

export const getProcessedFillblankText = (htmlString,answers,t) => {
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

    return DOMPurify.sanitize(joinedNewString, {
        ALLOW_UNKNOWN_PROTOCOLS: true,
        ADD_ATTR: ["src", "onclick"],
        ADD_TAGS: ["audio"],
    })

}