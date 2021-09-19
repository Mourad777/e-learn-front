export const getStudentProgress = (course,student, results) => {
    const studentResults = results || student.testResults;
    if(!studentResults || !course.tests)return
    const totalNumberOfSlides = (course.lessons || []).reduce((prev, curr) => {
      return prev + curr.lessonSlides.length;
    }, 0); //

    const totalNumberOfSlidesCompleted = (course.lessons || []).reduce(
      (prev, curr) => {
        return (
          curr.lessonSlides.filter((s) => s.studentsSeen.includes(student._id))
            .length + prev
        );
      },
      0
    ); //
    const numberOfTestsExcused = (studentResults||[]).filter(re=>re.isExcused && re.course === course._id).length;
    const numberOfTests = course.tests.length; //
    const numberOfUnexcusedTests = numberOfTests - numberOfTestsExcused
    const numberOfTestsCompleted = course.tests.filter(
      (t) => (studentResults||[]).findIndex((r) => (t._id === r.test)&&r.closed&&!r.isExcused) > -1
    ).length; //
    const stepsCompleted =
      numberOfTestsCompleted + totalNumberOfSlidesCompleted;
    const totalSteps = totalNumberOfSlides + numberOfUnexcusedTests;
    return isNaN(parseInt((stepsCompleted / totalSteps) * 100)) ? 0 : parseInt((stepsCompleted / totalSteps) * 100);
  };