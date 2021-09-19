export const activateAccountQuery = (user) => {
    const graphqlQuery = {
        query: `mutation ActivateAccount($userId: ID!)  {
                   activateAccount(userId: $userId) 
                 }
               `,
        variables: {
            userId: user,
        },
    };
    return graphqlQuery
}

export const suspendAccountQuery = (user,reason) => {
    const graphqlQuery = {
        query: `mutation SuspendAccount($userId: ID!,$reason: String)  {
                   suspendAccount(userId: $userId,reason:$reason) 
                 }
               `,
        variables: {
            userId: user,
            reason,
        },
    };
    return graphqlQuery
}