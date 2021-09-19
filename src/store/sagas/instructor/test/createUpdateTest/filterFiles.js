export const filterFiles = (formData) => {
  //helper function to make sure that we only
  //upload files if the user selected the upload
  //file option, do not unnecessarly update document
  //with pdf files, content, audio files
  const checkSection = (list) => {
    const filteredList = (list || []).map((item, index) => {
      if (index === 0 && !formData.mcSectionWeight) return null;
      if (index === 1 && !formData.essaySectionWeight) return null;
      if (index === 2 && !formData.speakingSectionWeight) return null;
      if (index === 3 && !formData.fillBlankSectionWeight) return null;
      return item;
    });

    return filteredList;
  };

  const rm = formData.readingMaterial || {};
  const rmMc = rm.multipleChoice || {};
  const rmEs = rm.essay || {};
  const rmSp = rm.speaking || {};
  const rmFill = rm.fillInTheBlanks || {};
  const rmT = rm.test || {};

  const pdfFilesReadingMaterial = checkSection([
    rmMc.fileUpload ? rmMc.file : rmMc.content,
    rmEs.fileUpload ? rmEs.file : rmEs.content,
    rmSp.fileUpload ? rmSp.file : rmSp.content,
    rmFill.fileUpload ? rmFill.file : rmFill.content,
    rmT.fileUpload ? rmT.file : rmT.content,
  ]);

  const am = formData.audioMaterial || {};
  const audioFilesListeningMaterial = checkSection([
    (am.multipleChoice || {}).audioFile,
    (am.essay || {}).audioFile,
    (am.speaking || {}).audioFile,
    (am.fillInTheBlanks || {}).audioFile,
    (am.test || {}).audioFile,
  ]);
  const vm = formData.videoMaterial || {};
  const videoFilesWatchingMaterial = checkSection([
    (vm.multipleChoice || {}).videoFile,
    (vm.essay || {}).videoFile,
    (vm.speaking || {}).videoFile,
    (vm.fillInTheBlanks || {}).videoFile,
    (vm.test || {}).videoFile,
  ]);
  return {
    pdfFilesReadingMaterial,
    audioFilesListeningMaterial,
    videoFilesWatchingMaterial,
    rm,
    am,
    vm,
    rmMc,
    rmEs,
    rmSp,
    rmFill,
    rmT,
  };
};
