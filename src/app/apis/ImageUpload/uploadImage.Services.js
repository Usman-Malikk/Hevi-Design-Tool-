import { get, post } from "../index.js";
import { UploadImageRoutes } from "./uploadImage.Routes.js";

export const imageUpload = {
  UploadImage: async (Data) => {
    const result = await post(UploadImageRoutes.uploadImage, Data);
    if (result.status === 200) return result.data;
    else throw result;
  },
};
