import { get, post, deleted } from "../index.js";

import { ProductRoutes } from "./Products.Routes.js";

export const ProductServices = {
  getProductDetails: async (ID) => {
    let result = await get(ProductRoutes.getProductById + ID);
    if (result.status === 200) return result.data;
    else throw result;
  },
  getAllProducts: async (page) => {
    let result = await get(
      ProductRoutes.getAllProducts + `?limit=12&page=${page}`
    );
    if (result.status === 200) return result.data;
    else throw result;
  },
  getFilteredProduct: async (data, page) => {
    console.log(
      "🚀 ~ file: ProductsServices.js:19 ~ getFilteredProduct: ~ data",
      data,
      page
    );

    let result = await get(
      ProductRoutes.getProductByFilter + `?searchTerm=${data}&limit=10&page=1`
    );
    console.log(
      "🚀 ~ file: ProductsServices.js:23 ~ getFilteredProduct: ~ result",
      result
    );
    if (result.status === 200) return result.data;
    else throw result;
  },
};
