import { PayloadAction, createSlice } from "@reduxjs/toolkit";
   
interface State {
  isLoggedIn: boolean;
}

const initialState: State = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setIsLoggedIn } = authSlice.actions;

export default authSlice.reducer;
