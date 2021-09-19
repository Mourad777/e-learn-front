import * as actionTypes from "../actionTypes";

export const requestBitcoinAddressStart = (courseId,token) => {
  return {
    type: actionTypes.REQUEST_BITCOIN_ADDRESS_START,
    payload:{
      courseId,
      token,
    }
  };
};

export const requestBitcoinAddressSuccess = (address) => {
  return {
    type: actionTypes.REQUEST_BITCOIN_ADDRESS_SUCCESS,
    address,
  };
};

export const requestBitcoinAddressFail = (message) => {
  return {
    type: actionTypes.REQUEST_BITCOIN_ADDRESS_FAIL,
    message,
  };
};

export const intentCreditcardPaymentStart = (studentId, courseId,paymentMethodId, paymentIntentId,isApproveEnrollments, token, history) => {
  return {
    type: actionTypes.INTENT_CREDITCARD_PAYMENT_START,
    payload:{
      studentId,
      courseId,
      paymentMethodId,
      paymentIntentId,
      isApproveEnrollments,
      token,
      history,
    }
  };
};

export const intentCreditcardPaymentSuccess = (clientSecret) => {
  return {
    type: actionTypes.INTENT_CREDITCARD_PAYMENT_SUCCESS,
    clientSecret,
  };
};

export const intentCreditcardPaymentFail = (message) => {
  return {
    type: actionTypes.INTENT_CREDITCARD_PAYMENT_FAIL,
    message,
  };
};



export const fetchTransactionsStart = (token) => {
  return {
    type: actionTypes.FETCH_TRANSACTIONS_START,
    payload:{
      token,
    }
  };
};

export const fetchTransactionsSuccess = (transactions) => {
  return {
    type: actionTypes.FETCH_TRANSACTIONS_SUCCESS,
    transactions,
  };
};

export const fetchTransactionsFail = (message) => {
  return {
    type: actionTypes.FETCH_TRANSACTIONS_FAIL,
    message,
  };
}

export const fetchCryptoChargesStart = (token) => {
  return {
    type: actionTypes.FETCH_CRYPTO_CHARGES_START,
    payload:{
      token,
    }
  };
};

export const fetchCryptoChargesSuccess = (charges) => {
  return {
    type: actionTypes.FETCH_CRYPTO_CHARGES_SUCCESS,
    cryptoCharges:charges,
  };
};

export const fetchCryptoChargesFail = (message) => {
  return {
    type: actionTypes.FETCH_CRYPTO_CHARGES_FAIL,
    message,
  };
}