import React from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/index";
import Typography from "@material-ui/core/Typography";
import Aux from "../../../../hoc/Auxiliary/Auxiliary";
import moment from "moment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import ProgressReport from "../../ProgressReport/ProgressReport";
import { getKeyFromAWSUrl } from "../../../../utility/getKeyFromUrl";
import FileViewer from "react-file-viewer";
import PdfViewer from "../../../../components/UI/PdfViewer/PdfViewer";
import Accordion from "../../../../components/UI/Accordion/Accordion";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import MobileStepper from "@material-ui/core/MobileStepper";
import { useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { getStudentProgress } from "../../../InstructorPanel/utility/getStudentProgress";
import { useTranslation } from "react-i18next";
import MultiLineField from "../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import { OutlinedInput } from "@material-ui/core";
import { getCourse } from "../../../../utility/getCourse";

const UserSummary = ({
  token,
  course,
  selectedCourse,
  approveEnroll,
  denyEnroll,
  isDarkTheme,
  approveAccount,
  suspendAccount,
  configuration,
  isStudent,
  instructors,
  history,
  allStudents,
  match,
}) => {
  const studentId = match.params.studentId;
  const instructorId = match.params.instructorId;
  const { t } = useTranslation();
  const theme = useTheme();
  const [confirmCheckbox, setConfirmCheckbox] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [accountSuspensionReason, setAccountSuspensionReason] = React.useState('');
  const enrollRequest = (course.studentsEnrollRequests || []).find(rq => rq.student._id === studentId) || {}
  let user;
  if (studentId && !!selectedCourse) user = enrollRequest.student
  if (!selectedCourse) {
    if (isStudent) {
      user = (allStudents || []).find(st => st._id === studentId)
    } else {
      user = (instructors || []).find(inst => inst._id === instructorId)
    }
  }


  if (!user) return null

  const handleChange = (event) => {
    setConfirmCheckbox(event.target.checked);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  let numberOfStudentsEnrolled, studentIsDenied;
  if (isStudent && selectedCourse) {
    numberOfStudentsEnrolled = (course.studentsEnrollRequests || []).filter(
      (e) => e.approved
    ).length;

    studentIsDenied =
      (course.studentsEnrollRequests || []).findIndex(
        (r) => r.student._id === user._id && r.denied
      ) > -1;
  }

  const maxSteps = (user.documents || []).length;

  const boxStyle = {
    padding: 10,
    margin: "10px auto 10px auto",
  };

  const documentTypeOptions = [
    { value: "", primaryText: "" },
    { value: "governmentId", primaryText: t("confirmations.governmentId") },
    {
      value: "birthCertificate",
      primaryText: t("confirmations.birthCertificate"),
    },
    { value: "transcript", primaryText: t("confirmations.transcript") },
    {
      value: "legalStatusProof",
      primaryText: t("confirmations.proofLegalStatus"),
    },
    { value: "cv", primaryText: t("confirmations.cv") },
    {
      value: "testScoresProof",
      primaryText: t("confirmations.proofTestScores"),
    },
    {
      value: "referenceLetter",
      primaryText: t("confirmations.letterReference"),
    },
    {
      value: "statementPurpose",
      primaryText: t("confirmations.statementPurpose"),
    },
    { value: "other", primaryText: t("confirmations.other") },
  ];

  const userInfoRows = [
    [t("confirmations.firstName"), user.firstName],
    [t("confirmations.lastName"), user.lastName],
    isStudent ? [t("confirmations.studentId"), user._id.replace(/\D/g, "")] : null,
    [
      t("confirmations.dob"),
      moment(new Date(user.dob).getTime())
        .locale(localStorage.getItem("i18nextLng"))
        .format("MMMM DD YYYY"),
    ],
    [t("confirmations.email"), user.email],
    [
      t("confirmations.lastLogin"), user.lastLogin ?
        moment(new Date(parseInt(user.lastLogin)).getTime())
          .locale(localStorage.getItem("i18nextLng"))
          .format("dddd, MMMM DD YYYY, HH:mm") : "",
    ],
    isStudent && selectedCourse ? [
      t("confirmations.courseProgress"),
      `${getStudentProgress(course, user)}%`,
    ] : null,
  ];

  let isAccountApprovalRequired = false;
  if (configuration.isApproveStudentAccounts && isStudent) {
    isAccountApprovalRequired = true
  }
  if (configuration.isApproveInstructorAccounts && !isStudent) {
    isAccountApprovalRequired = true
  }
  let status;
  if (!!selectedCourse) {//student panel check
    if (enrollRequest.droppedOut) {
      status = t('userSummary.status.droppedOut')
    }
    if (studentId && !enrollRequest.droppedOut && !enrollRequest.denied && !enrollRequest.approved) {
      status = t('userSummary.status.pendingApproval')
    }
    if (enrollRequest.denied) {
      status = t('userSummary.status.accessDenied')
    }
  } else {
    if (user.isAccountSuspended) {
      status = t('userSummary.status.accountSuspended')
    }
    if (!user.isAccountApproved && !user.isAccountSuspended && isAccountApprovalRequired) {
      status = t('userSummary.status.pendingActivation')
    }
  }

  return (
    <Aux>
      {user.profilePicture && (
        <div
          style={{
            backgroundColor: isDarkTheme ? '#757575' : 'white',
            backgroundImage: `url("${user.profilePicture}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "200px",
            borderRadius: "50%",
            maxWidth: "200px",
            width: "100%",
            ...boxStyle,
          }}
        />
      )}
      <Typography variant="subtitle1" color="error" gutterBottom align="center">{status}</Typography>

      <div style={boxStyle}>
        <Table aria-label="simple table">
          <TableBody>
            {userInfoRows.map((r) => {
              if (!r) return
              return (
                <TableRow key={r[0]}>
                  <TableCell component="th" scope="row">
                    {r[0]}
                  </TableCell>
                  <TableCell align="right">{r[1]}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {(isStudent && selectedCourse) && (
        <Accordion
          index="progressReportStudentSummary"
          summary={t("userSummary.buttons.showReport")}
          expandedSummary={t("userSummary.buttons.hideReport")}
        >
          <Typography
            style={{ textAlign: "center" }}
            paragraph
            variant="h6"
            gutterBottom
          >
            {t("userSummary.progressReport")}
          </Typography>
          <ProgressReport student={user} />
        </Accordion>
      )}

      {maxSteps > 0 && (
        <div style={boxStyle}>
          <Typography
            style={{ textAlign: "center" }}
            paragraph
            variant="h6"
            gutterBottom
          >
            {t("confirmations.documents")}
          </Typography>
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="text"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                {t("confirmations.next")}
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                {t("confirmations.back")}
              </Button>
            }
          />
          {(user.documents || []).map((d, i) => {
            if (i !== activeStep) return null;
            let document;
            const documentKey = getKeyFromAWSUrl(d.document);
            const documentExtension = (documentKey || "").toLowerCase().split(".").pop();
            if (documentExtension === "pdf") {
              document = <PdfViewer url={d.document} index={i} />;
            }
            if (
              documentExtension === "jfif" ||
              documentExtension === "jpeg" ||
              documentExtension === "jpg"
            ) {
              document = (
                <div
                  style={{
                    backgroundImage: `url("${d.document}")`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    height: "300px",
                    borderRadius: "3px",
                    width: "100%",
                    margin: "auto",
                  }}
                ></div>
              );
            }
            if (documentExtension === "docx" || documentExtension === "doc") {
              document = (
                <FileViewer
                  fileType={documentExtension}
                  filePath={d.document}
                />
              );
            }
            const docType = documentTypeOptions.find(
              (t) => t.value === d.documentType
            ).primaryText;
            return (
              <Aux key={`document[${i}]`}>
                <Typography paragraph variant="h6" gutterBottom>
                  {docType}
                </Typography>
                {document}
              </Aux>
            );
          })}
        </div>
      )}
      {(user.isAccountApproved && !user.isAccountSuspended) && (
        <Aux>
          <Typography paragraph variant="body1" gutterBottom>
            {t("userSummary.reason")}
          </Typography>
          <MultiLineField
            label={t("userSummary.reason")}
            input={{ value: accountSuspensionReason, onChange: (e) => setAccountSuspensionReason(e.target.value) }}
            options={{
              multiline: true,
              rows: 3,
              variant: OutlinedInput,
            }}
          />
        </Aux>
      )}

      {!selectedCourse && (
        <Aux>
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmCheckbox}
                onChange={handleChange}
                value="checked"
              />
            }
            label={`${!user.isAccountApproved && isAccountApprovalRequired ? t("userSummary.approveAccount") : !user.isAccountSuspended ? t("userSummary.suspendAccount") : t("userSummary.activateAccount")}`}
          />
          <Button
            disabled={!confirmCheckbox}
            onClick={() => {
              if (!user.isAccountApproved && isAccountApprovalRequired) {
                approveAccount(user._id, token, history)
              } else {
                const action = user.isAccountSuspended ? "reactivate" : "suspend"
                const reason = accountSuspensionReason;
                suspendAccount(user._id, action, reason, token, history);
              }
            }}
            color={!user.isAccountApproved || user.isAccountSuspended ? "primary" : "secondary"}
          >
            {t("userSummary.buttons.submit")}
          </Button>
        </Aux>
      )}


      {/*If found student request where student is not dropped out then grant or deny access depending on whethere they were denied*/}
      {((course || {}).studentsEnrollRequests || []).findIndex(
        (r) => r.student._id === user._id && !r.droppedOut
      ) > -1 && (
          <Aux>
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmCheckbox}
                  onChange={handleChange}
                  value="checked"
                  disabled={
                    studentIsDenied &&
                    numberOfStudentsEnrolled === course.studentCapacity
                  }
                />
              }
              label={`${studentIsDenied ? t("confirmations.enrollConfirm.allow") : t("confirmations.enrollConfirm.deny")}`}
            />
            <Button
              color="primary"
              disabled={!confirmCheckbox}
              onClick={() => {
                if (studentIsDenied)
                  approveEnroll(user._id, course._id, token, history);
                if (!studentIsDenied) denyEnroll(user._id, course._id, token, history);
              }}
            >
              {t("userSummary.buttons.submit")}
            </Button>
            {studentIsDenied &&
              numberOfStudentsEnrolled === course.studentCapacity && (
                <Typography
                  paragraph
                  color="error"
                  variant="subtitle1"
                  gutterBottom
                >
                  {t("userSummary.increaseCapacity")}
                </Typography>
              )}
          </Aux>
        )}
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    approveEnroll: (student, course, token, history) =>
      dispatch(actions.enrollCourseStart(student, course, token, history)),
    denyEnroll: (student, course, token, history) =>
      dispatch(actions.enrollDenyStart(student, course, token, null, null, history)),
    approveAccount: (user, token, history) =>
      dispatch(actions.activateAccountStart(user, token, history)),
    suspendAccount: (user, action, reason, token, history) =>
      dispatch(actions.suspendAccountStart(user, action, reason, token, history)),
  };
};

const mapStateToProps = (state) => {
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse);
  return {
    configuration: state.common.configuration,
    course: populatedCourse,
    selectedCourse: state.common.selectedCourse,
    modalDocument: state.common.modalDocument,
    token: state.authentication.token,
    isDarkTheme: state.common.isDarkTheme,
    tab: state.common.tab,
    allStudents: state.instructorStudent.allStudents,
    instructors: state.instructorCourse.instructors,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSummary);
