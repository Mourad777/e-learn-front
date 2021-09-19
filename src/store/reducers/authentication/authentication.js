import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: "/",
  instructorLoggedIn: false,
  studentLoggedIn: false,
  adminLoggedIn: false,
  formIsSignup: false,
  formIsForgotPassword: false,
  activeForm: null,
  loadedUser: null,
  userFirstName: null,
  userLastName: null,
  profilePicture: null,
  signupFormPage: 1,
  successMessage: null,
  failMessage: null,
  sessionExpiration: null,
  refreshTokenExpiration: null,
  initialPath: null,
};

const toggleForm = (state, action) => {
  return updateObject(state, {
    formIsSignup: action.form === "signin" ? false : !state.formIsSignup,
    formIsForgotPassword: false,
  });
};

const forgotPasswordPageToggle = (state) => {
  return updateObject(state, {
    formIsForgotPassword: !state.formIsForgotPassword,
  });
};

const createAccountStart = (state) => {
  return updateObject(state, { loading: true });
};

const createAccountSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const createAccountFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const updateAccountStart = (state) => {
  return updateObject(state, { loading: true });
};

const updateAccountSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const updateAccountFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const fetchUserStart = (state) => {
  return updateObject(state, { loading: true });
};

const fetchUserSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    loadedUser: action.user,
  });
};

const fetchUserFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const changePasswordStart = (state) => {
  return updateObject(state, { loading: true });
};

const changePasswordSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const changePasswordFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const sendPasswordLinkStart = (state) => {
  return updateObject(state, { loading: true });
};

const sendPasswordLinkSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const sendPasswordLinkFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const accountVerificationStart = (state) => {
  return updateObject(state, { loading: true });
};

const accountVerificationSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const accountVerificationFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const resendEmailVerificationStart = (state) => {
  return updateObject(state, { loading: true });
};

const resendEmailVerificationSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const resendEmailVerificationFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    loading: false,
  });
};

const refreshTokenStart = (state) => {
  return updateObject(state, {
    // loading: true,
  });
};

const refreshTokenSuccess = (state, action) => {
  const data = action.authData;
  const expiration = new Date(Date.now() + data.expirationDate * 1000);
  if (!localStorage.getItem('userType') || !localStorage.getItem('token')) {
    return updateObject(state, {
      loading: false,
    });
  }
  if (!data.token) {
    return updateObject(state, {
      // loading: false,
      successMessage: action.message,
    });
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("expirationDate", expiration);
  return updateObject(state, {
    // loading: false,
    successMessage: action.message,
    sessionExpiration: expiration
      ? expiration
      : new Date(localStorage.getItem("expirationDate")),
    token: data.token ? data.token : localStorage.getItem("token"),
  });
};

const refreshTokenFail = (state, action) => {
  return updateObject(state, {
    failMessage: action.message,
    // loading: false,
  });
};

const authenticationStart = (state) => {
  return updateObject(state, { error: null, loading: true });
};

const authenticationSuccess = (state, action) => {
  const data = action.authData;
  let expiration;
  if (data.expirationDate instanceof Date) {
    expiration = data.expirationDate;
  } else {
    expiration = new Date(Date.now() + data.expirationDate * 1000);
  }
  localStorage.setItem("expirationDate", expiration);
  return updateObject(state, {
    studentLoggedIn: data.userType === "student",
    instructorLoggedIn: data.userType === "instructor" || data.userType === "admin",
    adminLoggedIn: data.userType === "admin",
    error: null,
    loading: false,
    token: data.token,
    userId: data.userId,
    userFirstName: data.firstName,
    userLastName: data.lastName,
    profilePicture: data.profilePicture,
    error: null,
    loading: false,
    initialPath: !state.initialPath ? data.initialPath : state.initialPath,
    sessionExpiration: expiration,
    refreshTokenExpiration: parseInt(
      localStorage.getItem("refreshTokenExpiration") || data.refreshTokenExpiration
    ),
  });
};

const authenticationFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
    failMessage: action.message,
  });
};

