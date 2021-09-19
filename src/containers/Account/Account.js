import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  change,
  touch,
  getFormValues,
  getFormSyncErrors,
} from "redux-form";
import * as actions from "../../store/actions/index";
import TextField from "../../components/UI/FormElements/TextField/TextField";
import DatePicker from "../../components/UI/FormElements/DateTimePicker/DateTimePicker";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import FileInput from "../../components/UI/FormElements/FileInput/FileInput";
import Typography from "@material-ui/core/Typography";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import validate from "./validate";
import Spinner from "../../components/UI/Spinner/Spinner";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import { styled } from '@material-ui/core/styles';
import SubmitButton from "../../components/UI/Button/SubmitButton"

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  smallFontSize: {
    fontSize: "0.7em",
  },
  GreenButton: {
    '&:hover': {
      backgroundColor: '#388e3c',
      color: '#FFF'
    }
  }
}));

const DarkThemeGreenButton = styled(Button)({
  background: '#4caf50',
  border: 0,
  borderRadius: 3,
  color: 'white',
  height: 48,
  padding: '0 30px',
});

const getUrls = (values) => {
  if (!values) return;
  const urls = [];
  urls.push(values.profilePicture);
  (values.documents || []).forEach((d) => {
    urls.push(d.document);
  });
  return urls;
};

