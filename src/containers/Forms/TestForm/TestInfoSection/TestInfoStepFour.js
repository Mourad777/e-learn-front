import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  change,
  getFormValues,
  getFormSyncErrors,
} from "redux-form";
import validate from "../validate";
import Switch from "../../../../components/UI/Switch/Switch";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import Editor from "../../../Editor/Editor";
import DropdownSelect from "../../../../components/UI/FormElements/DropdownSelect/DropdownSelect";
import FileInput from "../../../../components/UI/FormElements/FileInput/FileInput";
import Typography from "@material-ui/core/Typography";
import PdfViewer from "../../../../components/UI/PdfViewer/PdfViewer";
import { start, stop, previewAudio } from "../../../../utility/audioRecorder";
import {
  AudioPlayer,
  AudioPreview,
  ClearAudioButton,
} from "../../../../components/UI/AudioPlayer/AudioPlayerRecorder";
import VideoPlayer from "../../../../components/UI/VideoPlayer/VideoPlayer";
import "../Test.css";
import { useTranslation } from "react-i18next";

const TestInfoStepFour = ({
  formValues = {},
  changeField,
  errors,
  isTest,
  path,
}) => {
  const { t } = useTranslation("common");
  const [micBlockedWarning, setMicBlockedWarning] = useState(false);
  const [micBlockedWarningTO, setMicBlockedWarningTO] = useState(null);
  const handleMicAlert = () => {
    clearTimeout(micBlockedWarningTO);
    setMicBlockedWarning(true);

    const timeoutId = setTimeout(() => {
      setMicBlockedWarning(false);
    }, 5000);
    setMicBlockedWarningTO(timeoutId);
  };

  useEffect(() => {
    return () => {
      clearTimeout(micBlockedWarningTO);
    };
  }, []);
  const videoMaterial = formValues.videoMaterial || {};
  const audioMaterial = formValues.audioMaterial || {};
  const readingMaterial = formValues.readingMaterial || {};
  const switchOptionsReadingMaterial = {
    label: t("testForm.fields.useUploadDoc"),
    checked: false,
  };

  const switchOptionsAudioMaterial = {
    label: t("testForm.fields.useUploadAudio"),
    checked: false,
  };
  const materialsDisplay = formValues.materialsDisplay || "";
  const recordingTimeout = (
    (formValues.audioMaterial || [])[materialsDisplay] || {}
  ).recordingTimeout;
  const recorderFromClick =
    ((formValues.audioMaterial || [])[materialsDisplay] || {}).recorder || {};
  const selectedTestSections = formValues.testSections || [];
  const isMcSection = selectedTestSections.includes("mc");
  const isEssaySection = selectedTestSections.includes("essay");
  const isSpeakingSection = selectedTestSections.includes("speaking");
  const isFillblanksSection = selectedTestSections.includes("fillblanks");
  const dropdownOptions = [
    isMcSection
      ? { value: "multipleChoice", primaryText: t("testForm.fields.mc") }
      : null,
    isEssaySection ? { value: "essay", primaryText: t("testForm.fields.essay") } : null,
    isSpeakingSection ? { value: "speaking", primaryText: t("testForm.fields.speaking") } : null,
    isFillblanksSection
      ? { value: "fillInTheBlanks", primaryText: t("testForm.fields.fillblanks") }
      : null,
    {
      value: "test",
      primaryText: isTest
        ? t("testForm.fields.atBeginningOfTest")
        : t("testForm.fields.atBeginningOfAssignment"),
    },
  ].filter((item) => item);
  const initiateRecording = (recorder, timeout, index, isRecording) => {
    if (!isRecording) {
      handleMicAlert();
      return;
    }
    changeField(`audioMaterial.${index}.recording`, isRecording);
    changeField(`audioMaterial.${index}.recorder`, recorder);
    changeField(`audioMaterial.${index}.recordingTimeout`, timeout);
  };
  const setAudioData = (blob, file, index) => {
    changeField(`audioMaterial.${index}.recording`, false);
    changeField(`audioMaterial.${index}.recordedBlob`, blob);
    changeField(`audioMaterial.${index}.audioFile`, file);
  };

  const audioRecording = (
    (formValues.audioMaterial || {})[materialsDisplay] || {}
  ).recording;
  const loadedVideo = (
    (formValues.videoMaterial || {})[materialsDisplay] || {}
  ).videoBlob;
  const audioSource = (audioMaterial[materialsDisplay] || {}).recordedBlob;
  const materialSections = [
    "multipleChoice",
    "essay",
    "speaking",
    "fillInTheBlanks",
    "test",
  ];
  //see if a pdf file exceeded the file size, if so disable the dropdown select so that the
  //user knows which section to fix
  const pdfFileSizeExceeded = materialSections.find(
    (section) => ((errors.readingMaterial || {})[section] || {}).file
  );
  const audioFileSizeExceeded = materialSections.find(
    (section) => ((errors.audioMaterial || {})[section] || {}).audioFile
  );
  const videoFileSizeExceeded = materialSections.find(
    (section) => ((errors.videoMaterial || {})[section] || {}).videoFile
  );

  let readingMaterialFileExtension;
  if ((readingMaterial[materialsDisplay] || {}).file instanceof File) {
    readingMaterialFileExtension = (
      ((readingMaterial[materialsDisplay] || {}).file || {}).name || ""
    )
      .split(".")
      .pop();
  } else {
    readingMaterialFileExtension = (
      (readingMaterial[materialsDisplay] || {}).file || ""
    )
      .split(".")
      .pop();
  }
  return (
    <Aux>
      <Typography paragraph variant="h4" gutterBottom>
        {isTest
          ? t("testForm.testResources")
          : t("testForm.assignmentResources")}
      </Typography>
      <Field
        name="materialsDisplay"
        component={DropdownSelect}
        label={t("testForm.fields.section")}
        variant="outlined"
        options={dropdownOptions}
        disabled={pdfFileSizeExceeded || audioFileSizeExceeded || videoFileSizeExceeded ? true : false}
      />
      {materialsDisplay && (
        <Aux>
          <Typography paragraph variant="h6" gutterBottom>
            {t("testForm.text")}
          </Typography>
          <Field
            name={`readingMaterial.${materialsDisplay}.fileUpload`}
            options={switchOptionsReadingMaterial}
            component={Switch}
            type="checkbox"
          />
          {(readingMaterial[materialsDisplay] || {}).fileUpload && (
            <Aux>
              <div style={{ textAlign: "center" }}>
                <Field
                  name={`readingMaterial.${materialsDisplay}.file`}
                  onChangeFile={(pdf) => {
                    changeField(
                      `readingMaterial.${materialsDisplay}.loadedPDF`,
                      pdf
                    );
                  }}
                  fullSizeImage
                  index={materialsDisplay}
                  loadedFile={
                    (readingMaterial[materialsDisplay] || {}).loadedPDF
                  }
                  uploadButtonText={t("testForm.buttons.selectDoc")}
                  component={FileInput}
                  mimeTypesAllowed={
                    "image/jpeg, application/pdf, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  }
                  extensionsAllowed={[
                    "jpeg",
                    "jpg",
                    "jfif",
                    "pdf",
                    "docx",
                    "doc",
                  ]}
                />
              </div>
              {(readingMaterial[materialsDisplay] || {}).loadedPDF &&
                readingMaterialFileExtension === "pdf" && (
                  <PdfViewer
                    url={(readingMaterial[materialsDisplay] || {}).loadedPDF}
                    index={materialsDisplay}
                  />
                )}
            </Aux>
          )}

          {!(readingMaterial[materialsDisplay] || {}).fileUpload && (
            <Aux>
              {materialSections.map(
                (section) =>
                  section === materialsDisplay && (
                    <Field
                      key={materialsDisplay}
                      name={`readingMaterial.${materialsDisplay}.content`}
                      component={Editor}
                      reduxForm="testForm"
                      field={`readingMaterial.${materialsDisplay}.content`}
                      path={path}
                    />
                  )
              )}
            </Aux>
          )}
          {materialsDisplay && (
            <Aux>
              <Typography paragraph variant="h6" gutterBottom>
                {t("testForm.video")}
              </Typography>
              <div style={{ textAlign: "center" }}>
                <Field
                  name={`videoMaterial.${materialsDisplay}.videoFile`}
                  onChangeFile={(file) => {
                    changeField(
                      `videoMaterial.${materialsDisplay}.videoBlob`,
                      file
                    );
                  }}

                  uploadButtonText={t("testForm.buttons.selectVideoFile")}

                  index={`materialSectionVideo[${materialsDisplay}]`}
                  component={FileInput}
                  loadedFile={loadedVideo}
                  onClear={() => {
                    changeField(`videoMaterial.${materialsDisplay}.videoBlob`, null);
                    changeField(`videoMaterial.${materialsDisplay}.videoFile`, null);
                  }}
                  videoFile
                  mimeTypesAllowed={"video/*,video/x-matroska"}
                  extensionsAllowed={["mp4", "avi", "mov", "mkv", "webm"]}
                >
                  {loadedVideo && (
                    <VideoPlayer
                      url={loadedVideo}
                    />
                  )}
                </Field>
              </div>
            </Aux>
          )}
          <Typography paragraph variant="h6" gutterBottom>
            {t("testForm.audio")}
          </Typography>

          <Field
            name={`audioMaterial.${materialsDisplay}.fileUpload`}
            options={switchOptionsAudioMaterial}
            component={Switch}
            type="checkbox"
          />
        </Aux>
      )}


      {materialsDisplay && (
        <Aux>
          {(audioMaterial[materialsDisplay] || {}).fileUpload ? (
            <Aux>
              <div
                style={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "space-between",
                  margin: "auto",
                  width: "60%",
                }}
              >
                <Field
                  name={`audioMaterial.${materialsDisplay}.audioFile`}
                  component={FileInput}
                  uploadButtonText={t("testForm.buttons.selectAudioFile")}
                  index={`materialSectionAudio[${materialsDisplay}]`}
                  onChangeFile={(audio) => {
                    changeField(
                      `audioMaterial.${materialsDisplay}.recordedBlob`,
                      audio
                    );
                  }}
                  loadedFile={audioRecording}
                  mimeTypesAllowed={"audio/*"}
                  extensionsAllowed={["mp3", "wav", "wma"]}
                  mimeTypesAllowed={"audio/*"}
                  extensionsAllowed={["mp3", "wav", "wma"]}
                />
                <AudioPreview
                  onPreview={() => {
                    if (!audioSource) return;
                    previewAudio(`audioMaterial[${materialsDisplay}]`);
                  }}
                  id={`audioMaterial[${materialsDisplay}]`}
                  audioSource={audioSource}
                />
              </div>
              <ClearAudioButton
                onClear={() => setAudioData(null, null, materialsDisplay)}
              />
            </Aux>
          ) : (
            <AudioPlayer
              onStart={async (e) => {
                const startData =
                  (await start(
                    e,
                    null,
                    materialsDisplay,
                    null,
                    async (data) => {
                      const timeoutData = await data;
                      setAudioData(
                        timeoutData.blob,
                        timeoutData.file,
                        materialsDisplay
                      );
                    }
                  )) || {};
                initiateRecording(
                  startData.recorder,
                  startData.recordingTimeout,
                  materialsDisplay,
                  startData.isRecording
                );
              }}
              onStop={async (e) => {
                const stoppedData =
                  (await stop(
                    e,
                    null,
                    materialsDisplay,
                    recordingTimeout,
                    recorderFromClick
                  )) || {};
                setAudioData(
                  stoppedData.blob,
                  stoppedData.file,
                  materialsDisplay
                );
              }}
              onPreview={() => {
                previewAudio(`audioMaterial[${materialsDisplay}]`);
              }}
              onClear={() => setAudioData(null, null, materialsDisplay)}
              id={`audioMaterial[${materialsDisplay}]`}
              recordDisabled={audioRecording}
              audioSource={audioSource}
              isMicAlert={micBlockedWarning}
            />
          )}
        </Aux>
      )}
    </Aux>
  );
};

const mapStateToProps = (state, myProps) => {
  return {
    formValues: getFormValues("testForm")(state),
    errors: getFormSyncErrors("testForm")(state),
    editing: state.common.editing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeField: (field, value) => {
      dispatch(change("testForm", field, value));
    },
  };
};

const wrappedForm = reduxForm({
  form: "testForm",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(TestInfoStepFour);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
