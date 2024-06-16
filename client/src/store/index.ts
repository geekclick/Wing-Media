import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../store/rootState";
import api from "./api/api";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export { store };
