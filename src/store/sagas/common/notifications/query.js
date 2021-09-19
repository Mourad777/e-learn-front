export const notificationsQuery = () => {
    const graphqlQuery = {
        query: `
                  query FetchNotifications  {
                    notifications {
                      _id
                      content
                      toSpecificUser
                      toUserType
                      fromUser
                      senderFirstName
                      senderLastName
                      avatar
                      documentType
                      documentId
                      course
                      seen
                      message
                    }
                  }
                `,
      };
      return graphqlQuery
}

export const markAsSeenQuery = (notificationId) => {
  const graphqlQuery = {
    query: `
        mutation MarkAsSeen(
          $notificationId: ID!, 
          )  {       
          markAsSeen(
            notificationId:$notificationId,
            )
        }
      `,
      variables: {
        notificationId,
      },
  };
  return graphqlQuery;
};
