export const fetchInstructorsQuery = () => {
  const graphqlQuery = {
    query: `
               query FetchInstructors  {
                 instructors {
                   _id
                   firstName
                   lastName
                   email
                   dob
                   profilePicture
                   lastLogin
                   isAccountSuspended
                   isAccountApproved
                   documents {
                     document
                     documentType
                   }
                   coursesTeaching {
                     _id
                     courseName
                   }
                 }
               }
             `,
  };
  return graphqlQuery
}