const Account = ({
  token,
  instructorLoggedIn,
  studentLoggedIn,
  loadedUser,
  formValues = {},
  initialValues,
  changeField,
  touchField,
  clearProfilePicture,
  updateAccount,
  showDocuments,
  formErrors,
  loading,
  fetchUser,
  width
}) => {
  const isAccountActivated = (loadedUser || {}).isAccountActivated
  const { t } = useTranslation()
  const [initialUrls, setInitialUrls] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const classes = useStyles();
  const checkPageValidity = () => {
    touchField("firstName");
    touchField("lastName");
    touchField("dob");
    touchField("sex");
    touchField("currentPassword");
    touchField("newPassword");
    touchField("newPasswordConfirm");
    if (formErrors.isValid) return true;
  };

  const { isEditingPassword } = formValues;
  useEffect(() => {
    if (token) {
      fetchUser(token);
    }

    const initialUrls = getUrls(initialValues);
    setInitialUrls(initialUrls);
  }, [token]);
  let accountType;
  if (studentLoggedIn) accountType = "student";
  if (instructorLoggedIn) accountType = "instructor";
  const handlePasswordEdit = () => {
    const previousValue = isEditingPassword ? true : false;
    changeField("isEditingPassword", !previousValue);
  };
  const handleAccountUpdate = () => {
    const updatedUrls = getUrls(formValues);
    const filesToDelete = (initialUrls || []).filter((initialUrl) => {
      if (!updatedUrls.includes(initialUrl)) return initialUrl;
    });

    const val = checkPageValidity();
    if (!val) {
      setIsValid(false);
      return;
    }
    updateAccount(
      {
        ...formValues,
        accountType,
        newPassword: isEditingPassword ? formValues.newPassword : null,
        currentPassword: isEditingPassword ? formValues.currentPassword : null,
        language: localStorage.getItem('i18nextLng') || 'en',
      },
      token,
      filesToDelete
    );
  };

  function createData(info, fieldName) {
    return { info, fieldName };
  }

  const rows = [
    createData(t("account.firstName"), "firstName"),
    createData(t("account.lastName"), "lastName"),
    createData(t("account.email"), "email"),
    createData(t("account.dob"), "dob"),
    createData(t("account.id"), "numericalId"),



    !isEditingPassword
      ? createData(t("account.password"), formValues.isPassword ? t("account.buttons.edit") : t("account.buttons.setNewPassword"))
      : formValues.isPassword ? createData(t("account.currentPassword"), "currentPassword") : null,



    isEditingPassword ? createData(t("account.newPassword"), "newPassword") : null,


    isEditingPassword
      ? createData(t("account.confirmPassword"), "newPasswordConfirm")
      : null,
  ];
  const isError = !(
    (isValid || formErrors.isValid) &&
    (!formErrors.asyncError || formErrors.isValid)
  );
  if(!loadedUser) return null;
  if (!isAccountActivated && !loading && loadedUser) return <Typography color="secondary" align="center" >{t('layout.accountNotYetActivated')}</Typography>
  return (
    <Aux>
      <Spinner transparent active={loading} />
      <Typography align="center" variant="h4" gutterBottom>{t("layout.drawer.account")}</Typography>
      <div
        style={{
          maxWidth: "500px",
          margin: width > 500 ? "20px auto 0 auto" : "40px auto 0 auto",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Field
            name="profilePicture"
            circle
            onChangeFile={(image) => {
              changeField("loadedProfilePicture", image);
            }}
            compressImage
            loadedFile={formValues.loadedProfilePicture}
            component={FileInput}
            imageFile
            type="file"
            uploadButtonText={
              formValues.loadedProfilePicture
                ? t("account.buttons.updateProfilePicture")
                : t("account.buttons.uploadProfilePicture")
            }
            mimeTypesAllowed={"image/jpeg"}
            extensionsAllowed={["jpeg", "jpg", "jfif"]}
          />
          <Button
            disabled={formValues.loadedProfilePicture ? false : true}
            // variant="outlined"
            color="secondary"
            type="button"
            onClick={() => clearProfilePicture()}
            style={{ display: "block", margin: "auto" }}
          >
            {t("account.buttons.clearProfilePicture")}
          </Button>
        </div>
        <Table
          aria-label="simple table"
        >
          <TableBody>
            {rows.map((row, index) => {
              if (!row) return null;
              return (
                <TableRow key={row.info + index}>
                  <TableCell component="th" scope="row">
                    {row.info}
                    {index === 5 && isEditingPassword && (
                      <Typography
                        color="primary"
                        onClick={handlePasswordEdit}
                        variant="caption"
                        style={{ cursor: "pointer", display: "block" }}
                      >
                        { t("account.buttons.keepPassword")}
                      </Typography>
                    )}
                    {index === 6 && isEditingPassword && (
                      <Typography
                        color="primary"
                        onClick={handlePasswordEdit}
                        variant="caption"
                        style={{ cursor: "pointer", display: "block" }}
                      >
                        { t("account.buttons.removePassword")}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {" "}
                    {!(index === 3 || (index === 5 && !isEditingPassword)) && (
                      <Field
                        disabled={index === 4 || row.fieldName === "email"}
                        name={`${row.fieldName}`}
                        component={TextField}
                        simple
                        type={
                          index === 5 || index === 6 || index === 7
                            ? "password"
                            : "text"
                        }
                      />
                    )}
                    {index === 3 && (
                      <Field
                        name={row.fieldName}
                        oneFifthWidth
                        component={DatePicker}
                        type="date"
                        options={{
                          disableFuture: true,
                        }}
                        account
                        handleChange={(dob) => changeField("dob", dob)}
                        maxDate={new Date(Date.now() - 31449600000 * 3)} //user must be atleast 3 years old
                      />
                    )}
                    {index === 5 && !isEditingPassword && (
                      <Button
                        color="primary"
                        onClick={handlePasswordEdit}
                      >
                        {row.fieldName}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          onClick={() => {
            changeField("isEditingPassword", false);
            showDocuments()
          }}
          color="primary"
          style={{
            margin: "20px auto 0 auto",
            display: "block",
          }}
        >
          {t("account.buttons.documents")}
        </Button>
        {isError && (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <Typography color="error">{t("account.errors.correctForm")}</Typography>
          </div>
        )}
        <SubmitButton
          fullWidth
          isError={isError}
          clicked={handleAccountUpdate}
        >
          {t("account.buttons.saveChanges")}
        </SubmitButton>
      </div>
    </Aux>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAccount: (formValues, token, filesToDelete) =>
      dispatch(actions.updateAccountStart(formValues, token, filesToDelete)),
    logout: () => {
      dispatch(actions.logout());
    },
    changeField: (field, value) => {
      dispatch(change("accountForm", field, value));
    },
    touchField: (field) => {
      dispatch(touch("accountForm", field));
    },
    fetchUser: (token) => dispatch(actions.fetchUserStart(token)),
    showDocuments: () => {
      dispatch(actions.openModal(null, "studentDocuments"));
    },
    clearProfilePicture: () => {
      dispatch(change("accountForm", "profilePicture", null));
      dispatch(change("accountForm", "loadedProfilePicture", null));
    },
  };
};

const mapStateToProps = (state) => {
  const maxFileSize = state.common.configuration.studentFileSizeLimit
  const initialValues = { ...state.authentication.loadedUser, maxFileSize }
  return {
    loadedUser: state.authentication.loadedUser,
    formValues: getFormValues("accountForm")(state),
    formErrors: getFormSyncErrors("accountForm")(state),
    token: state.authentication.token,
    instructorLoggedIn: state.authentication.instructorLoggedIn,
    studentLoggedIn: state.authentication.studentLoggedIn,
    initialValues,
    loading: state.authentication.loading,
    width: state.common.width,
  };
};

const wrappedForm = reduxForm({
  form: "accountForm",
  enableReinitialize: true,
  validate: validate,
  destroyOnUnmount: true,
})(Account);

export default connect(mapStateToProps, mapDispatchToProps)(wrappedForm);
