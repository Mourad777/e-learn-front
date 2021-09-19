export const getProgress = (course,results) => {
  const excusedTestIds = ((results||[]).filter(te=>te.isExcused && course._id === te.course)||[]).map(re=>re.test)
  const numberOfTestsExcused = (excusedTestIds||[]).length;
  const totalNumberOfSlides  = (course.lessons || []).reduce((prev,curr) => {
    return prev + curr.lessonSlides.length
  },0);
  const totalNumberOfSlidesCompleted  = (course.lessons || []).reduce((prev,curr) => {
    return (curr.lessonSlides).filter(s=>s.seen).length + prev
  },0);
  const numberOfTests = course.totalIncludedTests - numberOfTestsExcused;
  const numberOfTestsCompleted = course.tests.filter((t) => t.completed && !(excusedTestIds||[]).includes(t._id)).length;
  const stepsCompleted = numberOfTestsCompleted + totalNumberOfSlidesCompleted
  const totalSteps = totalNumberOfSlides + numberOfTests
  return isNaN(parseInt(stepsCompleted / totalSteps * 100)) ? 0 :parseInt(stepsCompleted / totalSteps * 100);
};
