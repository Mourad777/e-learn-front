export const getKeyFromAWSUrl = (url) => {
  const key = ((url || "").match(
    new RegExp(process.env.REACT_APP_AWS_URL + "(.*)" + "\\?X-Amz")
  ) || [])[1];
  return key;
};
