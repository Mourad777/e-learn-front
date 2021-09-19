import { urlKeyConverter } from "./urlKeyConverter";
import { uploadFile } from "./uploadFile";

export const uploadMultipleFiles = async (files, exclusions, path, token) => {
  const keys = await Promise.all(
    files.map(async (file) => {
      if (!exclusions[index]) return null;
      if (file instanceof File) {
        const uploadConfig = await uploadFile(file, path, token);
        return uploadConfig.data.key;
      }
      return urlKeyConverter(file);
    })
  );
  return keys;
};