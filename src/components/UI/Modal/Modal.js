import React, { useState,useEffect } from "react";
import { connect } from "react-redux";
import { getFormValues, getFormSyncErrors, touch } from "redux-form";
import classes from "./Modal.module.css";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";
import Button from "../Button/Button";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../store/actions/index";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../utility/getCourse";
import { matchPath, useHistory } from "react-router";

const Modal = ({    
  isModal,
  large,
  header,
  children,
  modalType,
  isDarkTheme,
  configuration,
  accountFormErrors = {},
  token,
  modules,
  modulesFormValues,
  courses=[],
  course={},
  updateModules,
  closeModal,
  accountFormValues = {},
  touchField,
  openModal,
}) => {
  const history = useHistory()
  const {t} = useTranslation('common')
  const [isAccountFormValid,setIsAccountFormValid] = useState(true)
  const matchSyllabus = matchPath(history.location.pathname, {
    path: "/student-panel/courses/syllabus/:courseId",
    exact: true,
  });
  const matchStartTest = matchPath(history.location.pathname, {
    path: "/student-panel/course/:courseId/tests/confirm/:testId",
    exact: true,
  });
  useEffect(()=>{
    if(matchStartTest){
      const test = (course.tests||[]).find(t=>t._id === matchStartTest.params.testId)
      if(test)openModal(test,test.assignment ? "startAssignmentConfirmation" :'startTestConfirmation')
    }
  },[course,history.location.pathname]);

  useEffect(()=>{
    if(matchSyllabus){
      const course = (courses||[]).find(c=>c._id === matchSyllabus.params.courseId)
      if(course)openModal(course,'syllabus')
    }
  },[courses,history.location.pathname]);

  const handleCloseModal = () => {
    if(matchStartTest){
      history.push(`/student-panel/course/${matchStartTest.params.courseId}/tests`)
    }
    if(matchSyllabus){
      history.push(`/student-panel/courses`)
    }
    if (modalType === "contents" && modules) {
      updateModules(
        modulesFormValues,
        token,
        modules._id ? true : false,
        course._id
      );
    }
    if (
      modalType === "studentDocuments" &&
      !accountFormErrors.documentsAreValid
    ) {
      //block closing of modal if accountForm and documents have errors
      setIsAccountFormValid(false)
      accountFormValues.documents.forEach((d, i) => {
        touchField(`documents.${i}.document`);
        touchField(`documents.${i}.documentType`);
      });
      return;
    }
    closeModal();
  };
  if (modalType === "gradeTest") {
    return null
  }
    if (!isModal) return null;
    const isError =
      !isAccountFormValid && !accountFormErrors.documentsAreValid;
    return (
      <Aux>
        <Backdrop show={isModal} clicked={handleCloseModal} />
        <div
          className={[
            isDarkTheme ? classes.ModalBackgroundDark : classes.ModalBackgroundLight,
            classes.Modal,
            large ? classes.Large : classes.Regular,
          ].join(" ")}
          style={{
            transform: isModal ? "translateY(0)" : "translateY(-100vh)",
            opacity: isModal ? "1" : "0",
          }}
        >
          <div className={[isDarkTheme ? classes.HeaderDark : classes.Header]}>
            <Typography variant="h5" style={{ margin: '6px 0', textAlign: 'center' }} paragraph>
              {header}
            </Typography>
          </div>

          <div className={classes.Main}>{children}</div>

          {isError && modalType === "studentDocuments" && (
            <div style={{ margin: "auto", textAlign: "center" }}>
              <Typography color="error">
                {`${t("account.errors.correctTheFormAtDocument")} ${accountFormErrors.atIndex + 1}, ${t("account.errors.selectDocTypeAndDoNotExceed",{size:configuration.studentFileSizeLimit})}`}
              </Typography>
            </div>
          )}
          <Button
            isDarkTheme={isDarkTheme}
            modal
            isError={isError && modalType === "studentDocuments"}
            clicked={handleCloseModal}
          >
            {t("modal.close")}
          </Button>
        </div>
      </Aux>
    );
  
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(actions.closeModal());
      // dispatch(actions.clearLoadedInstructorData());
    },
    openModal: (type,doc) => {
      dispatch(actions.openModal(type,doc));
      // dispatch(actions.clearLoadedInstructorData());
    },
    touchField: (field) => dispatch(touch("accountForm", field)),
    cancelEditing: () => dispatch(actions.cancelEditing()),
    updateModules: (formValues, token, editing, courseId) =>
      dispatch(
        actions.modulesChangeStart(formValues, token, editing, courseId)
      ),
    clearLoadedData: () => dispatch(actions.clearLoadedInstructorData())
  };
};
const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses,state.common.selectedCourse);
  return {
    modulesFormValues: getFormValues("category")(state),
    accountFormValues: getFormValues("accountForm")(state),
    accountFormErrors: getFormSyncErrors("accountForm")(state),
    modules: state.common.modules,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
    studentLoggedIn: state.authentication.studentLoggedIn,
    token: state.authentication.token,
    isModal: state.common.isModal,
    modalType: state.common.modalType,
    isDarkTheme: state.common.isDarkTheme,
    course:populatedCourse,
    courses:state.common.courses,
    token: state.authentication.token,
    configuration:state.common.configuration,
    loading:
      state.instructorCourse.loading ||
      state.instructorTest.loading ||
      state.instructorQuestion.loading ||
      state.instructorLesson.loading ||
      state.common.loading ||
      state.studentCourse.loading ||
      state.studentTest.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
// http://localhost:3000/student-panel/course/602a7fc724bcc197278e5f3f/tests/confirm/604e891e489b43e4029beb43