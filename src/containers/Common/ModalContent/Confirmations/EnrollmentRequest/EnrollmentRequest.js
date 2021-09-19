import React, { useState } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../../store/actions/index";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Syllabus from "../../CourseSyllabus/CourseSyllabus";
import { useTranslation } from "react-i18next";
import CheckoutForm from './CheckoutForm'
import Aux from "../../../../../hoc/Auxiliary/Auxiliary"
// import QRCode from "react-qr-code";
import moment from "moment";

const EnrollmentSummary = ({ userId, token, modalDocument: course, enroll, isDarkTheme, requestBitcoinAddress, configuration, transactions, cryptoCharges }) => {
  const { t } = useTranslation('common')
  const [confirmCheckbox, setConfirmCheckbox] = useState(false)

  const handleChange = (event) => {
    setConfirmCheckbox(event.target.checked);
  };

  const boldStyle = {
    fontWeight: "bold",
  };
  const boxStyle = {
    backgroundColor: isDarkTheme ? "" : "white",
    padding: 10,
    margin: "10px auto 10px auto",
  };
  const activeCryptoCharge = (transactions || []).find(ch => ch.status === 'pending' && ch.courseId === course._id && (parseInt(ch.expiration) > Date.now()));
  //only crypto charges can have a pending status since it takes time to verify the transaction on the blockchain
  const isPayed = (transactions || []).findIndex(ch => ch.courseId === course._id && ch.status === 'paid') > -1;
  let addressExpiration;
  if (activeCryptoCharge) {
    addressExpiration = moment(parseInt(activeCryptoCharge.expiration))
      .locale(localStorage.getItem("i18nextLng"))
      .format("dddd, MMMM DD YYYY, HH:mm");
  }
  return (
    <div>
      <div style={boxStyle}>
        <Typography paragraph variant="subtitle1" gutterBottom>
          {t("syllabus.youAreRequesting")}
          <span style={boldStyle}>{course.courseName}</span>
        </Typography>
      </div>
      <Syllabus isEnrollmentForm />
      {(course.cost && !isPayed) && (

        <div style={{ ...boxStyle, textAlign: 'center' }}>



          <div style={{ padding: 10 }}>
            <CheckoutForm studentId={userId} courseId={course._id} requestAgreed={confirmCheckbox} />
          </div>
          <Typography paragraph align="center" variant="subtitle1" gutterBottom>
            {t("syllabus.or")}
          </Typography>
          {!activeCryptoCharge && (
            <Button
              color="primary"
              onClick={() => {
                requestBitcoinAddress(course._id, token);
              }}
            >
              {t("syllabus.buttons.payWithBitcoin")}
            </Button>
          )}


          { activeCryptoCharge && (
            <div style={boxStyle}>
              <Typography align="center" paragraph variant="caption" gutterBottom>
                {t("syllabus.sendBitcoinToAddress", {
                  amount: activeCryptoCharge.amount,
                  address: activeCryptoCharge.address,
                })}
              </Typography>
              <Typography variant="caption" color="error" align="center" gutterBottom>{t("syllabus.addressExpiration", {
                expiration: addressExpiration,
              })}</Typography>
              {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <QRCode value={activeCryptoCharge.address} />
              </div> */}
            </div>
          )
          }
        </div>




      )}



      {
        (!course.cost || (course.cost && isPayed)) && (
          <Aux>
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmCheckbox}
                  onChange={handleChange}
                  value="checked"
                />
              }
              label={t("syllabus.agree")}
            />
            <Button
              disabled={!confirmCheckbox}
              // variant="outlined"
              color="primary"
              onClick={() => {
                enroll(userId, course._id, token);
              }}
            >
              {t("syllabus.buttons.submitRequest")}
            </Button>
          </Aux>
        )
      }
      {
        configuration.isApproveEnrollments && (
          <div style={boxStyle}>
            <Typography paragraph variant="caption" gutterBottom>
              {t("syllabus.accessWhenApproved")}
            </Typography>
          </div>
        )
      }
    </div>
  );

}

const mapDispatchToProps = (dispatch) => {
  return {
    enroll: (student, course, token) => {
      dispatch(actions.enrollRequestStart(student, course, token));
    },
    requestBitcoinAddress: (courseId, token) => {
      dispatch(actions.requestBitcoinAddressStart(courseId, token));
    },
  };
};

const mapStateToProps = (state) => {
  return {
    userId: state.authentication.userId,
    token: state.authentication.token,
    modalDocument: state.common.modalDocument,
    isDarkTheme: state.common.isDarkTheme,
    configuration: state.common.configuration,
    transactions: state.transactions.transactions,
    cryptoCharges: state.transactions.cryptoCharges,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnrollmentSummary);
