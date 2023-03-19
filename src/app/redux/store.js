import { configureStore } from "@reduxjs/toolkit";

import cartDetailReducer from "./slices/cartDetailSlice";
import DesignSlice from "./slices/DesignSlice";


export const store = configureStore({
  reducer: {
    cartDetailReducer: cartDetailReducer,
    DesignReducer: DesignSlice,
  },
});
