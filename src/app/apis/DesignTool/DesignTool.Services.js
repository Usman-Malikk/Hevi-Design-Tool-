import { post, get } from "../index.js";
import { DesignToolRoutes } from "./DesignTool.Routes.js";

export const DesignToolServices = {
  getToolMainCategory: async () => {
    const result = await get(DesignToolRoutes.getToolMainCategory);
    if (result.status === 200) return result.data;
    else throw result;
  },
  getSubCategory: async (id) => {
    const result = await get(DesignToolRoutes.getSubCategoryByID + id);
    if (result.status === 200) return result.data;
    else throw result;
  },
  getCustomiseDesign: async (Id, subID) => {
    const result = await get(
      DesignToolRoutes.getCustomoiseDesignById + Id + `/${subID}`
    );
    if (result.status === 200) return result.data;
    else throw result;
  },
  getAllFitType: async () => {
    const result = await get(DesignToolRoutes.getAllSizes);
    if (result.status === 200) return result.data;
    else throw result;
  },
  getDesignBySizes: async (id) => {
    const result = await get(DesignToolRoutes.getDesignBySize+id);
    if (result.status === 200) return result.data;
    else throw result;
  },
};
