import { get, post, deleted } from "../index.js";
import { CategoriesRoutes } from "./Categories.Routes.js";

export const CategoriesServices = {
  getCategories: async () => {
    let result = await get(CategoriesRoutes.getCategories);
    if (result.status === 200) return result.data;
    else throw result;
  },
  getProductByCategoryID: async (ID) => {
    let result = await get(CategoriesRoutes.getProductsByCategory + ID);
    if (result.status === 200) {
      return result.data;
    } else throw result;
  },
};
