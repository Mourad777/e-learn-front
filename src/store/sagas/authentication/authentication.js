import {
  takeLatest,
  call,
  fork,
  put,
  delay,
  takeEvery,
} from "redux-saga/effects";
import axiosGraphql from "../../actions/axios-base";
import * as actions from "../../actions/index";
import * as actionTypes from "../../actions/actionTypes";
import {
  loginQuery,
  signupQuery,
  updateAccountQuery,
  passwordResetLinkQuery,
  changePasswordQuery,
  fetchUserQuery,
  refreshTokenQuery,
  verifyAccountQuery,
  resendVerificationEmailQuery,
} from "./queries";

import { updateSyncErrors, destroy, reset } from "redux-form";
import bson from "bson";
import { uploadFile, getKey } from "../../../utility/uploadFile";
import history from "../../../utility/history";
import { urlKeyConverter } from "../../../utility/urlKeyConverter";
import { getKeyFromAWSUrl } from "../../../utility/getKeyFromUrl";
import i18n from "../../../i18n/index";
import { set, get } from 'idb-keyval';
import { getStringifiedSubscription } from './util'
//history
const setIndexDB = async (field, value) => {
  return await set(field, value)
}

const getIndexDB = async (field) => {
  return await get(field)
}


function* login({ payload }) {
  //userLogin
  const subscription = yield call(getIndexDB, 'subscription');
  const formData = payload.formData;
  const history = payload.history;
  const googleTokenId = formData.googleTokenId;
  let parsedSubscription;
  if (subscription) {
    parsedSubscription = JSON.parse(subscription);
  }
  const graphqlQuery = loginQuery(formData, getStringifiedSubscription(parsedSubscription));
  const theme = localStorage.getItem("theme");
  console.log('googleTokenId: ', googleTokenId)
  try {
    const response = yield call(axiosGraphql, graphqlQuery, googleTokenId);
    console.log("Login response", response);
    let errorMessage;
    const resErrors = response.data.errors;
    if (resErrors) {
      errorMessage = resErrors[0].message;
    }
    console.log('errorMessage', errorMessage)
    if (resErrors && errorMessage === "accountSuspended") {
      yield put(
        updateSyncErrors("authenticationForm", {
          accountSuspended: i18n.t("auth.errors.accountSuspended"),
          asyncError: true,
        })
      );
    }
    if (resErrors && errorMessage === "noAdminAccount") {
      yield put(
        updateSyncErrors("authenticationForm", {
          noAdminAccount: true,
          asyncError: true,
        })
      );
    }
    if (resErrors && errorMessage === "wrongPassword") {
      yield put(
        updateSyncErrors("authenticationForm", {
          password: i18n.t("auth.errors.wrongPassword"),
          asyncError: true,
        })
      );
    }
    if (resErrors && errorMessage === "noPasswordCreated") {
      yield put(
        updateSyncErrors("authenticationForm", {
          password: i18n.t("auth.errors.noPasswordCreated"),
          asyncError: true,
        })
      );
    }
    if (
      resErrors &&
      (errorMessage === "studentNoAccount" ||
        errorMessage === "instructorNoAccount")
    ) {
      errorMessage = resErrors[0].message;
      yield put(
        updateSyncErrors("authenticationForm", {
          email: i18n.t(`auth.errors.${errorMessage}`),
          asyncError: true,
        })
      );
    }
    if (resErrors && errorMessage === "notVerifiedCheckEmail") {
      errorMessage = resErrors[0].message;
      yield put(
        updateSyncErrors("authenticationForm", {
          type: i18n.t("auth.errors.notVerifiedCheckEmail"),
          asyncError: true,
        })
      );
    }
    if (resErrors) {
      yield put(actions.authenticationFail());
      return;
    }
    const responseData = response.data.data.userLogin;
    const token = responseData.token;
    const userId = responseData.userId;
    const expirationDate = responseData.expiresIn;
    const firstName = responseData.firstName;
    const lastName = responseData.lastName;
    const userType = formData.type;
    const profilePicture = responseData.profilePicture;
    const language = responseData.language;
    const refreshTokenExpiration = responseData.refreshTokenExpiration;
    const lastLogin = responseData.lastLogin;
    // yield put(actions.fetchCoursesStart(token));
    // yield put(actions.fetchNotificationsStart(token));

    // if (userType === "instructor") {
    //   yield put(actions.fetchInstructorsStart(token));
    // }
    // if (userType === "student") {
    //   yield put(actions.fetchTestResultsStart(token));
    // }
    // yield put(actions.fetchConfigStart(token));
    yield put(actions.fetchUserStart(token));
    yield put(
      actions.authenticationSuccess({
        token,
        userId,
        userType,
        firstName,
        lastName,
        profilePicture,
        expirationDate,
        refreshTokenExpiration,
        lastLogin,
        language,
      })
    );
    yield call(setIndexDB, 'token', token);
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userFirstName", firstName);
    localStorage.setItem("userLastName", lastName);
    localStorage.setItem("profilePicture", profilePicture);
    localStorage.setItem("i18nextLng", language);

    if (refreshTokenExpiration) {
      localStorage.setItem("refreshTokenExpiration", refreshTokenExpiration);
    }

    if (userType === "instructor"|| userType === "admin") {
      history.push("/instructor-panel/courses");
    }
    if (userType === "student") {
      history.push("/student-panel/courses");
    }
    if (theme === "dark") {
      yield put(actions.setTheme(theme));
    }
    if (theme === "light") {
      yield put(actions.setTheme(theme));
    }
    else {
      yield put(actions.setTheme('dark'));
    }
  } catch (e) {
    console.log("e: ", e);
    const failMessage = i18n.t("alerts.auth.loginFail");
    yield put(actions.authenticationFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* fetchUser({ payload: { token } }) {
  const graphqlQuery = fetchUserQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Fetch user response", response);
    if (((response.data.errors || [])[0] || {}).message == 'accountNotActivated') {

      yield put(
        actions.fetchUserSuccess({
          isAccountActivated: false,
        })
      );
    }
    if (response.data.errors) {
      throw new Error("Failed to get te courses");
    }
    const user = response.data.data.user;
    const profilePictureKey = getKeyFromAWSUrl(user.profilePicture);
    if (user.admin) localStorage.setItem("userType", 'admin');
    yield put(
      actions.fetchUserSuccess({
        ...user,
        numericalId: user._id.replace(/\D/g, ""),
        dob: new Date(user.dob),
        isAccountActivated: true,
        loadedProfilePicture: user.profilePicture,
        profilePicture: profilePictureKey,
        isAccountActivated: true,
        documents: user.documents.map((d) => {
          return {
            documentType: d.documentType,
            document: getKeyFromAWSUrl(d.document),
            loadedDocument: d.document,
          };
        }),
      })
    );
  } catch (e) {
    console.log("e: ", e);
    const failMessage = i18n.t("alerts.auth.fetchUserFail");
    yield put(actions.fetchUserFail());
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* autoLogin({ payload }) {
  const history = payload.history;
  const token = localStorage.getItem("token");
  const theme = localStorage.getItem("theme");
  if (token) {
    yield call(setIndexDB, 'token', token);
  }
  try {
    if (!token || token === 'undefined') {
      yield put(actions.logout(history));
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      console.log('expirationDate.getTime()', expirationDate.getTime())
      if (expirationDate.getTime() <= Date.now()) {
        yield put(actions.logout());
      } else {
        const firstName = localStorage.getItem("userFirstName");
        const lastName = localStorage.getItem("userLastName");
        const userId = localStorage.getItem("userId");
        const userType = localStorage.getItem("userType");
        const profilePicture = localStorage.getItem("profilePicture");

        yield put(
          actions.authenticationSuccess({
            token,
            userId,
            userType,
            firstName,
            lastName,
            profilePicture,
            expirationDate,
          })
        );

        yield put(actions.fetchUserStart(token));

        if (theme === "dark") {
          yield put(actions.setTheme(theme));
        }
        if (theme === "light") {
          yield put(actions.setTheme(theme));
        }
        else {
          yield put(actions.setTheme('dark'));
        }
      }
    }
  } catch (e) {
    console.log("e: ", e);
  }
}

function* createAccount({ payload }) {
  const formData = payload.formData;
  const subscription = yield call(getIndexDB, 'subscription');
  const userId = new bson.ObjectId().toHexString();
  const parsedSubscription = JSON.parse(subscription);

  try {
    const graphqlQuery = signupQuery({
      formData,
      _id: userId,
      subscription: getStringifiedSubscription(parsedSubscription),
    });

    const response = yield call(axiosGraphql, graphqlQuery);
    const resErrors = response.data.errors;
    let errorMessage;
    if (resErrors) {
      console.log('resErrors', resErrors)
      errorMessage = errorMessage = (resErrors[0].data || [])[0].message;
    }

    if (resErrors && errorMessage === "emailTaken") {
      yield put(
        updateSyncErrors("authenticationForm", {
          email: i18n.t("auth.errors.emailTaken"),
          asyncError: true,
        })
      );
      yield put(actions.createAccountFail());
      return;
    } else if (resErrors && errorMessage === "noAdminAccount") {
      yield put(
        updateSyncErrors("authenticationForm", {
          noAdminAccount: true,
          asyncError: true,
        })
      );
      yield put(actions.createAccountFail());
      return;
    } else if (response.data.errors) {
      throw new Error("Creating the account failed");
    }
    const successMessage = i18n.t("alerts.auth.accountCreatedSuccess");
    yield put(actions.createAccountSuccess(successMessage));
    yield put(actions.toggleForm());
    yield put(destroy("authenticationForm"));
    yield put(actions.setSignupFormPage(1));

    yield delay(6000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("Error creating account: ", e);
    const failMessage = i18n.t("alerts.auth.accountCreatedFail");
    yield put(actions.createAccountFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* updateAccount({ payload }) {
  const formData = payload.formData;
  const token = payload.token;
  const filesToDelete = payload.filesToDelete;
  const profilePictureFile = formData.profilePicture;
  const path = `users/${formData._id}/profilePicture`;
  const profilePictureKey = getKey(profilePictureFile, path);

  const docPath = `users/${formData._id}/documents`;
  const docs = (formData.documents || []).map((d) => {
    let key;
    if (d.document instanceof File) {
      key = getKey(d.document, docPath);
    } else {
      key = urlKeyConverter(d.document);
    }
    return { ...d, key };
  });

  let formattedDocuments = "";
  docs.forEach((item, index) => {
    formattedDocuments += `{ 
                        document: "${docs[index].key || ""}", 
                        documentType: "${docs[index].documentType}",
                        }`;
  });
  try {
    const graphqlQuery = updateAccountQuery({
      formData,
      profilePictureKey,
      profilePictureFile,
      formattedDocuments,
    });

    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Update account response: ", response);
    const resErrors = response.data.errors;
    let errorMessage;
    if (resErrors) {
      errorMessage = resErrors[0].data[0].message;
    }
    console.log("errorMessage", errorMessage);
    if (resErrors && errorMessage === "wrongPassword") {
      yield put(
        updateSyncErrors("accountForm", {
          currentPassword: i18n.t("auth.errors.wrongPassword"),
          asyncError: true,
          isValid: false,
        })
      );
      yield put(actions.updateAccountFail());
      return;
    } else if (resErrors && errorMessage === "emailTaken") {
      yield put(
        updateSyncErrors("accountForm", {
          email: i18n.t("auth.errors.emailTaken"),
          isValid: false,
          asyncError: true,
        })
      );
      yield put(actions.updateAccountFail());
      return;
    } else if (response.data.errors) {
      throw new Error("Updating account failed");
    }
    if ((filesToDelete || []).length > 0)
      yield put(actions.deleteFilesStart(filesToDelete, token));
    history.push(`/${formData.accountType}-panel/courses`);
  } catch (e) {
    console.log("Error updating account: ", e);
    const failMessage = i18n.t("alerts.auth.updatedAccountFail");
    yield put(actions.updateAccountFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }

  if (formData.profilePicture instanceof File) {
    try {
      yield call(uploadFile, profilePictureFile, profilePictureKey, token);
    } catch (e) {
      console.log("Error uploading profile picture: ", e);
      const failMessage = i18n.t("alerts.auth.uploadingPictureFail");
      yield put(actions.updateAccountFail(failMessage));
      yield delay(3000);
      yield put(actions.clearAlert());
      return;
    }
  }

  try {
    for (const i in docs) {
      if (docs.hasOwnProperty(i)) {
        if (docs[i].document instanceof File) {
          yield call(uploadFile, docs[i].document, docs[i].key, token);
          continue;
        }
      }
    }
  } catch (e) {
    console.log("Error uploading account documents: ", e);
    const failMessage = i18n.t("alerts.auth.uploadingDocumentsFail");
    yield put(actions.updateAccountFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
    return;
  }
  const successMessage = i18n.t("alerts.auth.updatedAccountSuccess");
  yield put(actions.updateAccountSuccess(successMessage));
  yield delay(3000);
  yield put(actions.clearAlert());
  yield put(actions.fetchUserStart(token));
}

function* verifyAccount({ payload }) {
  const { password, token, userType, history } = payload;
  const graphqlQuery = verifyAccountQuery(password, token);
  try {
    const response = yield call(axiosGraphql, graphqlQuery);
    console.log("Verify account response", response);

    let errorMessage;
    const resErrors = response.data.errors;
    if (resErrors) {
      errorMessage = resErrors[0].message;

      if (resErrors && resErrors[0].message === "wrongPassword" || resErrors[0].message === "jwt expired" || resErrors[0].message === "alreadyVerified") {
        errorMessage = resErrors[0].message;
        yield put(
          updateSyncErrors("verifyAccount", {
            password: i18n.t(`auth.errors.${resErrors[0].message}`),
          })
        );

        if (resErrors[0].message === "jwt expired") {
          yield put(
            updateSyncErrors("verifyAccount", {
              isTokenExpired: true,

            })
          );
        }

        yield put(actions.accountVerificationFail());
        return;
      }
    }

    if (response.data.errors) {
      throw new Error("Failed to verify account");
    }
    const successMessage = i18n.t("alerts.auth.accountVerifySuccess");
    yield put(actions.accountVerificationSuccess(successMessage));

    const responseData = response.data.data.verifyAccount;
    const token = responseData.token;
    const userId = responseData.userId;
    const expirationDate = responseData.expiresIn;
    const firstName = responseData.firstName;
    const lastName = responseData.lastName;
    const language = responseData.language;
    const profilePicture = responseData.profilePicture;
    const refreshTokenExpiration = responseData.refreshTokenExpiration;
    //log previous user out
    yield put(actions.logout());
    yield call(setIndexDB, 'token', token);
    console.log('setting token: ', token)
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userFirstName", firstName);
    localStorage.setItem("userLastName", lastName);
    localStorage.setItem("profilePicture", profilePicture);
    localStorage.setItem("i18nextLng", language);
    yield put(actions.fetchUserStart(token));
    yield put(
      actions.authenticationSuccess({
        token,
        userId,
        userType,
        firstName,
        lastName,
        expirationDate,
        refreshTokenExpiration,
        language,
        profilePicture,
      })
    );

    if (userType === "instructor") {
      history.push("/instructor-panel/courses");
    }
    if (userType === "student") {
      history.push("/student-panel/courses");
    }
    // history.push('/authentication')
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("Error verifying the account", e);
    const failMessage = i18n.t("alerts.auth.accountVerifyFail");
    yield put(actions.accountVerificationFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* resendEmailVerification({ payload }) {
  const { email, accountType } = payload;
  const graphqlQuery = resendVerificationEmailQuery(email, accountType);
  try {
    const response = yield call(axiosGraphql, graphqlQuery);
    console.log("Resend e-mail verification response", response);

    let errorMessage;
    const resErrors = response.data.errors;
    if (resErrors) {
      errorMessage = resErrors[0].message;

      if (resErrors && resErrors[0].message === "noAccountWithEmail" || resErrors[0].message === "alreadyVerified") {
        errorMessage = resErrors[0].message;
        yield put(
          updateSyncErrors("verifyAccount", {
            email: i18n.t(`auth.errors.${resErrors[0].message}`),
          })
        );
        yield put(
          updateSyncErrors("authenticationForm", {
            email: i18n.t(`auth.errors.${resErrors[0].message}`),
          })
        );
        yield put(actions.resendEmailVerificationFail());
        return;
      }
    }


    if (resErrors) {
      console.log('throwing error', response.data.errors)
      throw new Error("Failed to send a verification e-mail");
    }
    const successMessage = i18n.t("alerts.auth.verificationLinkSentSuccess");
    yield put(actions.resendEmailVerificationSuccess(successMessage));
    // yield put(reset("passwordReset"));
    // history.push("/authentication");
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log('e', e)
    console.log("Error sending the verification e-mail");
    const failMessage = i18n.t("alerts.auth.verificationLinkSentFail");
    yield put(actions.resendEmailVerificationFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* sendPasswordResetLink({ payload }) {
  const { email, type } = payload.authData;
  const graphqlQuery = passwordResetLinkQuery(email, type);
  try {
    const response = yield call(axiosGraphql, graphqlQuery);
    console.log("Send password reset link response: ", response);

    let errorMessage;
    const resErrors = response.data.errors;
    if (resErrors) {
      errorMessage = resErrors[0].message;
    }
    if (
      resErrors &&
      (errorMessage === "studentNoAccount" ||
        errorMessage === "instructorNoAccount" ||
        errorMessage === "noPasswordCreated")
    ) {
      errorMessage = resErrors[0].message;

      yield put(
        updateSyncErrors("authenticationForm", {
          email: i18n.t(`auth.errors.${errorMessage}`),
          asyncError: true,
        })
      );
      yield put(actions.sendPasswordResetLinkFail());
      return;
    }
    if (response.data.errors) {
      throw new Error("Failed to initialize password reset");
    }
    const successMessage = i18n.t("alerts.auth.passwordResetLinkSentSuccess");
    yield put(actions.sendPasswordResetLinkSuccess(successMessage));
    yield put(actions.toggleForm(null, "signin"));
    yield put(reset("authenticationForm"));
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("Error sending password reset link");
    const failMessage = i18n.t("alerts.auth.passwordResetLinkSentFail");
    yield put(actions.sendPasswordResetLinkFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* changePassword({ payload }) {
  const { authData, token, accountType, history } = payload;
  const graphqlQuery = changePasswordQuery(authData, token, accountType);
  try {
    const response = yield call(axiosGraphql, graphqlQuery);
    console.log("Change password response", response);
    if (response.data.errors) {
      throw new Error("Failed to set a new password");
    }
    const successMessage = i18n.t("alerts.auth.passwordChangeSuccess");
    yield put(actions.changePasswordSuccess(successMessage));
    yield put(reset("passwordReset"));
    history.push("/authentication");
    yield delay(3000);
    yield put(actions.clearAlert());
  } catch (e) {
    console.log("Error changing password");
    const failMessage = i18n.t("alerts.auth.passwordChangeFail");
    yield put(actions.changePasswordFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* refreshToken({ payload }) {
  const { token } = payload;
  yield call(setIndexDB, 'token', token);
  const graphqlQuery = refreshTokenQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Refresh session response", response);
    const responseData = response.data.data.refreshToken;
    if (response.data.errors) {
      throw new Error("Failed to refresh session");
    }
    yield put(
      actions.refreshTokenSuccess({
        //if refresh token time limit reached, use same token
        token: responseData.token === "expired" ? "" : responseData.token,
        expirationDate:
          responseData.expiresIn === "same" ? "" : responseData.expiresIn,
        refreshTokenExpiration: responseData.refreshTokenExpiration,
      })
    );
    yield put(actions.setSessionAlert("off"));
  } catch (e) {
    console.log("Error refreshing the token");
    const failMessage = i18n.t("alerts.auth.extendingSessionFail");
    yield put(actions.refreshTokenFail());
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* watchLogin() {
  yield takeLatest(actionTypes.AUTHENTICATION_START, login);
}

function* watchAutoLogin() {
  yield takeLatest(actionTypes.CHECK_USER_SESSION, autoLogin);
}

function* watchFetchUser() {
  yield takeEvery(actionTypes.FETCH_USER_START, fetchUser);
}

function* watchSignup() {
  yield takeLatest(actionTypes.CREATE_ACCOUNT_START, createAccount);
}

function* watchSendPasswordResetLink() {
  yield takeLatest(
    actionTypes.PASSWORD_RESET_LINK_START,
    sendPasswordResetLink
  );
}

function* watchUpdateAccount() {
  yield takeLatest(actionTypes.UPDATE_ACCOUNT_START, updateAccount);
}

function* watchVerifyAccount() {
  yield takeLatest(actionTypes.ACCOUNT_VERIFICATION_START, verifyAccount);
}

function* watchResendVerificationEmail() {
  yield takeLatest(
    actionTypes.RESEND_EMAIL_VERIFICATION_START,
    resendEmailVerification
  );
}

function* watchChangePassword() {
  yield takeLatest(actionTypes.CHANGE_PASSWORD_START, changePassword);
}

function* watchRefreshSession() {
  yield takeLatest(actionTypes.REFRESH_TOKEN_START, refreshToken);
}

const authenticationSagas = [
  fork(watchLogin),
  fork(watchAutoLogin),
  fork(watchFetchUser),
  fork(watchSignup),
  fork(watchSendPasswordResetLink),
  fork(watchUpdateAccount),
  fork(watchVerifyAccount),
  fork(watchResendVerificationEmail),
  fork(watchChangePassword),
  fork(watchRefreshSession),
];

export default authenticationSagas;
