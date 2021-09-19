import React, { useEffect, useState } from 'react'
import { start, stop, previewAudio } from "../../../../utility/audioRecorder";
import { AudioPlayer } from "../../../../components/UI/AudioPlayer/AudioPlayerRecorder";
import {
    setAudioData,
    getRecorderFromClickQuestion,
    getRecordingTimeoutQuestion,
    initiateRecording,
} from './util';
import {
    Field,
    change,
    touch,
    getFormValues,
} from "redux-form";
import { connect } from 'react-redux';
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import { useTranslation } from 'react-i18next';

const AudioFunctionality = ({ blankIndex, FileInput, form, answers, changeField, touchField, formValues }) => {

    const [micBlockedWarning, setMicBlockedWarning] = useState(false)
    const [micBlockedWarningTO, setMicBlockedWarningTO] = useState([])

    useEffect(() => {
        return () => {
            clearTimeout(micBlockedWarningTO);
        }
    }, []);

    const { t } = useTranslation('common');
    return (

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
                            setAudioData(
                                timeoutData.blob,
                                timeoutData.file,
                                blankIndex,
                                changeField,
                                touchField,
                                form,
                            );
                        })) || {};
                    initiateRecording(
                        startData.recorder,
                        startData.recordingTimeout,
                        blankIndex,
                        startData.isRecording,
                        changeField,
                        form,
                        micBlockedWarningTO,
                        setMicBlockedWarning,
                        setMicBlockedWarningTO
                    );
                }}
                onStop={async (e) => {
                    const stoppedData =
                        (await stop(
                            e,
                            null,
                            blankIndex,
                            getRecordingTimeoutQuestion(blankIndex, formValues),
                            getRecorderFromClickQuestion(blankIndex, formValues)
                        )) || {};
                    setAudioData(
                        stoppedData.blob,
                        stoppedData.file,
                        blankIndex,
                        changeField,
                        touchField,
                        form,
                    );
                }}
                onPreview={() => {
                    previewAudio(`audioQuestion[${blankIndex}]`);
                }}
                onClear={() => setAudioData(
                    null,
                    null,
                    blankIndex,
                    changeField,
                    touchField,
                    form
                )}
                id={`audioQuestion[${blankIndex}]`}
                recordDisabled={(answers[blankIndex] || {}).recordingQuestion}
                audioSource={(answers[blankIndex] || {}).browserAudioFile}
                isMicAlert={micBlockedWarning}
            />
        </Aux>
    );

}

const mapStateToProps = (state, { form }) => {
    return {
      formValues: getFormValues(form)(state),
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
        changeField: (form, field, value) => {
            dispatch(change(form, field, value));
        },
        touchField: (form, field) => {
            dispatch(touch(form, field));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioFunctionality);
