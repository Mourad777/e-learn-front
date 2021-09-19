import axios from "axios";
import { v1 } from "uuid";

export const getKey = (file, path) => {
  const filename = (file || {}).name || "";
  const fileExtension =
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename;
  const key = `${path}/${v1() + "." + fileExtension}`;
  return key;
};

export const uploadFile = async (file, key, token = "",fileType='NA') => {
  const fileInfo = new FormData();
  fileInfo.append("key", key);
  fileInfo.append("fileType", fileType);//s3 object tag
  const uploadConfig = await axios({
    url: `${process.env.REACT_APP_SERVER_URL}upload`,
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: fileInfo,
  });
  console.log("Get pre-signed url response: ", uploadConfig);
  try {
    let form = new FormData();
    Object.keys(uploadConfig.data.presignedUrl.fields).forEach((key) => {
      form.append(key, uploadConfig.data.presignedUrl.fields[key]);
    });

    form.append("file", file);

    const response = await axios.post(
      uploadConfig.data.presignedUrl.url,
      form,
    );

    console.log("Upload file response: ", response);
  } catch (err) {
    console.log("Upload file error: ", err);
  }
  return uploadConfig;
};