const logout = (state) => {
  return updateObject(state, {
    token: null,
    userId: null,
    instructorLoggedIn: false,
    studentLoggedIn: false,
    adminLoggedIn: false,
    userFirstName: null,
    userLastName: null,
    profilePicture: null,
    refreshTokenExpiration: null,
    loadedUser: null,
    sessionExpiration: null,
  });
};

const setSignupFormPage = (state, action) => {
  return updateObject(state, {
    error: null,
    signupFormPage: action.page,
  });
};

const clearAlert = (state) => {
  return updateObject(state, {
    successMessage: null,
    failMessage: null,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOGGLE_FORM:
      return toggleForm(state, action);

    case actionTypes.CREATE_ACCOUNT_START:
      return createAccountStart(state, action);
    case actionTypes.CREATE_ACCOUNT_SUCCESS:
      return createAccountSuccess(state, action);
    case actionTypes.CREATE_ACCOUNT_FAIL:
      return createAccountFail(state, action);

    case actionTypes.UPDATE_ACCOUNT_START:
      return updateAccountStart(state, action);
    case actionTypes.UPDATE_ACCOUNT_SUCCESS:
      return updateAccountSuccess(state, action);
    case actionTypes.UPDATE_ACCOUNT_FAIL:
      return updateAccountFail(state, action);

    case actionTypes.AUTHENTICATION_START:
      return authenticationStart(state, action);
    case actionTypes.AUTHENTICATION_SUCCESS:
      return authenticationSuccess(state, action);
    case actionTypes.AUTHENTICATION_FAIL:
      return authenticationFail(state, action);

    case actionTypes.FETCH_USER_START:
      return fetchUserStart(state, action);
    case actionTypes.FETCH_USER_SUCCESS:
      return fetchUserSuccess(state, action);
    case actionTypes.FETCH_USER_FAIL:
      return fetchUserFail(state, action);

    case actionTypes.CHANGE_PASSWORD_START:
      return changePasswordStart(state, action);
    case actionTypes.CHANGE_PASSWORD_SUCCESS:
      return changePasswordSuccess(state, action);
    case actionTypes.CHANGE_PASSWORD_FAIL:
      return changePasswordFail(state, action);

    case actionTypes.PASSWORD_RESET_LINK_START:
      return sendPasswordLinkStart(state);
    case actionTypes.PASSWORD_RESET_LINK_SUCCESS:
      return sendPasswordLinkSuccess(state, action);
    case actionTypes.PASSWORD_RESET_LINK_FAIL:
      return sendPasswordLinkFail(state, action);

    case actionTypes.ACCOUNT_VERIFICATION_START:
      return accountVerificationStart(state);
    case actionTypes.ACCOUNT_VERIFICATION_SUCCESS:
      return accountVerificationSuccess(state, action);
    case actionTypes.ACCOUNT_VERIFICATION_FAIL:
      return accountVerificationFail(state, action);

    case actionTypes.RESEND_EMAIL_VERIFICATION_START:
      return resendEmailVerificationStart(state);
    case actionTypes.RESEND_EMAIL_VERIFICATION_SUCCESS:
      return resendEmailVerificationSuccess(state, action);
    case actionTypes.RESEND_EMAIL_VERIFICATION_FAIL:
      return resendEmailVerificationFail(state, action);

    case actionTypes.REFRESH_TOKEN_START:
      return refreshTokenStart(state);
    case actionTypes.REFRESH_TOKEN_SUCCESS:
      return refreshTokenSuccess(state, action);
    case actionTypes.REFRESH_TOKEN_FAIL:
      return refreshTokenFail(state, action);

    case actionTypes.LOGOUT:
      return logout(state, action);
    case actionTypes.SET_SIGNUP_FORM_PAGE:
      return setSignupFormPage(state, action);
    case actionTypes.FORGOT_PASSWORD_PAGE:
      return forgotPasswordPageToggle(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    default:
      return state;
  }
};

export default reducer;
