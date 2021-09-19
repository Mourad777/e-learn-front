export const loginQuery = (authData,subscription) => {
  console.log('subscription',subscription)
  console.log('auth data: ',authData)
  const graphqlQuery = {
    query: `
            mutation UserLogin($email: String!, $password: String, $userType: String!) {
              userLogin(email: $email, password: $password, userType: $userType,notificationSubscription:${subscription}) {
                token
                userId
                expiresIn
                firstName
                lastName
                language
                profilePicture
                lastLogin
                refreshTokenExpiration
                admin
              }
            }
          `,
    variables: {
      email: authData.email,
      password: authData.password,
      userType: authData.type,
    },
  };
  return graphqlQuery;
};

export const fetchUserQuery = () => {
  const graphqlQuery = {
    query: `
            query User {
              user {
                _id
                dob
                firstName
                lastName
                language
                email
                profilePicture
                admin
                isPassword
                documents {
                  document
                  documentType
                }
              }
            }
          `,
  };
  return graphqlQuery;
};

export const signupQuery = ({
  formData,
  _id,
  subscription,
}) => {
  const graphqlQuery = {
    query: `
           mutation CreateAccount(
             $email: String!,
             $firstName: String!,
             $lastName: String!,
             $password: String!,
             $dob: String!,
             $language: String!,
             $id:ID!,
             $accountType:String!,
                  ) {
             createAccount(accountInput: {
               email: $email, 
               firstName: $firstName, 
               lastName: $lastName, 
               password: $password, 
               dob: $dob, 
               language: $language, 
               id:$id,
               accountType:$accountType,
               notificationSubscription:${subscription}
              }) {
               _id
               email
             }
           }
         `,
    variables: {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      language: formData.language,
      dob: formData.dob,
      langauge: formData.langauge,
      id:_id,
      accountType:formData.type,
    },
  };
  return graphqlQuery;
};

export const updateAccountQuery = ({ formData,profilePictureKey,profilePictureFile,formattedDocuments}) => {
  const graphqlQuery = {
    query: `
           mutation UpdateAccount(
             $email: String!, 
             $firstName: String!, 
             $lastName: String!, 
             $newPassword: String, 
             $currentPassword: String, 
             $dob: String!, 
             $language: String!, 
             $profilePicture: String,
             $accountType: String!
             ) {
             updateAccount(accountInput: {
               email: $email, 
               firstName: $firstName, 
               lastName: $lastName, 
               newPassword: $newPassword, 
               currentPassword: $currentPassword, 
               dob: $dob, 
               language: $language, 
               profilePicture: $profilePicture, 
               accountType: $accountType
               documents: [${formattedDocuments}]
              })
           }
         `,
    variables: {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      dob: formData.dob,
      language: formData.language,
      accountType:formData.accountType,
      profilePicture: profilePictureFile instanceof File ? profilePictureKey : profilePictureFile,
    },
  };
  return graphqlQuery;
};

export const verifyAccountQuery = (password, token) => {
  const graphqlQuery = {
    query: `
        mutation VerifyAccount($password: String!, $token: String!) {
          verifyAccount(password: $password, token: $token){
            token
            userId
            expiresIn
            firstName
            lastName
            language
            refreshTokenExpiration
            profilePicture
          }
        }
      `,
    variables: {
      password,
      token,
    },
  };
  return graphqlQuery;
};

export const resendVerificationEmailQuery = (email, accountType) => {
  const graphqlQuery = {
    query: `
        mutation ResendVerificationEmail($email: String!, $accountType: String!) {
          resendVerificationEmail(email:$email,accountType:$accountType)
        }
      `,
      variables: {
        email,
        accountType,
      },
  };
  return graphqlQuery;
};

export const passwordResetLinkQuery = (email, accountType) => {
  const graphqlQuery = {
    query: `
        mutation PasswordResetInitialize($email: String!, $accountType: String!) {
          passwordResetInitialize(passwordResetInitializeInput: {email: $email, accountType: $accountType}) {
            token
          }
        }
      `,
    variables: {
      email: email,
      accountType: accountType,
    },
  };
  return graphqlQuery;
};

export const changePasswordQuery = (authData, token, accountType) => {
  const graphqlQuery = {
    query: `
        mutation PasswordReset($password: String!, $confirmPassword: String!, $accountType: String!, $token: String!) {
          passwordReset(passwordResetInput: {password: $password, confirmPassword: $confirmPassword, accountType: $accountType, token: $token})
        }
      `,
    variables: {
      password: authData.password,
      confirmPassword: authData.confirmPassword,
      token: token,
      accountType: accountType,
    },
  };
  return graphqlQuery;
};

export const refreshTokenQuery = () => {
  const graphqlQuery = {
    query: `
        mutation refreshToken {
          refreshToken {
            token
            expiresIn
          }
        }
      `,
  };
  return graphqlQuery;
};