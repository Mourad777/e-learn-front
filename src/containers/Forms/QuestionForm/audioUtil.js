import React, { useState, useEffect } from 'react';
import { AudioPlayer } from "../../../components/UI/AudioPlayer/AudioPlayerRecorder";
import { start, stop, previewAudio } from "../../../utility/audioRecorder";
import { Field, getFormValues, touch, change } from "redux-form";
import { connect } from "react-redux";
import { useTranslation } from 'react-i18next';
import Aux from "../../../hoc/Auxiliary/Auxiliary";

const handleMicAlert = (
    micBlockedWarningTO, 
    setMicBlockedWarning, 
    setMicBlockedWarningTO
    ) => {
    clearTimeout(micBlockedWarningTO);
    setMicBlockedWarning(true);

    const timeoutId = setTimeout(() => {
        setMicBlockedWarning(false);
    }, 5000);
    setMicBlockedWarningTO(timeoutId);
};

const initiateRecording = (
    recorder, 
    timeout, 
    index, 
    type, 
    isRecording, 
    micBlockedWarningTO, 
    setMicBlockedWarning, 
    setMicBlockedWarningTO, 
    changeField, 
    ) => {
    if (!isRecording) {
        handleMicAlert(micBlockedWarningTO, setMicBlockedWarning, setMicBlockedWarningTO);
        return;
    }
    if (type === "question") {
        changeField(`speakingQuestion.${index}.isRecordingQuestion`, isRecording);
        changeField(`speakingQuestion.${index}.questionRecorder`, recorder);
        changeField(
            `speakingQuestion.${index}.questionRecordingTimeout`,
            timeout
        );
    }
    if (type === "answer") {
        changeField(`speakingQuestion.${index}.isRecording`, true);
        changeField(`speakingQuestion.${index}.recorder`, recorder);
        changeField(`speakingQuestion.${index}.recordingTimeout`, timeout);
    }
};

const setAudioData = (
    blob, 
    file, 
    index, 
    type, 
    changeField, 
    makeAudioFieldTouched, 
    ) => {
    if (type === "question") {
        changeField(`speakingQuestion.${index}.isRecordingQuestion`, false);
        changeField(`speakingQuestion.${index}.questionRecordedBlob`, blob);
        changeField(`speakingQuestion.${index}.audioFileQuestion`, file);
        makeAudioFieldTouched(`speakingQuestion.${index}.questionRecordedBlob`);
    }
    if (type === "answer") {
        changeField(`speakingQuestion.${index}.isRecording`, false);
        changeField(`speakingQuestion.${index}.recordedBlob`, blob);
        changeField(`speakingQuestion.${index}.audioFile`, file);
        makeAudioFieldTouched(`speakingQuestion.${index}.recordedBlob`);
    }
};

const mapStateToProps = (state, myProps) => {
    return {
        formValues: getFormValues("questionForm")(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeField: (field, value) => {
            dispatch(change("questionForm", field, value));
        },
        makeAudioFieldTouched: (field) => {
            dispatch(touch("questionForm", field));
        },
    };
};

export const Player = connect(mapStateToProps, mapDispatchToProps)(({ formValues, makeAudioFieldTouched, changeField, index, isQuestion, isAnswer }) => {

    const { t } = useTranslation();
    const [micBlockedWarning, setMicBlockedWarning] = useState(false);
    const [micBlockedWarningTO, setMicBlockedWarningTO] = useState(false);
    useEffect(() => {
        return () => {
            clearTimeout(micBlockedWarningTO);
        };
    }, []);

    const speakingQuestion = (formValues.speakingQuestion || [])[index] || {};
    const recordingTimeoutAnswer = speakingQuestion.recordingTimeout;
    const recordingTimeoutQuestion = speakingQuestion.questionRecordingTimeout;
    const recorderFromClickAnswer = speakingQuestion.recorder;
    const recorderFromClickQuestion = speakingQuestion.questionRecorder;
    const audioSourceQuestion = speakingQuestion.questionRecordedBlob;
    const audioSourceAnswer = speakingQuestion.recordedBlob;
    const questionIsRecording = speakingQuestion.isRecordingQuestion;
    const answerIsRecording = speakingQuestion.isRecording;
 
    return (
        <Aux>
            {[ isQuestion ?"question": "answer"].map((type) => (
                <Field
                    component={AudioPlayer}
                    name={`speakingQuestion.${index}.${isQuestion ? "questionRecordedBlob" : "recordedBlob"
                        }`}
                    onStart={async (e) => {
                        const startData =
                            (await start(e, type, index, null, async (data) => {
                                const timeoutData = await data;
                                setAudioData(timeoutData.blob, timeoutData.file, index, type, changeField, makeAudioFieldTouched);
                            })) || {};
                        initiateRecording(
                            startData.recorder,
                            startData.recordingTimeout,
                            index,
                            type,
                            startData.isRecording,
                            micBlockedWarningTO,
                            setMicBlockedWarning,
                            setMicBlockedWarningTO,
                            changeField,
                        );
                    }}
                    onStop={async (e) => {
                        const stoppedData =
                            (await stop(
                                e,
                                null,
                                index,
                                isQuestion ? recordingTimeoutQuestion : recordingTimeoutAnswer,
                                isQuestion
                                    ? recorderFromClickQuestion
                                    : recorderFromClickAnswer
                            )) || {};
                        setAudioData(stoppedData.blob, stoppedData.file, index, type, changeField, makeAudioFieldTouched, index);
                    }}
                    onPreview={() => {
                        previewAudio(
                            isQuestion ? `audioQuestion[${index}]` : `audioAnswer[${index}]`
                        );
                    }}
                    onClear={() => setAudioData(null, null, index, type, changeField, makeAudioFieldTouched)}
                    id={isQuestion ? `audioQuestion[${index}]` : `audioAnswer[${index}]`}
                    recordDisabled={isQuestion ? questionIsRecording : answerIsRecording}
                    audioSource={isQuestion ? audioSourceQuestion : audioSourceAnswer}
                    isMicAlert={micBlockedWarning}
                />
            ))}
        </Aux>
    )
})