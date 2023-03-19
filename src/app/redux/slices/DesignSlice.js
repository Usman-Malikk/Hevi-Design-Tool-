const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  DesignData: [],
  TextData: [],
  customiseDesignData: [],
  AllData: [],
  TotalPrice: 0,
};

const DesignSlice = createSlice({
  name: "DesignReducer",
  initialState,
  reducers: {
    // Design Upload Section

    AddDesignData: (state, action) => {
      state.DesignData.push(action.payload);
    },
    removeDesign: (state, action) => {
      let existingData = JSON.parse(JSON.stringify(state.DesignData));
      const Index = existingData.findIndex((e) => {
        return e.uniqueID === action.payload.uniqueID;
      });
      existingData.splice(Index, 1);
      state.DesignData = existingData;
    },

    updateDesign: (state, action) => {
      const existingData = JSON.parse(JSON.stringify(state.DesignData));
      const IndexOfitem = existingData.findIndex((e) => {
        return e.uniqueID === action.payload.uniqueID;
      });
      // Remove Item from Index
      existingData.splice(IndexOfitem, 1);
      // Add Item on specific index
      existingData.splice(IndexOfitem, 0, action.payload);
      state.DesignData = existingData;
    },

    // Text Data

    AddTextData: (state, action) => {
      state.TextData.push(action.payload);
    },
    updateTextData: (state, action) => {
      const existingData = JSON.parse(JSON.stringify(state.TextData));
      const IndexOfitem = existingData.findIndex((e) => {
        return e.uniqueID === action.payload.uniqueID;
      });
      // Remove Item from Index
      existingData.splice(IndexOfitem, 1);
      // Add Item on specific index
      existingData.splice(IndexOfitem, 0, action.payload);
      state.TextData = existingData;
    },
    removeTextData: (state, action) => {
      let existingData = JSON.parse(JSON.stringify(state.TextData));
      const Index = existingData.findIndex((e) => {
        return e.uniqueID === action.payload.uniqueID;
      });
      existingData.splice(Index, 1);
      state.TextData = existingData;
    },

    // CustomiseData
    AddCustomiseData: (state, action) => {
      state.customiseDesignData.push(action.payload);
    },
    removeCustomDesign: (state, action) => {
      console.log("🚀 ~ file: DesignSlice.js:70 ~ action:", action.payload);
      let existingData = JSON.parse(JSON.stringify(state.customiseDesignData));
      const Index = existingData.findIndex((e) => {
        return e.uniqueID === action.payload.uniqueID;
      });
      existingData.splice(Index, 1);
      state.customiseDesignData = existingData;
    },

    updateCustomDesign: (state, action) => {
      console.log("🚀 ~ file: DesignSlice.js:109 ~ action:", action.payload);
      const existingData = JSON.parse(
        JSON.stringify(state.customiseDesignData)
      );
      const IndexOfitem = existingData.findIndex((e) => {
        return e.uniqueID === action.payload.uniqueID;
      });
      // Remove Item from Index
      existingData.splice(IndexOfitem, 1);
      // Add Item on specific index
      existingData.splice(IndexOfitem, 0, action.payload);
      state.customiseDesignData = existingData;
    },
    // Price Calculation
    caluclatePrice: (state, action) => {
      // For text Design
      let Price = 0;
      // For Design
      state.DesignData.forEach((item) => {
        Price += Number(item.price);
      });
      // For Text Data
      state.TextData.forEach((item) => {
        Price += Number(item.price);
      });

      state.TotalPrice = Price;
      console.log("Total Price ", state.TotalPrice);
    },
    removeAll: (state, action) => {
      state.DesignData = [];
      state.TextData = [];
      state.AllData = [];
      state.customiseDesignData = [];
      state.TotalPrice = 0;
    },

    AddAllData: (state, action) => {
      state.AllData = [];
      state.AllData.push(action.payload);
    },

    //

    // Text Upload Section
  },
});

export const {
  AddAllData,
  updateCustomDesign,
  removeCustomDesign,
  AddCustomiseData,
  removeAll,
  caluclatePrice,
  AddDesignData,
  removeDesign,
  updateDesign,
  AddTextData,
  updateTextData,
  removeTextData,
} = DesignSlice.actions;

export default DesignSlice.reducer;
