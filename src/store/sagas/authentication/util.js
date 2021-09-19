export const getStringifiedSubscription = (sub) => {
    if(!sub)return null;
    return `{
        endpoint:"${sub.endpoint}",
        expirationTime:${sub.expirationTime||null}
        keys:{
          p256dh:"${sub.keys.p256dh}",
          auth:"${sub.keys.auth}"
          }
        }`

}