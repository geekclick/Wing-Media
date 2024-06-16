import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Post } from "../../interfaces/common";
import { PostState } from "../../interfaces/storeInterface";

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostList: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
  },
});

export const { setPostList } = postSlice.actions;

export default postSlice.reducer;
