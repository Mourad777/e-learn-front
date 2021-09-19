export const adjustModules = (formValues) => {
    let modules = "";
    ((formValues || {}).modules || []).forEach((module) => {
      let subjects = "";
      let moduleLessons = "";
      let moduleTests = "";
      let moduleAssignments = "";
  
      ((module || {}).folder || []).forEach((document) => {
        if (document.documentType === "lesson")
          moduleLessons += `"${document.documentId}",`;
      });
      ((module || {}).folder || []).forEach((document) => {
        if (document.documentType === "test")
          moduleTests += `"${document.documentId}",`;
      });
      ((module || {}).folder || []).forEach((document) => {
        if (document.documentType === "assignment")
          moduleAssignments += `"${document.documentId}",`;
      });
  
      ((module || {}).subjects || []).forEach((subject) => {
        let topics = "";
        let subjectLessons = "";
        let subjectTests = "";
        let subjectAssignments = "";
  
        ((subject || {}).folder || []).forEach((document) => {
          if (document.documentType === "lesson")
            subjectLessons += `"${document.documentId}",`;
        });
        ((subject || {}).folder || []).forEach((document) => {
          if (document.documentType === "test")
            subjectTests += `"${document.documentId}",`;
        });
        ((subject || {}).folder || []).forEach((document) => {
          if (document.documentType === "assignment")
            subjectAssignments += `"${document.documentId}",`;
        });
  
        ((subject || {}).topics || []).forEach((topic) => {
          let topicLessons = "";
          let topicTests = "";
          let topicAssignments = "";
  
          ((topic || {}).folder || []).forEach((document) => {
            if (document.documentType === "lesson")
              topicLessons += `"${document.documentId}",`;
          });
          ((topic || {}).folder || []).forEach((document) => {
            if (document.documentType === "test")
              topicTests += `"${document.documentId}",`;
          });
          ((topic || {}).folder || []).forEach((document) => {
            if (document.documentType === "assignment")
              topicAssignments += `"${document.documentId}",`;
          });
  
          topics += `{ 
              topicName: "${(topic || {}).topicName || ""}",
              _id:"${(topic || {})._id}",
              lessons: [${topicLessons}],
              tests: [${topicTests}],
              assignments: [${topicAssignments}],
              }`;
        });
  
        subjects += `{ 
            subjectName: "${(subject || {}).subjectName || ""}", 
            topics: [${topics}],
            _id: "${(subject || {})._id}", 
            lessons: [${subjectLessons}],
            tests: [${subjectTests}],
            assignments: [${subjectAssignments}],
            }`;
      });
  
      modules += `{ 
          moduleName: "${(module || {}).moduleName || ""}", 
          _id: "${(module || {})._id}", 
          subjects: [${subjects}],
          lessons: [${moduleLessons}],
          tests: [${moduleTests}],
          assignments: [${moduleAssignments}],
          }`;
    });
return modules
}