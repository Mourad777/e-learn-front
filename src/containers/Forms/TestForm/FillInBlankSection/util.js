const handleMicAlert = (micBlockedWarningTO,setMicBlockedWarning,setMicBlockedWarningTO) => {
    clearTimeout(micBlockedWarningTO);
    setMicBlockedWarning(true)
  
    const timeoutId = setTimeout(() => {
      setMicBlockedWarning(false)
    }, 5000);
    setMicBlockedWarningTO(timeoutId)
  };
  
  export const initiateRecording = (recorder, timeout, index, isRecording,changeField,form,micBlockedWarningTO,setMicBlockedWarning,setMicBlockedWarningTO) => {
    if (!isRecording) {
      handleMicAlert(micBlockedWarningTO,setMicBlockedWarning,setMicBlockedWarningTO);
      return;
    }
    const answersPath = "fillBlankQuestions.answers";
    changeField(form, `${answersPath}.${index}.recordingQuestion`, isRecording);
    changeField(form, `${answersPath}.${index}.questionRecorder`, recorder);
    changeField(
      form,
      `${answersPath}.${index}.questionRecordingTimeout`,
      timeout
    );
  };
  
  export const setAudioData = (blob, file, index, changeField, touchField, form) => {
    const answersPath = "fillBlankQuestions.answers";
    changeField(form, `${answersPath}.${index}.recordingQuestion`, false);
    changeField(form, `${answersPath}.${index}.browserAudioFile`, blob);
    changeField(form, `${answersPath}.${index}.audioFile`, file);
    touchField(form, `${answersPath}.${index}.browserAudioFile`);
  };
  
  export const getRecordingTimeoutQuestion = (index, formValues) => {
    const recordingTimeoutQuestion = (
      ((formValues.fillBlankQuestions || []).answers || [])[index] || {}
    ).questionRecordingTimeout;
    return recordingTimeoutQuestion;
  }
  
  export const getRecorderFromClickQuestion = (index, formValues) => {
    const recorderFromClickQuestion = (
      ((formValues.fillBlankQuestions || []).answers || [])[index] || {}
    ).questionRecorder;
    return recorderFromClickQuestion;
  }
  
  export const touchIncorrectAnswerFields = (index,touchField,form) => {
    const path = `fillBlankQuestions.answers.${index}.answerOptions.incorrectAnswer`;
    ["One", "Two", "Three"].forEach((option) => {
      touchField(form, path + option);
    });
  }
  
  export const handleBlockSync = (block,setBlockSync) => {
    setBlockSync(block ? true : false)
  }