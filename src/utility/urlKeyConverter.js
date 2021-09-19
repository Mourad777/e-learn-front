export const urlKeyConverter = (url) => {
  //the aws object key is part of the presigned url
  //this function extracts the key
    if(!url || typeof url !== "string") return null
    if(!url.includes(process.env.REACT_APP_AWS_URL)) return url
    const key = url.match(
        new RegExp(process.env.REACT_APP_AWS_URL + "(.*)" + "\\?X-Amz")
      )[1];
    return key
}