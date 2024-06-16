import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Story } from "../../interfaces/common";
import { StoryState } from "../../interfaces/storeInterface";

const initialState: StoryState = {
  stories: [],
};

const postSlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setStories: (state, action: PayloadAction<Story[]>) => {
      state.stories = action.payload;
    },
  },
});

export const { setStories } = postSlice.actions;

export default postSlice.reducer;
