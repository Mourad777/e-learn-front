import * as actionTypes from "../../actions/actionTypes";
import { updateObject } from "../../utility";

const initialState = {
  loading: false,
  successMessage: null,
  failMessage: null,
  bitcoinAddress: null,
  bitcoinAddressExpiration: null,
  transactions: null,
  cryptoCharges:null,
};

const resetState = (state) => {
  return updateObject(state, {
    loading: false,
    successMessage: null,
    failMessage: null,
    bitcoinAddress: null,
    bitcoinAddressExpiration: null,
    transactions: null,
    cryptoCharges:null,
  });
};

const requestBitcoinAddressStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const requestBitcoinAddressSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const requestBitcoinAddressFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const intentCreditcardPaymentStart = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const intentCreditcardPaymentSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    successMessage: action.message,
  });
};

const intentCreditcardPaymentFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const fetchTransactionsStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchTransactionsSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    transactions: action.transactions,
  });
};

const fetchTransactionsFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    failMessage: action.message,
  });
};

const fetchCryptoChargesStart = (state) => {
  return updateObject(state, {
    loading: true,
  });
};

const fetchCryptoChargesSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    cryptoCharges: action.cryptoCharges,
  });
};

const fetchCryptoChargesFail = (state, action) => {
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
    case actionTypes.REQUEST_BITCOIN_ADDRESS_START:
      return requestBitcoinAddressStart(state, action);
    case actionTypes.REQUEST_BITCOIN_ADDRESS_SUCCESS:
      return requestBitcoinAddressSuccess(state, action);
    case actionTypes.REQUEST_BITCOIN_ADDRESS_FAIL:
      return requestBitcoinAddressFail(state, action);

    case actionTypes.INTENT_CREDITCARD_PAYMENT_START:
      return intentCreditcardPaymentStart(state, action);
    case actionTypes.INTENT_CREDITCARD_PAYMENT_SUCCESS:
      return intentCreditcardPaymentSuccess(state, action);
    case actionTypes.INTENT_CREDITCARD_PAYMENT_FAIL:
      return intentCreditcardPaymentFail(state, action);

    case actionTypes.FETCH_TRANSACTIONS_START:
      return fetchTransactionsStart(state, action);
    case actionTypes.FETCH_TRANSACTIONS_SUCCESS:
      return fetchTransactionsSuccess(state, action);
    case actionTypes.FETCH_TRANSACTIONS_FAIL:
      return fetchTransactionsFail(state, action);

    case actionTypes.FETCH_CRYPTO_CHARGES_START:
      return fetchCryptoChargesStart(state, action);
    case actionTypes.FETCH_CRYPTO_CHARGES_SUCCESS:
      return fetchCryptoChargesSuccess(state, action);
    case actionTypes.FETCH_CRYPTO_CHARGES_FAIL:
      return fetchCryptoChargesFail(state, action);

    case actionTypes.CLEAR_ALERT:
      return clearAlert(state);

    case actionTypes.LOGOUT:
      return resetState(state, action);

    default:
      return state;
  }
};

export default reducer;
