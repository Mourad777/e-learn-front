import { deleteFiles } from "./deleteFiles";
import { getUrls } from "./getUrls";

export const handleDeleteUnsavedImages = (formValues, initialUrls, isUpdating, token, deleteImg, formType, questions, tests, questionType) => {
    if (formType === "gradeTestForm") {
        const updatedUrls = getUrls(formValues, "gradeTest");
        const imagesToDelete = [];
        (updatedUrls || []).forEach((imgUrl) => {
            if (initialUrls.findIndex((u) => u === imgUrl) === -1) {
                imagesToDelete.push(imgUrl);
            }
        });

        if (imagesToDelete.length > 0)
            deleteFiles(imagesToDelete, token);

        return
    }
    if (formType === "testForm") {

        const otherTests = (tests || []).filter(t => t._id !== formValues._id)
        const otherTestUrls = getUrls(otherTests, "courseTests") || [];
        const questionUrls = getUrls(questions, "courseQuestions") || [];
        const updatedUrls = getUrls(formValues, "testForm") || [];

        const allUrls = [...questionUrls, ...otherTestUrls];
        const imagesToDelete = [];
        updatedUrls.forEach((imgUrl) => {
            if (initialUrls.findIndex((u) => u === imgUrl) === -1) {
                imagesToDelete.push(imgUrl);
            }
        });

        const filteredImagesToDelete = imagesToDelete
            .filter((item) => {
                //check urls in question documents to make sure the files arn't used elsewhere
                if (!allUrls.includes(item)) return item;
                return null;
            })
            .filter((i) => i);

        if (filteredImagesToDelete.length > 0)
            deleteFiles(imagesToDelete, token)

        return
    }

    if (formType === "questionForm") {
        const testUrls = getUrls(tests, "courseTests") || [];
        const updatedUrls = getUrls(formValues, "questionForm", questionType);
        const imagesToDelete = [];
        updatedUrls.forEach((imgUrl) => {
            if (initialUrls.findIndex((u) => u === imgUrl) === -1) {
                imagesToDelete.push(imgUrl);
            }
        });
        const filteredImagesToDelete = imagesToDelete
            .filter((item) => {
                //check urls in question documents to make sure the files arn't used elsewhere
                if (!testUrls.includes(item)) return item;
                return null;
            })
            .filter((i) => i);

        if (filteredImagesToDelete.length > 0) {
            deleteFiles(imagesToDelete, token)
            // deleteImg(imagesToDelete, token);
        }
        return

    }

    const updatedUrls = getUrls(formValues, formType);
    const imagesToDelete = [];
    (updatedUrls || []).forEach((imgUrl) => {
        if (initialUrls.findIndex((u) => u === imgUrl) === -1) {
            imagesToDelete.push(imgUrl);
        }
    });
    if (imagesToDelete.length > 0)
        deleteFiles(imagesToDelete, token)
};