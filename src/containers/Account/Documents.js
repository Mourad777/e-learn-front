import React from "react";
import { connect } from "react-redux";
import {
  Field,
  FieldArray,
  reduxForm,
  change,
  getFormValues,
} from "redux-form";
import FileInput from "../../components/UI/FormElements/FileInput/FileInput";
import Button from "@material-ui/core/Button";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import DropdownSelect from "../../components/UI/FormElements/DropdownSelect/DropdownSelect";
import PdfViewer from "../../components/UI/PdfViewer/PdfViewer";
import MobileStepper from "@material-ui/core/MobileStepper";
import { useTheme } from "@material-ui/core/styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { useTranslation } from "react-i18next";
import { getCourse } from "../../utility/getCourse";

const RenderDocuments = ({
  fields,
  formValues = {},
  meta: { error, submitFailed },
  changeDocument,
}) => {
  const { t } = useTranslation()
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const documentTypeOptions = [
    { value: "", primaryText: "" },
    { value: "governmentId", primaryText: t("account.governmentId") },
    { value: "birthCertificate", primaryText: t("account.birthCertificate") },
    { value: "transcript", primaryText: t("account.transcript") },
    { value: "legalStatusProof", primaryText: t("account.proofLegalStatus") },
    { value: "cv", primaryText: t("account.cv") },
    { value: "testScoresProof", primaryText: t("account.proofTestScores") },
    { value: "referenceLetter", primaryText: t("account.letterReference") },
    { value: "statementPurpose", primaryText: t("account.statementPurpose") },
    { value: "other", primaryText: t("account.other") },
  ];
  const maxSteps = (fields || []).length;
  return (
    <Aux>
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
              {t("account.buttons.next")}
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
              {t("account.buttons.back")}
            </Button>
          }
        />
      )}

      <div>
        <div style={{ display: 'flex', flexDirection: 'column',width:200,margin:'auto' }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setActiveStep(maxSteps);
              fields.push();
            }}
            color="primary"

          >
            {t("account.buttons.addDocument")}
          </Button>
          <Button

            color="secondary"
            disabled={!(maxSteps > 0)}
            onClick={(e) => {
              e.preventDefault();
              if (activeStep !== 0) {
                handleBack();
              }
              fields.remove(activeStep);
            }}
            aria-label="delete"
          >
            {t("account.buttons.removeDocument")}
          </Button>
        </div>
        {(fields || []).map((item, index) => {
          if (index !== activeStep) return null;
          const ext =
            (formValues.documents[index] || {}).document instanceof File
              ? (
                ((formValues.documents[index] || {}).document || {}).name ||
                ""
              )
                .split(".")
                .pop()
              : ((formValues.documents[index] || {}).document || "")
                .split(".")
                .pop();
          const loadedFile = ((formValues.documents || [])[index] || {})
            .loadedDocument;
          return (
            <Aux key={item}>
              <Field
                name={`documents.${index}.documentType`}
                fullWidth
                simple
                textLabel={t("account.documentType")}
                component={DropdownSelect}
                label="document type"
                options={documentTypeOptions}
              />
              <div style={{ padding: "10px" }}>
                <Field
                  name={`documents.${index}.document`}
                  component={FileInput}
                  loadedFile={loadedFile}
                  mimeTypesAllowed={
                    "image/jpeg, application/pdf, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  }
                  extensionsAllowed={[
                    "jpeg",
                    "jpg",
                    "jfif",
                    "pdf",
                    "docx",
                    "doc",
                  ]}
                  onChangeFile={(image) => {
                    changeDocument(`documents.${index}.loadedDocument`, image);
                  }}
                  compressImage
                  index={index}
                  uploadButtonText={
                    ((formValues.documents || [])[index] || {}).document
                      ? t("account.buttons.updateDocument")
                      : t("account.buttons.uploadDocument")
                  }
                />
              </div>
              {ext === "pdf" && (
                <PdfViewer
                  url={(formValues.documents[index] || {}).loadedDocument}
                  index={index}
                />
              )}
            </Aux>
          );
        })}
      </div>
    </Aux>
  );
};

const Documents = ({ formValues = {}, changeDocument }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: "100%" }}>
        <FieldArray
          name="documents"
          formValues={formValues}
          changeDocument={changeDocument}
          component={RenderDocuments}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeDocument: (field, image) => {
      dispatch(change("accountForm", field, image));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    formValues: getFormValues("accountForm")(state),
    token: state.authentication.token,
    userId: state.authentication.userId,
    notification: state.common.notification,
    coursePanel: state.common.coursePanel,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
    studentLoggedIn: state.authentication.studentLoggedIn,
    adminLoggedIn: state.authentication.adminLoggedIn,

    tab: state.common.tab,
    user: state.authentication,
    initialValues: state.authentication.loadedUser,
  };
};

const wrappedForm = reduxForm({
  form: "accountForm",
  destroyOnUnmount: false,
})(Documents);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
