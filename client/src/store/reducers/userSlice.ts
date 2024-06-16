import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Notification, User } from "../../interfaces/common";
import { UserState } from "../../interfaces/storeInterface";

const initialState: UserState = {
  user: {
    _id: "",
    username: "",
    name: "",
    email: "",
    password: "",
    bio: "",
    avatar: { public_id: "", url: "" },
  },
  users: [],
  notifications: [],
  notificationCount: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setNotification: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    incrementNotifications: (state) => {
      state.notificationCount += 1;
    },
    decrementNotifications: (state) => {
      state.notificationCount -= 1;
    },
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.notificationCount = action.payload;
    },
  },
});

export const {
  setUser,
  setUsers,
  setNotification,
  incrementNotifications,
  decrementNotifications,
  setNotificationCount,
} = userSlice.actions;

export default userSlice.reducer;
