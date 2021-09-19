import React, { useEffect } from "react";
import { connect } from "react-redux";
import { reduxForm, getFormValues, Field } from "redux-form";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../../store/actions/index";
import RadioGroup from "../../../../../components/UI/FormElements/RadioGroup/RadioGroup";
import MultiLineField from "../../../../../components/UI/FormElements/MultiLineField/MultiLineField";
import Switch from "../../../../../components/UI/Switch/Switch";
import { OutlinedInput } from "@material-ui/core";
import moment from "moment";
import Button from "@material-ui/core/Button";
import MobileStepper from "@material-ui/core/MobileStepper";
import {  useTheme } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import FileViewer from "react-file-viewer";
import PdfViewer from "../../../../../components/UI/PdfViewer/PdfViewer";
import { getKeyFromAWSUrl } from "../../../../../utility/getKeyFromUrl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { getStudentProgress } from "../../../../InstructorPanel/utility/getStudentProgress";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../../../../utility/getCourse";


const EnrollmentSummary = ({
  token,
  student = {},
  enroll,
  deny,
  course,
  markAsSeen,
  notifications,
  formValues = {},
  isDarkTheme,
  history,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    const notificationsToMark = [];
    (notifications || []).forEach((n) => {
      if (
        (n.documentType === "courseEnrollRequest" ||
          n.documentType === "courseDrop") &&
        n.fromUser === student._id
      ) {
        notificationsToMark.push(n);
      }
    });
    notificationsToMark.forEach((n) => {
      markAsSeen(n._id, token);
    });
  }, []);
  const theme = useTheme();
  const enrollRequest = (course.studentsEnrollRequests || []).find(rq => rq.student._id === student._id) || {}
  if (!student) return null


  const typeOptions = [
    {
      label: t("confirmations.enrollConfirm.allow"),
      value: "approve",
      placement: "end",
      color: "primary",
    },
    {
      label: t("confirmations.enrollConfirm.deny"),
      value: "deny",
      placement: "end",
      color: "primary",
    },
  ];
  const allowResubmissionOptions = {
    label: t("confirmations.enrollConfirm.allowResubmission"),
    checked: false,
  };

  const documentTypeOptions = [
    { value: "", primaryText: "" },
    { value: "governmentId", primaryText: t("confirmations.governmentId") },
    { value: "birthCertificate", primaryText: t("confirmations.birthCertificate") },
    { value: "transcript", primaryText: t("confirmations.transcript") },
    { value: "legalStatusProof", primaryText: t("confirmations.proofLegalStatus") },
    { value: "cv", primaryText: t("confirmations.cv") },
    { value: "testScoresProof", primaryText: t("confirmations.proofTestScores") },
    { value: "referenceLetter", primaryText: t("confirmations.letterReference") },
    { value: "statementPurpose", primaryText: t("confirmations.statementPurpose") },
    { value: "other", primaryText: t("confirmations.other") },
  ];


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const maxSteps = (student.documents || []).length;
  const boxStyle = {
    backgroundColor: isDarkTheme ? "" : "white",
    padding: 10,
    margin: "10px auto 10px auto",
  };

  const studentInfoRows = [
    [t("confirmations.firstName"), student.firstName],
    [t("confirmations.lastName"), student.lastName],
    [t("confirmations.studentId"), (student._id || "").replace(/\D/g, "")],
    [
      t("confirmations.dob"),
      moment(new Date(student.dob).getTime()).locale(localStorage.getItem("i18nextLng")).format("MMMM DD YYYY"),
    ],
    [t("confirmations.email"), student.email],
    [
      t("confirmations.lastLogin"),
      moment(new Date(parseInt(student.lastLogin)).getTime()).locale(localStorage.getItem("i18nextLng")).format(
        "dddd, MMMM DD YYYY, HH:mm"
      ),
    ],
    [t("confirmations.courseProgress"), `${getStudentProgress(course, student)}%`],
  ];
  

  return (
    <div>
      <div
        style={{
          backgroundImage: `url("${student.profilePicture}")`,
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
      <div style={boxStyle}>
        <Table aria-label="simple table">
          <TableBody>
            {studentInfoRows.map((r) => (
              <TableRow key={r[0]}>
                <TableCell component="th" scope="row">
                  {r[0]}
                </TableCell>
                <TableCell align="right">{r[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {maxSteps > 0 && (
        <div style={boxStyle}>
          <Typography paragraph variant="h6" gutterBottom>
            {t("confirmations.documents")}
          </Typography>

          {maxSteps > 0 && (
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
          )}

          {(student.documents || []).map((doc, index) => {
            if (index !== activeStep) return null;
            const ext = (getKeyFromAWSUrl(doc.document) || "").split(".").pop();
            const loadedFile = doc.document;
            const docType = documentTypeOptions.find(
              (t) => t.value === doc.documentType
            ).primaryText;
            return (
              <div key={doc.document + index}>
                <Typography paragraph variant="h6" gutterBottom>
                  {docType}
                </Typography>
                {(ext === "jpeg" || ext === "jpg" || ext === "jfif") && (
                  <div
                    style={{
                      backgroundImage: `url("${loadedFile}")`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      height: "300px",
                      borderRadius: "3px",
                      width: "100%",
                      margin: "auto",
                    }}
                  />
                )}
                {(ext === "docx" || ext === "doc") && (
                  <FileViewer fileType={ext} filePath={loadedFile} />
                )}
                {ext === "pdf" && <PdfViewer url={loadedFile} index={index} />}
              </div>
            );
          })}
        </div>
      )}
      {(!enrollRequest.denied && !enrollRequest.approved && !enrollRequest.droppedOut) && (
        <div style={boxStyle}>
          <Field
            component={RadioGroup}
            name="decision"
            title="Decision"
            required={true}
            label={"Test Type"}
            options={typeOptions}
            orientation="horizontal"
          />
          <Field
            name="reason"
            component={MultiLineField}
            label={t("confirmations.enrollConfirm.reason")}
            options={{
              multiline: true,
              rows: 3,
              variant: OutlinedInput,
              disabled: formValues.decision === "approve" || !formValues.decision,
            }}
            textLabel
          />
          {formValues.decision === "deny" && (
            <Field
              name="allowResubmission"
              options={allowResubmissionOptions}
              component={Switch}
            />
          )}
          <Button
            disabled={!formValues.decision}
            disabled={!formValues.decision}
            color={formValues.decision === "deny" ? "secondary" : "primary"}
            onClick={() => {
              const { decision, reason, allowResubmission } = formValues;
              if (decision === "approve") enroll(student._id, course._id, token, history);
              if (decision === "deny")
                deny(student._id, course._id, token, reason, allowResubmission, history);
            }}
          >
            {t("confirmations.enrollConfirm.submit")}
          </Button>
        </div>
      )}

    </div>
  );
};

const wrappedForm = reduxForm({
  form: "processEnrollmentRequestForm",
  enableReinitialize: true,
  destroyOnUnmount: true,
})(EnrollmentSummary);

const mapDispatchToProps = (dispatch) => {
  return {
    markAsSeen: (id, token) => {
      dispatch(actions.markAsSeenStart(id, token));
    },
    enroll: (student, course, token,history) => {
      dispatch(actions.enrollCourseStart(student, course, token,history));
    },
    deny: (student, course, token, reason, allowResubmission,history) => {
      dispatch(
        actions.enrollDenyStart(
          student,
          course,
          token,
          reason,
          allowResubmission,
          history,
        )
      );
    },
  };
};

const mapStateToProps = (state, myProps) => {
  const match = myProps.match
  const studentId = match.params.studentId
  const populatedCourse = getCourse(state.common.courses, state.common.selectedCourse);
  const student = ((populatedCourse.studentsEnrollRequests || []).find(rq => rq.student._id === studentId) || {}).student
  return {
    token: state.authentication.token,
    student,
    notifications: state.common.notifications,
    course: populatedCourse,
    isDarkTheme: state.common.isDarkTheme,
    initialValues: {
      allowResubmission: false,
    },
    formValues: getFormValues("processEnrollmentRequestForm")(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
