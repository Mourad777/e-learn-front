import React from "react";
import { Field, reduxForm, getFormValues } from "redux-form";
import { validate } from "./validate";
import Editor from "../../Editor/Editor";
import SubheaderList from "../../../components/UI/FormElements/SubheaderList/SubheaderList";
import { connect } from "react-redux";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

const CourseFormStepFour = ({
  courseId,
  userId,
  instructors,
  newCourseId,
}) => {
  const { t } = useTranslation('common');
  const areOtherCourses =
    instructors.findIndex(
      (i) =>
        (!i.coursesTeaching.includes(courseId) && i.coursesTeaching.length > 0)
    ) > -1;
  return (
    <Aux>
      {areOtherCourses && (
        <Aux>
          <Typography paragraph variant="h5" gutterBottom>
            {t("courseForm.coursePrerequisites")}
          </Typography>
          <Field
            name="prerequisites"
            component={SubheaderList}
            instructors={instructors}
            courseEditing={courseId}
            currentInstructorId={userId}
            courseForm
          />
        </Aux>
      )}
      <Typography paragraph variant="h5" gutterBottom>
        {t("courseForm.courseSyllabus")}
      </Typography>
      <div style={{width:'100%',margin:'auto'}}>
        <Field
          name="syllabus"
          reduxForm="courseForm"
          field="syllabus"
          component={Editor}
          path={`courses/${courseId || newCourseId}/syllabus`}
        />
      </div>
    </Aux>
  );

}

const mapStateToProps = (state) => {
  return {
    courseId: state.instructorCourse.loadedCourseFormData._id,
    instructors: state.instructorCourse.instructors,
    formValues: getFormValues("courseForm")(state),
    userId: state.authentication.userId,
  };
};

const wrappedForm = reduxForm({
  form: "courseForm",
  validate: validate,
  destroyOnUnmount: false,
})(CourseFormStepFour);

export default connect(mapStateToProps)(wrappedForm);
