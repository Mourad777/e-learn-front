export const adjustedModulesSchema = (modules) => {
  const adjustedFormData = modules.map((module) => {
    const adjustedModuleFolder = [];
    ((module || {}).lessons || {}).forEach((document) => {
      adjustedModuleFolder.push({
        documentType: "lesson",
        documentId: document,
      });
    });
    ((module || {}).tests || []).forEach((document) => {
      adjustedModuleFolder.push({
        documentType: "test",
        documentId: document,
      });
    });
    ((module || {}).assignments || []).forEach((document) => {
      adjustedModuleFolder.push({
        documentType: "assignment",
        documentId: document,
      });
    });

    const adjustedSubjects = ((module || {}).subjects || []).map((subject) => {
      const adjustedSubjectFolder = [];
      ((subject || {}).lessons || {}).forEach((document) => {
        adjustedSubjectFolder.push({
          documentType: "lesson",
          documentId: document,
        });
      });
      ((subject || {}).tests || []).forEach((document) => {
        adjustedSubjectFolder.push({
          documentType: "test",
          documentId: document,
        });
      });
      ((subject || {}).assignments || []).forEach((document) => {
        adjustedSubjectFolder.push({
          documentType: "assignment",
          documentId: document,
        });
      });

      const adjustedTopics = ((subject || {}).topics || []).map((topic) => {
        const adjustedTopicFolder = [];
        ((topic || {}).lessons || {}).forEach((document) => {
          adjustedTopicFolder.push({
            documentType: "lesson",
            documentId: document,
          });
        });
        ((topic || {}).tests || []).forEach((document) => {
          adjustedTopicFolder.push({
            documentType: "test",
            documentId: document,
          });
        });
        ((topic || {}).assignments || []).forEach((document) => {
          adjustedTopicFolder.push({
            documentType: "assignment",
            documentId: document,
          });
        });
        return { ...topic, folder: adjustedTopicFolder };
      });
      return {
        ...subject,
        folder: adjustedSubjectFolder,
        topics: adjustedTopics,
      };
    });
    return {
      ...module,
      folder: adjustedModuleFolder,
      subjects: adjustedSubjects,
    };
  });
  if(adjustedFormData.length === 0){
    return [{subjects:[],lessons:[],tests:[],assignments:[],moduleName:'',isDisabled:true}]
  }
  return adjustedFormData;
};
