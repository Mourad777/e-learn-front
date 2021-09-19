import React, { useEffect, useState } from "react"
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { connect } from "react-redux";
import * as actions from "../../../../../store/actions/index";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

const token = localStorage.getItem('token');

const CheckoutForm = ({ isDarkTheme, courseId, stripeClientSecret, studentId, loading, intentPayment, configuration }) => {

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()
  const { t } = useTranslation("common")
  const isApproveEnrollment = configuration.isApproveEnrollments;

  useEffect(() => {
    if (stripeClientSecret) {
      const intentPayment = async () => {
        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          // billing_details:{
          //   name:'',
          //   phone:'',
          //   address:'',
          // }
        });

        console.log('error: ', error)
        if (error) {
          setErrorMessage(error.message)
        }

        if (paymentMethod) {
          const confirmCardPayment = await stripe.confirmCardPayment(stripeClientSecret, {
            payment_method: paymentMethod.id,
          });
          setErrorMessage(null);
          console.log('confirmCardPayment', confirmCardPayment)
          if (error) {
            console.log('[error]', error);
          } else {
            setErrorMessage(null);
            console.log('[PaymentMethod]', paymentMethod);
          }
        }
      }
      intentPayment();
    }
  }, [stripeClientSecret])

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();


    const cardElement = elements.getElement(CardElement);

    stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      // billing_details: {
      //   // Include any additional collected billing details.
      //   name: 'Jenny Rosen',
      // },
    }).then(result => {
      if (result.paymentMethod) {
        const paymentMethodId = result.paymentMethod.id;
        console.log('payment method id: ', result.paymentMethod.id)
        const paymentIntentId = '';
        
        intentPayment(studentId, courseId, paymentMethodId, paymentIntentId, isApproveEnrollment, token, history)
      }
      if(result.error){
        setErrorMessage(result.error.message)
      }

    });



    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <CardElement options={

        {
          style: isDarkTheme ? {
            base: {
              color: "#fff",
              "::placeholder": {
                color: "#b2b2b2"
              }
            },
            // invalid: {
            //   color:"#FFC7EE"
            // }

          } : {}
        }} />
      <Typography variant="caption" color="error" align="center">{errorMessage}</Typography>
      <button style={{
        color: 'white',
        border: 0,
        height: 48,
        padding: '0 30px',
        borderRadius: 3,
        backgroundColor:!(!stripe || errorMessage) ? "#4caf50" : loading ? "#b2b2b2" : '#c62828',
        cursor: loading || !stripe ? "default" : 'pointer',
        width: '100%',
        marginTop: '15px'
      }}
        disabled={loading || !stripe}
        type="submit"
      >
        {isApproveEnrollment ? t("confirmations.enrollCourse.payAndRequest") : t("confirmations.enrollCourse.pay")}
      </button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    intentPayment: (studentId, courseId, paymentMethodId, paymentIntentId, isApproveEnrollment, token, history) => {
      dispatch(actions.intentCreditcardPaymentStart(studentId, courseId, paymentMethodId, paymentIntentId, isApproveEnrollment, token, history))
    },
  }
}


const mapStateToProps = (state) => {
  return {
    isDarkTheme: state.common.isDarkTheme,
    configuration: state.common.configuration,
    stripeClientSecret: state.transactions.stripeClientSecret,
    loading: state.transactions.loading,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);