export const getFetchApiMessage = (state, messageType) => {
    const message =
        state.authentication[messageType] ||
        state.studentCourse[messageType] ||
        state.studentTest[messageType] ||
        state.instructorCourse[messageType] ||
        state.instructorTest[messageType] ||
        state.instructorQuestion[messageType] ||
        state.instructorModules[messageType] ||
        state.instructorLesson[messageType] ||
        state.common[messageType];
    return message;
}