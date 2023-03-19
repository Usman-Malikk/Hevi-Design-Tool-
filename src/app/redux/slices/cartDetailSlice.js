import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  cartValue: [],
  stripe_keyid: "",
  // productQuantity:1,
};

export const cartDetailSlice = createSlice({
  name: "cartDetailReducer",
  initialState,
  reducers: {
    cartData: (state, action) => {
      const itemInCart = state?.cartValue?.filter((item) => {
        return item.productId === action.payload.productId;
      });
      const filteredData = itemInCart.find((item) => {
        if (
          item.color === action.payload.color &&
          item?.size === action.payload.size
        ) {
          return item;
        }
      });

      if (filteredData) {
        filteredData.quantity += action.payload.quantity;
      } else {
        state.cartValue = [...state.cartValue, action.payload];
      }
    },
    incrementQuantity: (state, action) => {
      const { id } = action.payload;
      const item = state.cartValue.find((item) => item.productId === id);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const { id } = action.payload;
      const item = state.cartValue.find((item) => item.productId === id);
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    removeCartDataItem: (state, action) => {
      const removeItem = state.cartValue.findIndex(
        (Item) =>
          Item.productId === action.payload.productId &&
          Item.color === action.payload.color
      );
      state.cartValue.splice(removeItem, 1);

      // state.cartValue = removeItem;
    },
    removeAllData: (state, action) => {
      const removeItem = [];
      state.cartValue = removeItem;
    },
    Stripekey: (state, action) => {
      state.stripe_keyid = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  Stripekey,
  cartData,
  incrementQuantity,
  decrementQuantity,
  removeCartDataItem,
  removeAllData,
} = cartDetailSlice.actions;

export default cartDetailSlice.reducer;
