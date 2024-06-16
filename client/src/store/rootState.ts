import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import postReducer from "./reducers/postSlice";
import commonReducer from "./reducers/commonSlice";
import userReducer from "./reducers/userSlice";
import chatReducer from "./reducers/chatSlice";
import storyReducer from "./reducers/storySlice";
import api from "./api/api";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  authSlice: authReducer,
  postSlice: postReducer,
  commonSlice: commonReducer,
  userSlice: userReducer,
  chatSlice: chatReducer,
  storySlice: storyReducer,
});

export default rootReducer;
