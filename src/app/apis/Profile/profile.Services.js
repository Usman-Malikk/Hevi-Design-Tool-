import { EightK } from "@mui/icons-material";
import { get, post } from "../index.js";
import { ProfileRoutes } from "./profile.Routes.js";

export const ProfileServices = {
  getUserProfileInfo: async () => {
    const result = await get(ProfileRoutes.getUserProfile);
    if (result.status === 200) return result.data;
    else throw result;
  },
  updateUserProfile: async (Data) => {
    const result = await post(ProfileRoutes.updateProfile, Data);
    if (result.status === 200) return result.data;
    else throw result;
  },
  getUserOrder: async () => {
    const result = await get(ProfileRoutes.getAllOrders);
    if (result.status === 200) return result.data;
    else throw result;
  },
  getOrderDetailInfo: async (ID) => {
    const result = await get(ProfileRoutes.getOrderDetail + ID);
    if (result.status === 200) {
      return result.data;
    } else throw result;
  },
};
