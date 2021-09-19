import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  touch,
  getFormValues,
  getFormSyncErrors,
} from "redux-form";
import * as actions from "../../store/actions/index";
import TextField from "../../components/UI/FormElements/TextField/TextField";
import NumberField from "../../components/UI/FormElements/NumberPicker/NumberPicker";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import validate from "./validate";
import Spinner from "../../components/UI/Spinner/Spinner";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import { useTranslation } from "react-i18next";
import Switch from "../../components/UI/Switch/Switch";
import socketIOClient from "socket.io-client";
import SubmitButton from "../../components/UI/Button/SubmitButton"

const numberFields = ['dropCourseGrade', 'coursePassGrade', 'instructorCoursesLimit', 'studentFileSizeLimit', 'instructorFileSizeLimit', 'voiceRecordTimeLimit']

const Config = ({
  instructorLoggedIn,
  studentLoggedIn,
  formValues = {},
  formErrors,
  touchField,
  updateConfiguration,
  loading,
  width,
  loadedUser,
  fetchConfig,
  selectedCourse,
  token,
}) => {
  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(true);
  const isAccountActivated = (loadedUser || {}).isAccountActivated;

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_SERVER_URL, {
      query: { token: token },
    });
    socket.on("updateConfig", (data) => {
      if (data.userType === "all") {
        fetchConfig(token);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedCourse, token]);

  const checkValidity = () => {
    numberFields.forEach(field => {
      touchField(field)
    });
  }

  const handleConfigurationUpdate = (formValues) => {
    // const isValid = validate(formValues)
    checkValidity()
    if (!formErrors.isValid) {
      setIsValid(false)
      return
    }
    updateConfiguration(formValues, token);
  };

  function createData(info, fieldName, type, user) {
    return { info, fieldName, type, user };
  }
  //dropCourse
  //enroll
  const studentConfigRows = [
    createData(t("config.privacy"), "", "header"),
    createData(t("config.hideActiveStatus"), "isHideActiveStatus", "switch"),
    createData(t("config.stayLoggedIn"), "isStayLoggedIn", "switch"),

    createData(t("config.notificationsHeader"), "", "header"),

    createData(t("config.course"), "isCourseNotifications", "switch"),
    createData(t("config.lessons"), "isLessonNotifications", "switch"),
    createData(t("config.assignments"), "isAssignmentNotifications", "switch"),
    createData(t("config.tests"), "isTestNotifications", "switch"),
    createData(t("config.chat"), "isChatNotifications", "switch"),

    createData(t("config.emailsHeader"), "", "header"),

    createData(t("config.course"), "isCourseEmails", "switch"),
    createData(t("config.lessons"), "isLessonEmails", "switch"),
    createData(t("config.assignments"), "isAssignmentEmails", "switch"),
    createData(t("config.tests"), "isTestEmails", "switch"),

    createData(t("config.pushNotificationsHeader"), "", "header"),

    createData(t("config.course"), "isCoursePushNotifications", "switch"),
    createData(t("config.lessons"), "isLessonPushNotifications", "switch"),
    createData(t("config.assignments"), "isAssignmentPushNotifications", "switch"),
    createData(t("config.tests"), "isTestPushNotifications", "switch"),
    createData(t("config.chat"), "isChatPushNotifications", "switch"),
  ];

  const instructorConfigRows = [
    createData(t("config.privacy"), "", "header"),

    createData(t("config.hideActiveStatus"), "isHideActiveStatus", "switch"),
    createData(t("config.stayLoggedIn"), "isStayLoggedIn", "switch"),

    createData(
      t("config.chatAllowedOutsideOfficehours"),
      "isChatAllowedOutsideOfficehours",
      "switch"
    ),

    createData(t("config.sendNotificationsHeader"), "", "header"),
    createData(t("config.tests"), "isSendTestNotifications", "switch"),
    createData(t("config.lessons"), "isSendLessonNotifications", "switch"),
    createData(
      t("config.assignments"),
      "isSendAssignmentNotifications",
      "switch"
    ),
    createData(t("config.course"), "isSendCourseNotifications", "switch"),

    createData(t("config.sendEmailsHeader"), "", "header"),

    createData(t("config.tests"), "isSendTestEmails", "switch"),
    createData(t("config.lessons"), "isSendLessonEmails", "switch"),
    createData(t("config.assignments"), "isSendAssignmentEmails", "switch"),
    createData(t("config.course"), "isSendCourseEmails", "switch"),

    createData(t("config.sendPushNotificationsHeader"), "", "header"),
    createData(t("config.tests"), "isSendTestPushNotifications", "switch"),
    createData(t("config.lessons"), "isSendLessonPushNotifications", "switch"),
    createData(
      t("config.assignments"),
      "isSendAssignmentPushNotifications",
      "switch"
    ),
    createData(t("config.course"), "isSendCoursePushNotifications", "switch"),

    createData(t("config.notificationsHeader"), "", "header"),
    createData(t("config.enrollRequest"), "isEnrollNotifications", "switch"),
    createData(t("config.dropCourse"), "isDropCourseNotifications", "switch"),
    createData(t("config.assignments"), "isAssignmentNotifications", "switch"),
    createData(t("config.tests"), "isTestNotifications", "switch"),
    createData(t("config.chat"), "isChatNotifications", "switch"),

    //***ADMIN NOTIFICATION OPTION ***/
    createData(
      t("config.newInstructorAccount"),
      "isNewInstructorAccountNotifications",
      "switch",
      "admin"
    ),
    createData(
      t("config.newStudentAccount"),
      "isNewStudentAccountNotifications",
      "switch",
      "admin"
    ),
    //********************************/
    createData(t("config.emailsHeader"), "", "header"),
    createData(t("config.assignments"), "isAssignmentEmails", "switch"),
    createData(t("config.tests"), "isTestEmails", "switch"),
    createData(t("config.enrollRequest"), "isEnrollEmails", "switch"),
    createData(t("config.dropCourse"), "isDropCourseEmails", "switch"),
    //***ADMIN E-MAIL OPTION ***/
    createData(
      t("config.newInstructorAccount"),
      "isNewInstructorAccountEmails",
      "switch",
      "admin"
    ),
    createData(
      t("config.newStudentAccount"),
      "isNewStudentAccountEmails",
      "switch",
      "admin"
    ),
    //********************************/

    createData(t("config.pushNotificationsHeader"), "", "header"),

    createData(t("config.enrollRequest"), "isEnrollPushNotifications", "switch"),
    createData(t("config.dropCourse"), "isDropCoursePushNotifications", "switch"),
    createData(t("config.assignments"), "isAssignmentPushNotifications", "switch"),
    createData(t("config.tests"), "isTestPushNotifications", "switch"),
    createData(t("config.chat"), "isChatPushNotifications", "switch"),

    //*** Admin push notifications option */
    createData(
      t("config.newInstructorAccount"),
      "isNewInstructorAccountPushNotifications",
      "switch",
      "admin"
    ),
    createData(
      t("config.newStudentAccount"),
      "isNewStudentAccountPushNotifications",
      "switch",
      "admin"
    ),

  ];

  const adminConfigRows = [
    createData(t("config.platformConfiguration"), "", "header"),
    createData(t("config.dropCoursePenalty"), "isDropCoursePenalty", "switch"),
    formValues.isDropCoursePenalty ?
      createData(
        t("config.dropCourseGrade") + " (%)",
        "dropCourseGrade",
        "numberField"
      ) : null,
    createData(
      t("config.coursePassGrade") + " (%)",
      "coursePassGrade",
      "numberField"
    ),
    createData(
      t("config.enrollAllowedAfterDropCourse"),
      "isEnrollAllowedAfterDropCourse",
      "switch"
    ),
    createData(
      t("config.instructorCoursesLimited"),
      "isInstructorCoursesLimit",
      "switch"
    ),
    formValues.isInstructorCoursesLimit
      ? createData(
        t("config.instructorCoursesLimit"),
        "instructorCoursesLimit",
        "numberField"
      )
      : null,

    createData(
      t("config.approveInstructorAccounts"),
      "isApproveInstructorAccounts",
      "switch"
    ),
    createData(
      t("config.approveStudentAccounts"),
      "isApproveStudentAccounts",
      "switch"
    ),
    createData(
      t("config.approveEnrollments"),
      "isApproveEnrollments",
      "switch"
    ),
    // createData(
    //   t("config.contentBlockedCourseEnd"),
    //   "isContentBlockedCourseEnd",
    //   "switch"
    // ),

    createData(
      t("config.studentFileSizeLimit") + " (MB)",
      "studentFileSizeLimit",
      "numberField"
    ),
    createData(
      t("config.instructorFileSizeLimit") + " (MB)",
      "instructorFileSizeLimit",
      "numberField"
    ),
    createData(
      t("config.passwordRequiredStartTest"),
      "isPasswordRequiredStartTest",
      "switch"
    ),
    createData(
      t("config.voiceRecordTimeLimit"),
      "voiceRecordTimeLimit",
      "numberField"
    ),
    // createData(
    //   t("config.allowStudentAccountDeletion"),
    //   "isAllowDeleteStudentAccount",
    //   "switch"
    // ),
    // createData(
    //   t("config.allowInstructorAccountDeletion"),
    //   "isAllowDeleteInstructorAccount",
    //   "switch"
    // ),
  ]
    .filter((i) => i)
    .map((item) => {
      return { ...item, user: "admin" };
    });

  let rows = [];
  if (studentLoggedIn) {
    rows = studentConfigRows;
  }

  if (instructorLoggedIn) {
    rows = [...instructorConfigRows, ...adminConfigRows];
  }

  const isError = !(
    (isValid || formErrors.isValid)
  );
  if(!loadedUser) return null;
  if (!isAccountActivated && !loading && loadedUser) return <Typography color="secondary" align="center" >{t('layout.accountNotYetActivated')}</Typography>
  return (
    <Aux>
      <Spinner transparent active={loading} />
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.config")}</Typography>
      <div
        style={{
          maxWidth: "500px",
          margin: width > 500 ? "20px auto 0 auto" : "40px auto 0 auto",
        }}
      >
        <Table aria-label="simple table">
          <TableBody>
            {rows.map((row, index) => {
              let component;
              if (row.type === "switch") component = Switch;
              if (row.type === "textField") component = TextField;
              if (row.type === "numberField") component = NumberField;

              return (
                <TableRow
                  style={{ marginTop: row.type === "header" ? 20 : 0 }}
                  key={row.info + index}
                >
                  <TableCell
                    style={{
                      fontSize: row.type === "header" ? "1.5em" : "1em",
                    }}
                    component="th"
                    scope="row"
                  >
                    {row.info}
                  </TableCell>
                  <TableCell align="right">
                    {row.type !== "header" && (
                      <Field
                        width={80}
                        disabled={!(loadedUser || {}).admin && row.user === "admin"}
                        errorBottomPosition
                        configInput
                        options={{
                          label: "",
                          disabled: !(loadedUser || {}).admin && row.user === "admin",
                        }}
                        name={row.fieldName}
                        component={component}
                        simple
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <SubmitButton
          clicked={() => handleConfigurationUpdate(formValues)}
          isError={isError}
        >
          {t("account.buttons.saveChanges")}
        </SubmitButton>
      </div>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: (token) => dispatch(actions.fetchUserStart(token)),
    updateConfiguration: (formValues, token) =>
      dispatch(actions.updateConfigStart(formValues, token)),
    fetchConfig: (token) =>
      dispatch(actions.fetchConfigStart(token)),
    touchField: (field) => {
      dispatch(touch("configurationForm", field));
    },
    fetchConfig: (token) => dispatch(actions.fetchConfigStart(token)),
  };
};

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("configurationForm")(state),
    formErrors: getFormSyncErrors("configurationForm")(state),
    token: state.authentication.token,
    userId: state.authentication.userId,
    notification: state.common.notification,
    course: state.common.selectedCourse,
    courses: state.common.courses,
    coursePanel: state.common.coursePanel,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
    studentLoggedIn: state.authentication.studentLoggedIn,
    user: state.authentication,
    initialValues: state.common.configuration,
    loading: state.authentication.loading,
    loadedUser: state.authentication.loadedUser,
    width: state.common.width,
    selectedCourse: state.common.selectedCourse,
  };
};

const wrappedForm = reduxForm({
  form: "configurationForm",
  enableReinitialize: true,
  validate: validate,
  destroyOnUnmount: true,
})(Config);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);




//new parameters added:

// isCoursePushNotifications
// isLessonPushNotifications
// isAssignmentPushNotifications
// isTestPushNotifications
// isChatPushNotifications

// isEnrollPushNotifications
// isDropCoursePushNotifications

// isNewInstructorAccountPushNotifications
// isNewStudentAccountPushNotifications

// isSendTestEmails
// isSendLessonEmails
// isSendAssignmentEmails
// isSendCourseEmails

// isSendTestPushNotifications
// isSendLessonPushNotifications
// isSendAssignmentPushNotifications
// isSendCoursePushNotifications