import { takeLatest, call, fork, put, delay } from "redux-saga/effects";
import axiosGraphql from "../../actions/axios-base";
import * as actions from "../../actions/index";
import * as actionTypes from "../../actions/actionTypes";
import i18n from "../../../i18n/index";
import { requestBitcoinAddressQuery, intentCreditcardPaymentQuery, fetchTransactionsQuery, fetchCryptoChargesQuery } from "./query";

function* intentCreditcardPayment({ payload: { token,studentId, courseId, paymentMethodId,isApproveEnrollments, paymentIntentId, history } }) {
  console.log('saga intent payment: ', courseId)
  const graphqlQuery = intentCreditcardPaymentQuery(courseId, paymentMethodId, paymentIntentId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Intent credit card payment response: ", response);
    if (response.data.errors) {
      throw new Error("Failed credit card payment!");
    }
    const intentCreditcardPayment = response.data.data.intentCreditcardPayment;
    console.log('intent response', intentCreditcardPayment);
    yield put(actions.intentCreditcardPaymentSuccess());
    yield put(actions.closeModal());
    if(intentCreditcardPayment.success === true) {
      if(isApproveEnrollments) {
        yield put(actions.enrollRequestStart(studentId, courseId, token));
      } else {
        const isAutoEnroll = true;
        yield put(actions.enrollCourseStart(studentId, courseId, token, history, isAutoEnroll));
      }
    }
    

  

  } catch (e) {
    console.log("Failed credit card payment", e);
    const failMessage = i18n.t("alerts.transactions.intentCreditcardPaymentFail")
    yield put(actions.intentCreditcardPaymentFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* requestBitcoinAddress({ payload: { token, courseId } }) {

  const graphqlQuery = requestBitcoinAddressQuery(courseId);
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Request bitcoin address response: ", response);
    const address = response.data.data.address;
    yield put(actions.requestBitcoinAddressSuccess(address));
    yield put(actions.fetchTransactionsStart(token));
  } catch (e) {
    console.log("Failed to request bitcoin address", e);
    const failMessage = i18n.t("alerts.transactions.bitcoinAddressFail")
    yield put(actions.requestBitcoinAddressFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* fetchCryptoCharges({ payload: { token } }) {

  const graphqlQuery = fetchCryptoChargesQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Fetch crypto charges response: ", response);
    const cryptoCharges = response.data.data.cryptoCharges;
    yield put(actions.fetchCryptoChargesSuccess(cryptoCharges));
    // yield put(actions.fetchCoursesStart(token, 'noSpinner'));
  } catch (e) {
    console.log("Failed to fetch crypto charges", e);
    const failMessage = i18n.t("alerts.lesson.fetchCryptoChargesFail")
    yield put(actions.fetchCryptoChargesFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}

function* fetchTransactions({ payload: { token } }) {

  const graphqlQuery = fetchTransactionsQuery();
  try {
    const response = yield call(axiosGraphql, graphqlQuery, token);
    console.log("Fetch transactions response: ", response);
    const transactions = response.data.data.transactions;
    yield put(actions.fetchTransactionsSuccess(transactions));
    // yield put(actions.fetchCoursesStart(token, 'noSpinner'));
  } catch (e) {
    console.log("Failed tofetch transactions", e);
    const failMessage = i18n.t("alerts.lesson.fetchTransactionsFail")
    yield put(actions.fetchTransactionsFail(failMessage));
    yield delay(3000);
    yield put(actions.clearAlert());
  }
}



function* watchIntentCreditcardPayment() {
  yield takeLatest(actionTypes.INTENT_CREDITCARD_PAYMENT_START, intentCreditcardPayment);
}

function* watchRequestBitcoinAddress() {
  yield takeLatest(actionTypes.REQUEST_BITCOIN_ADDRESS_START, requestBitcoinAddress);
}

function* watchFetchTransactions() {
  yield takeLatest(actionTypes.FETCH_TRANSACTIONS_START, fetchTransactions);
}

function* watchFetchCryptoCharges() {
  yield takeLatest(actionTypes.FETCH_CRYPTO_CHARGES_START, fetchCryptoCharges);
}

const transactionsSaga = [fork(watchIntentCreditcardPayment), fork(watchRequestBitcoinAddress), fork(watchFetchTransactions), fork(watchFetchCryptoCharges)];

export default transactionsSaga;
