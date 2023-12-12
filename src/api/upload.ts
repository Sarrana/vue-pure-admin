import { http } from "@/utils/http";
import axios from "axios";
import { formatToken, getToken } from "@/utils/auth";
const backendBaseUrl = "/api";
export const uploadApi = {
  image: backendBaseUrl + "/upload/image",
  imageRaw: backendBaseUrl + "/upload/image/raw",
  chunk: backendBaseUrl + "/upload/chunk",
  merge: backendBaseUrl + "/upload/merge"
};

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: formatToken(getToken().token)
  }
};

export const uploadBigFile = {
  chunk(formData) {
    // return http.post(uploadApi.chunk, formData);
    // { "Content-Type": "multipart/form-data" }
    return axios.post(uploadApi.chunk, formData, config);
    // return http.request("post", uploadApi.chunk, formData, config);
    // return axios.post(uploadApi.chunk, formData, config);
    /* return http.post(uploadApi.chunk, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }); */
  },
  merge(data) {
    return http.request("get", uploadApi.merge, { params: data });
  }
};
