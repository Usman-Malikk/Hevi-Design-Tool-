import { get, post, patch, deleted } from "../index";
import { AuthRoutes } from "./Auth.Routes";

export const Services = {
  login: async (obj) => {
    let result = await post(AuthRoutes.login, obj, {});
    if (result.status === 200) return result.data;
    else throw result;
  },

  logout: async (token) => {
    let result = await post(AuthRoutes.logout, {}, token);
    if (result.status === 200) return result.data;
    else throw result;
  },
  Register: async (Data) => {
    let result = await post(AuthRoutes.register, Data, {});
    if (result.status === 200) return result.data;
    else throw result;
  },
  updatePassword: async (Data) => {
    const result = await post(AuthRoutes.forgotPassword, Data);
    if (result.status === 200) return result.data;
    else throw result;
  },
};
