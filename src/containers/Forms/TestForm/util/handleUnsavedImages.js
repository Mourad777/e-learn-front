import { getUrls } from "../../../../utility/getUrls";

export const handleUnsavedImages = (formValues, questions,initialUrls,token, deleteImg) => {
    const questionUrls = getUrls(questions, "courseQuestions") || [];
    const updatedUrls = getUrls(formValues, "testForm") || [];

    const imagesToDelete = [];
    updatedUrls.forEach((imgUrl) => {
      if (initialUrls.findIndex((u) => u === imgUrl) === -1) {
        imagesToDelete.push(imgUrl);
      }
    });

    const filteredImagesToDelete = imagesToDelete
      .filter((item) => {
        //check urls in question documents to make sure the files arn't used elsewhere
        if (!questionUrls.includes(item)) return item;
        return null;
      })
      .filter((i) => i);

    if (filteredImagesToDelete.length > 0)
      deleteImg(imagesToDelete, token);
  };