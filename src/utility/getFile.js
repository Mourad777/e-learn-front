import axios from 'axios'

export const b64toBlob = (data, fileType) => {
    // return
    if(!data)return
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  };

export const getFile = async (key, fileType, token) => {
        let imageResponse;
        try {
          const fileInfo = new FormData();
          fileInfo.append("key", key);
          imageResponse = await axios({
            url: `${process.env.REACT_APP_SERVER_URL}get-file`,
            method: "PUT",
            headers: {
              Authorization: "Bearer " + token,
            },
            data: fileInfo,
          });
        } catch (err) {
          console.log("getting file failed: ", err);
        }
        return imageResponse.data
};
  
  