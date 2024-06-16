import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CaptionStyle, CommonState } from "../../interfaces/storeInterface";
import { getOrSaveFromLocal } from "../../helpers/helper";

const initialState: CommonState = {
  isLoading: false,
  captionStyle: getOrSaveFromLocal({
    key: "CAPTION_STYLE",
    value: {},
    get: true,
  }) || {
    position: { x: 0, y: 0 },
    textColor: "",
  },
  previousRoute: "/",
  isOnline: [],
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCaptionStyle: (state, action: PayloadAction<CaptionStyle>) => {
      state.captionStyle = action.payload;
    },

    removeCaptionStyle: (state) => {
      state.captionStyle = { position: { x: 0, y: 0 }, textColor: "" };
    },

    setRoute: (state, action: PayloadAction<string>) => {
      state.previousRoute = action.payload;
    },

    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.isOnline = action.payload;
    },
  },
});

export const { setIsLoading, setRoute, setOnlineUsers } = commonSlice.actions;

export default commonSlice.reducer;
