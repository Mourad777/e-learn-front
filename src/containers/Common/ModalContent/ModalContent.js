import React from "react";
import { connect } from "react-redux";
import ResetTestConfirmation from "./Confirmations/ResetTestConfirmation";
import Modal from "../../../components/UI/Modal/Modal";
import TestSummary from "../../InstructorPanel/Tests/TestDetails/TestDetails";
import EnrollmentRequest from "./Confirmations/EnrollmentRequest/EnrollmentRequest";
import EnrollmentCourseConfirmation from "./Confirmations/EnrollmentCourseConfirmation/EnrollmentCourseConfirmation";
import TakeTestConfirmation from "./Confirmations/TakeTestConfirmation/TakeTestConfirmation";
// import Lesson from "../../InstructorPanel/Lessons/Lesson/Lesson";
import Aux from "../../../hoc/Auxiliary/Auxiliary";

import CourseSyllabus from "./CourseSyllabus/CourseSyllabus";
// import GradeTestForm from "../../Forms/GradeTestForm/GradeTestForm";
import { useTranslation } from "react-i18next";
import CourseResource from "./CourseResource/CourseResource"

import DeletingCourseConfirmation from "./Confirmations/DeletingCourseConfirmation";
import DeletingLessonConfirmation from "./Confirmations/DeletingLessonConfirmation";
import DeletingTestConfirmation from "./Confirmations/DeletingTestConfirmation";
import DropCourseConfirmation from "./Confirmations/DropCourseConfirmation/DropCourseConfirmation";
import Contents from "../../InstructorPanel/Category/Contents/Contents";
import StudentDocuments from "../../Account/Documents";

const ModalContent = ({
  modalType,
  modalDocument,
}) => {
  const { t } = useTranslation();
  let modalHeader;
  let isLarge;
  let modalContent;

  if (modalType === "deleteCourse") {
    modalHeader = t("modalHeaders.deleteCourse");
    modalContent = <DeletingCourseConfirmation />;
  }
  if (modalType === "deleteTest") {
    if (
      modalDocument.assignment
        ? (modalHeader = t("modalHeaders.deleteAssignment"))
        : (modalHeader = t("modalHeaders.deleteTest"))
    )
      modalContent = <DeletingTestConfirmation />;
  }
  if (modalType === "resetTest") {
    if (
      modalDocument.assignment
        ? (modalHeader = t("modalHeaders.resetAssignment"))
        : (modalHeader = t("modalHeaders.resetTest"))
    )
      modalContent = <ResetTestConfirmation />;
  }
  if (modalType === "deleteLesson") {
    modalContent = <DeletingLessonConfirmation />;
    modalHeader = t("modalHeaders.deleteLesson");
  }
  if (modalType === "enrollRequest") {
    modalContent = <EnrollmentRequest />;
    modalHeader = t("modalHeaders.enrollmentRequest");
  }
  if (modalType === "dropConfirmation") {
    modalContent = <DropCourseConfirmation />;
    modalHeader = t("modalHeaders.dropCourse");
  }
  if (modalType === "syllabus") {
    modalContent = <CourseSyllabus />;
    modalHeader = t("modalHeaders.syllabus");
  }
  if (modalType === "testSummary") {
    modalDocument.assignment
      ? (modalHeader = t("modalHeaders.assignmentSummary"))
      : (modalHeader = t("modalHeaders.testSummary"));

    modalContent = <TestSummary />;
  }
  if (modalType === "startTestConfirmation") {
    modalHeader = t("modalHeaders.startTest");
    modalContent = <TakeTestConfirmation />;
  }
  if (modalType === "startAssignmentConfirmation") {
    modalHeader = t("modalHeaders.startAssignment");
    modalContent = <TakeTestConfirmation />;
  }
  if (modalType === "contents") {
    modalHeader = t("modalHeaders.moduleContents");
    if (modalDocument.field.includes("subjects"))
      modalHeader = t("modalHeaders.subjectContents");
    if (modalDocument.field.includes("topics"))
      modalHeader = t("modalHeaders.topicContents");
    modalContent = <Contents />;
  }
  if (modalType === "processEnrollmentRequest") {
    modalHeader = t("modalHeaders.enrollmentConfirmation");
    modalContent = <EnrollmentCourseConfirmation />;
  }
  if (modalType === "studentDocuments") {
    modalHeader = t("modalHeaders.documents");
    modalContent = <StudentDocuments />;
  }
  if (modalType === "courseResource") {
    modalHeader = t("modalHeaders.courseResource");
    modalContent = <CourseResource />;
  }
  return (
    <Aux>
      <Modal header={modalHeader} large={isLarge}>
        {modalContent}
      </Modal>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  const testReviewing = (state.common.modalDocument || {}).test;
  return {
    isModal: state.common.isModal,
    modalType: state.common.modalType,
    modalDocument: state.common.modalDocument,
    loadedQuestionFormData: state.instructorQuestion.loadedQuestionFormData,
    initialGradeValues: state.instructorTest.initialGradeValues,
    initialTestReviewValues: testReviewing,
  };
};

export default connect(mapStateToProps)(ModalContent);
