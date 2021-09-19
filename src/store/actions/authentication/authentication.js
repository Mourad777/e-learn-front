import * as actionTypes from "../actionTypes";

export const toggleForm = (event, form) => {
  if (event) {
    event.preventDefault();
  }
  return {
    type: actionTypes.TOGGLE_FORM,
    form: form,
  };
};

export const createAccountStart = (formData) => {
  return {
    type: actionTypes.CREATE_ACCOUNT_START,
    payload: {
      formData,
    },
  };
};

export const createAccountSuccess = (message) => {
  return {
    type: actionTypes.CREATE_ACCOUNT_SUCCESS,
    message: message,
  };
};

export const createAccountFail = (message) => {
  return {
    type: actionTypes.CREATE_ACCOUNT_FAIL,
    message: message,
  };
};

export const updateAccountStart = (formData, token, filesToDelete) => {
  return {
    type: actionTypes.UPDATE_ACCOUNT_START,
    payload: {
      formData,
      token,
      filesToDelete,
    },
  };
};

export const updateAccountSuccess = (message) => {
  return {
    type: actionTypes.UPDATE_ACCOUNT_SUCCESS,
    message: message,
  };
};

export const updateAccountFail = (message) => {
  return {
    type: actionTypes.UPDATE_ACCOUNT_FAIL,
    message: message,
  };
};

export const accountVerificationStart = (password, token, userType, history) => {
  return {
    type: actionTypes.ACCOUNT_VERIFICATION_START,
    payload: {
      password,
      token,
      userType,
      history,
    },
  };
};

export const accountVerificationSuccess = (message) => {
  return {
    type: actionTypes.ACCOUNT_VERIFICATION_SUCCESS,
    message: message,
  };
};

export const accountVerificationFail = (message) => {
  return {
    type: actionTypes.ACCOUNT_VERIFICATION_FAIL,
    message: message,
  };
};

export const resendEmailVerificationStart = (email, accountType) => {
  return {
    type: actionTypes.RESEND_EMAIL_VERIFICATION_START,
    payload: {
      email,
      accountType,
    },
  };
};

export const resendEmailVerificationSuccess = (message) => {
  return {
    type: actionTypes.RESEND_EMAIL_VERIFICATION_SUCCESS,
    message: message,
  };
};

export const resendEmailVerificationFail = (message) => {
  return {
    type: actionTypes.RESEND_EMAIL_VERIFICATION_FAIL,
    message: message,
  };
};

export const fetchUserStart = (token) => {
  return {
    type: actionTypes.FETCH_USER_START,
    payload: {
      token,
    },
  };
};

export const fetchUserSuccess = (user) => {
  return {
    type: actionTypes.FETCH_USER_SUCCESS,
    user,
  };
};

export const fetchUserFail = (message) => {
  return {
    type: actionTypes.FETCH_USER_FAIL,
    message: message,
  };
};

export const authenticationStart = (formData) => {
  return {
    type: actionTypes.AUTHENTICATION_START,
    payload: { formData, history: formData.history },
  };
};

export const authenticationSuccess = (authData) => {
  return {
    type: actionTypes.AUTHENTICATION_SUCCESS,
    authData,
  };
};

export const authenticationFail = (message) => {
  return {
    type: actionTypes.AUTHENTICATION_FAIL,
    message: message,
  };
};

export const sendPasswordResetLinkStart = (authData) => {
  return {
    type: actionTypes.PASSWORD_RESET_LINK_START,
    payload: { authData },
  };
};

export const sendPasswordResetLinkSuccess = (message) => {
  return {
    type: actionTypes.PASSWORD_RESET_LINK_SUCCESS,
    message,
  };
};

export const sendPasswordResetLinkFail = (message) => {
  return {
    type: actionTypes.PASSWORD_RESET_LINK_FAIL,
    message,
  };
};

export const changePasswordStart = (authData, token, accountType, history) => {
  return {
    type: actionTypes.CHANGE_PASSWORD_START,
    payload: {
      authData,
      token,
      accountType,
      history,
    },
  };
};

export const changePasswordSuccess = (message) => {
  return {
    type: actionTypes.CHANGE_PASSWORD_SUCCESS,
    message,
  };
};

export const changePasswordFail = (message) => {
  return {
    type: actionTypes.CHANGE_PASSWORD_FAIL,
    message,
  };
};

export const setSignupFormPage = (page) => {
  return {
    type: actionTypes.SET_SIGNUP_FORM_PAGE,
    page,
  };
};

export const refreshTokenStart = (token) => {
  return {
    type: actionTypes.REFRESH_TOKEN_START,
    payload: {
      token,
    },
  };
};

export const refreshTokenSuccess = (authData) => {
  return {
    type: actionTypes.REFRESH_TOKEN_SUCCESS,
    authData,
  };
};

export const refreshTokenFail = (message) => {
  return {
    type: actionTypes.REFRESH_TOKEN_FAIL,
    message: message,
  };
};

export const logout = (history) => {
  localStorage.removeItem("userFirstName");
  localStorage.removeItem("userLastName");
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  localStorage.removeItem("userType");
  localStorage.removeItem("profilePicture");
  localStorage.removeItem("refreshTokenExpiration");
  // if (history) history.push('/authentication');
  return {
    type: actionTypes.LOGOUT,
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const forgotPasswordPage = () => {
  return {
    type: actionTypes.FORGOT_PASSWORD_PAGE,
  };
};

export const clearAuthNotification = () => {
  return {
    type: actionTypes.CLEAR_AUTH_NOTIFICATION,
  };
};

export const checkUserSession = (history) => {
  return {
    type: actionTypes.CHECK_USER_SESSION,
    payload:{
      history,
    }
  };
};
