import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
    loading: false,
    successMessage: null,
    failMessage: null,
};

const resetState = (state) => {
    return updateObject(state, {
        loading: false,
        successMessage: null,
        failMessage: null,
    });
};

const activateAccountStart = (state) => {
    return updateObject(state, {
        loading: true,
    });
};

const activateAccountSuccess = (state, action) => {
    return updateObject(state, {
        loading: false,
        successMessage: action.message,
    });
};

const activateAccountFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        failMessage: action.message,
    });
};

const suspendAccountStart = (state) => {
    return updateObject(state, {
        loading: true,
    });
};

const suspendAccountSuccess = (state) => {
    return updateObject(state, {
        loading: false,
        successMessage: action.message,
    });
};

const suspendAccountFail = (state, action) => {
    return updateObject(state, {
        loading: false,
        failMessage: action.message,
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
        case actionTypes.ACTIVATE_ACCOUNT_START:
            return activateAccountStart(state);
        case actionTypes.ACTIVATE_ACCOUNT_SUCCESS:
            return activateAccountSuccess(state, action);
        case actionTypes.ACTIVATE_ACCOUNT_FAIL:
            return activateAccountFail(state, action);

        case actionTypes.SUSPEND_ACCOUNT_START:
            return suspendAccountStart(state, action);
        case actionTypes.SUSPEND_ACCOUNT_SUCCESS:
            return suspendAccountSuccess(state, action);
        case actionTypes.SUSPEND_ACCOUNT_FAIL:
            return suspendAccountFail(state, action);

        case actionTypes.CLEAR_ALERT:
            return clearAlert(state);

        case actionTypes.LOGOUT:
            return resetState(state, action);

        default:
            return state;
    }
};

export default reducer;
