import i18n from "../../../../i18n/index";
import { getCourse } from "../../../../utility/getCourse";

export const getInitialValues = (state,myProps) => {
const defaultFillBlankText =
    i18n.t("testForm.fillblanksSectionDefaultText");
  const course = state.common.selectedCourse;
  const courses = state.common.courses;
  const populatedCourse = getCourse(courses, course)
  const loadedTestFormData = state.instructorTest.loadedTestFormData
  const tests = (populatedCourse.tests || []).filter((item) => !item.assignment);
  const assignments = (populatedCourse.tests || []).filter((item) => item.assignment);
  const instructorFileSizeLimit = state.common.configuration.instructorFileSizeLimit;
  const initialValues = {
    instructorFileSizeLimit,
    tests: tests,
    assignments: assignments,
    course: populatedCourse,
    published: true,
    isGradeIncluded: true,
    passingRequired: false,
    assignment: myProps.isTest ? false : true,
    materialsDisplay: "test",
    equalSectionWeight: true,
    mcQuestions:
      ((loadedTestFormData || {}).mcQuestions || []).length > 0
        ? (loadedTestFormData || {}).mcQuestions
        : [
          {
            marks: 1,
            answers: [`${i18n.t('testForm.fields.option')} 1`, `${i18n.t('testForm.fields.option')} 2`],
            correctAnswers: ["1"],
          },
        ],
    essayQuestions:
      ((loadedTestFormData || {}).essayQuestions || []).length > 0
        ? (loadedTestFormData || {}).essayQuestions
        : [
          {
            marks: 1,
          },
        ],
    speakingQuestions:
      ((loadedTestFormData || {}).speakingQuestions || []).length > 0
        ? (loadedTestFormData || {}).speakingQuestions
        : [
          {
            marks: 1,
          },
        ],
    fillBlankQuestions: ((loadedTestFormData || {}).fillBlankQuestions || {})
      .question
      ? (loadedTestFormData || {}).fillBlankQuestions
      : {
        question: defaultFillBlankText,
        answers: [
          { marks: 1, selectableAnswer: false, answer: "piece of text" },
        ],
        correctAnswers: ["piece of text"],
      },
  };
  const loadedTestSections = (loadedTestFormData || {}).testSections || [];
  const loadedMaterialsDisplay = [];
  loadedTestSections.forEach((section) => {
    if (section === "mc") loadedMaterialsDisplay.push("multipleChoice");
    if (section === "essay") loadedMaterialsDisplay.push("essay");
    if (section === "speaking") loadedMaterialsDisplay.push("speaking");
    if (section === "fillblanks")
      loadedMaterialsDisplay.push("fillInTheBlanks");
  });

  const isFillBlankSection = loadedMaterialsDisplay.includes("fillInTheBlanks");
  const editing = myProps.editing;
  let loadedTest = initialValues
  if (editing) {
    loadedTest = {
      ...loadedTestFormData,
      instructorFileSizeLimit,
      tests,
      fillBlankQuestions: isFillBlankSection ? loadedTestFormData.fillBlankQuestions : {
        question: defaultFillBlankText,
        answers: [
          { marks: 1, selectableAnswer: false, answer: "piece of text" },
        ],
        correctAnswers: ["piece of text"],
      },
      assignments,
      course:populatedCourse,
      materialsDisplay: loadedMaterialsDisplay[0] || "test",
    }
  } else {
    loadedTest = initialValues
  }
  return loadedTest
}