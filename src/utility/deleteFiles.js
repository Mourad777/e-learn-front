export const deleteFiles = async (fileUrls, token) => {

    const fixedUrls = (fileUrls || [])
      .filter((f) => typeof f === "string")
      .map((fileUrl) => fileUrl.replace(process.env.REACT_APP_AWS_URL, ""));
    if (!fileUrls || !(fileUrls.length > 0) || !(fixedUrls.length > 0)) {
      return;
    }
    const formData = new FormData();
    fixedUrls.forEach((url) => {
      formData.append("url", url);
    });

      const url = `${process.env.REACT_APP_SERVER_URL}delete-files`;
      fetch(url, {
        method: 'put',
        headers: new Headers({
          'Authorization': "Bearer " + token,
          // 'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: formData,
        keepalive: true,
      });  
}