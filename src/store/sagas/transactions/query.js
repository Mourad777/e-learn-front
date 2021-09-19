export const requestBitcoinAddressQuery = (courseId) => {
  const graphqlQuery = {
    query: `
        mutation RequestBitcoinAddress(
          $courseId: ID!,
          )  {       
            requestBitcoinAddress(
            courseId:$courseId,
            ) {
              currency
              amount
              address
              expiration
            }
        }
      `,
    variables: {
      courseId,
    },
  };
  return graphqlQuery;
};

export const intentCreditcardPaymentQuery = (courseId,paymentMethodId,paymentIntentId) => {
  const graphqlQuery = {
    query: `
        mutation IntentCreditcardPayment(
          $courseId: ID!, $paymentMethodId: String, $paymentIntentId: String,
          )  {       
            intentCreditcardPayment(
            courseId:$courseId,
            paymentMethodId:$paymentMethodId,
            paymentIntentId:$paymentIntentId,
            ) {
              success
            }
        }
      `,
    variables: {
      courseId,
      paymentMethodId,
      paymentIntentId,
    },
  };
  return graphqlQuery;
};

export const fetchTransactionsQuery = () => {
  const graphqlQuery = {
    query: `
        query Transactions {       
            transactions {
              userId
              paymentType
              courseId
              amount
              currency
              isSuccess
              isRefund
              error
              status
              coinbaseChargeId
              expiration
              address
            }
        }
      `
  };
  return graphqlQuery;
};

export const fetchCryptoChargesQuery = () => {
  const graphqlQuery = {
    query: `
        query CryptoCharges {       
            cryptoCharges {
              userId
              courseId
              amount
              currency
              address
              expiration
            }
        }
      `
  };
  return graphqlQuery;
};

