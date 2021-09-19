import React, { useEffect } from "react";
import { FieldArray, reduxForm, getFormValues } from "redux-form";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Aux from "../../../hoc/Auxiliary/Auxiliary";
import * as actions from "../../../store/actions/index";
import { useTranslation } from "react-i18next";
import Folder from "./Folder"
import { getCourse } from "../../../utility/getCourse";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: "hidden",
    maxWidth: 600,
    margin: "30px auto",
    paddingLeft: theme.spacing(1),
    paddingTop: 30,
  },
  nested: {
    paddingLeft: theme.spacing(1.5),
  },
  nestedTwice: {
    paddingLeft: theme.spacing(2),
  },
  nestedFile: {
    paddingLeft: theme.spacing(5),
  },
}));

function Categories({
  initialValues,
  token,
  formValues,
  course,
  courses,
  updateCategory,
  loading,
  openModal,
  closeModal,
  width,
  isDarkTheme,
  fetchModules,
  history,
}) {
  const { t } = useTranslation();
  useEffect(() => {
    fetchModules(course, token)
  }, [])
  const classes = useStyles();
  const onSubmit = (e, values, action) => {
    const isCategory = (initialValues || {})._id ? true : false;
    updateCategory(
      action === "deleting" ? { modules: values } : formValues,
      token,
      isCategory,
      course
    );
    closeModal();
  };
  const populatedCourse = getCourse(courses, course);
  const modls = (formValues || {}).modules;
  const lessons = (populatedCourse || {}).lessons;
  const tests = ((populatedCourse || {}).tests || []).filter((item) => !item.assignment);
  const assignments = ((populatedCourse || {}).tests || []).filter(
    (item) => item.assignment
  );

  const handleOpenFolder = (folderId) => {
    const folderPath = folderId;
    const pathLevel1Index = (modls || []).findIndex(
      (module, moduleIndex) => moduleIndex === (folderPath || [])[0]
    );
    const pathLevel2Index = (
      (
        (modls || []).find(
          (module, moduleIndex) => moduleIndex === (folderPath || [])[0]
        ) || {}
      ).subjects || []
    ).findIndex(
      (subject, subjectIndex) => subjectIndex === (folderPath || [])[1]
    );
    const pathLevel3Index = (
      (
        (
          (
            (modls || []).find(
              (module, moduleIndex) => moduleIndex === (folderPath || [])[0]
            ) || {}
          ).subjects || []
        ).find(
          (subject, subjectIndex) => subjectIndex === (folderPath || [])[1]
        ) || {}
      ).topics || []
    ).findIndex((topic, topicIndex) => topicIndex === (folderPath || [])[2]);

    let path;
    if (pathLevel1Index > -1) path = `modules.${pathLevel1Index}.folder`;
    if (pathLevel2Index > -1)
      path = `modules.${pathLevel1Index}.subjects.${pathLevel2Index}.folder`;
    if (pathLevel3Index > -1)
      path = `modules.${pathLevel1Index}.subjects.${pathLevel2Index}.topics.${pathLevel3Index}.folder`;

    openModal(
      {
        folderId,
        tests,
        assignments,
        lessons,
        field: path,
      },
      "contents"
    );
  };
  const mainBlue = "#2196f3"
  let secondaryBlue = "#0058AE"
  if (isDarkTheme) secondaryBlue = mainBlue
  return (
    <Aux>
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.modules")}</Typography>
      <Spinner active={loading} transparent />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        <FieldArray
          name="modules"
          component={Folder}
          width={width}
          modules={modls || []}
          secondaryBlue={secondaryBlue}
          t={t}
          folderType="module"
          updateCategories={(e, values, action) => {
            onSubmit(e, values, action);
          }}
          handleOpenFolder={(id) => {
            handleOpenFolder(id);
          }}
          modulesFormValues={formValues}
          onSelectDocument={(documentType, documentId) => {
            if (documentType === "lesson") {
              const lesson = populatedCourse.lessons.find(
                (lesson) => lesson._id === documentId
              );
              history.push(`/instructor-panel/course/${lesson.course}/lesson/${lesson._id}/preview`)
              // openModal(lesson, "lesson");
            }
            if (documentType === "test" || documentType === "assignment") {
              const populatedTest = populatedCourse.tests.find(
                (test) => test._id === documentId
              );
              openModal(populatedTest, "testSummary");
            }
          }}
        />
      </List>
    </Aux>
  );
}

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("category")(state),
    openFolderPath: state.instructorModules.openFolderPath,
    token: state.authentication.token,
    initialValues: state.common.modules,
    course: state.common.selectedCourse,
    courses: state.common.courses,
    loading: state.instructorModules.loading,
    width: state.common.width,
    isDarkTheme: state.common.isDarkTheme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCategory: (formValues, token, editing, courseId) => {
      dispatch(
        actions.modulesChangeStart(formValues, token, editing, courseId)
      );
    },
    clearModalStates: () => dispatch(actions.clearInstructorModalStates()),
    openModal: (document, type) => dispatch(actions.openModal(document, type)),
    closeModal: () => dispatch(actions.closeModal()),
    fetchModules: (courseId, token) =>
      dispatch(actions.fetchModulesStart(courseId, token)),
  };
};

const wrappedForm = reduxForm({
  form: "category",
  enableReinitialize: true,
  destroyOnUnmount: false,
})(Categories);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
