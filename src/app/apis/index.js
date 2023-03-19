import Axios from "../../axios";
import { errorHandler } from "../utils/ErrorHandler";

export const headers = {
  "content-type": "application/json",
};

export const get = async (endPoint) => {
  try {
    const result = await Axios.get(endPoint);
    return result;
  } catch (e) {
    throw errorHandler(e);
  }
};

export const post = async (endPoint, data) => {
  try {
    const result = await Axios.post(endPoint, data);
    return result;
  } catch (e) {
    throw errorHandler(e);
  }
};

export const patch = async (endPoint, data) => {
  try {
    const result = await Axios.patch(endPoint, data);
    return result;
  } catch (e) {
    throw errorHandler(e);
  }
};

export const deleted = async (endPoint) => {
  try {
    const result = await Axios.delete(endPoint);
    return result;
  } catch (e) {
    throw errorHandler(e);
  }
};
