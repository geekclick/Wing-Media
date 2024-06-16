import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatState } from "../../interfaces/storeInterface";
import { Chat, Message } from "../../interfaces/common";
import { getOrSaveFromLocal } from "../../helpers/helper";

const initialState: ChatState = {
  chats: [],
  messages: [],
  messageCount: getOrSaveFromLocal({
    key: "MESSAGE_COUNT",
    value: [],
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages?.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    pushMessageCount: (state, action: PayloadAction<{ chatId: string }>) => {
      const { chatId } = action.payload;

      const chatIndex = state.messageCount.findIndex(
        (chat) => chat.chatId === chatId
      );

      if (chatIndex !== -1) {
        state.messageCount[chatIndex].count += 1;
      } else {
        state.messageCount.push({ chatId, count: 1 });
      }
    },

    resetMessageCount: (state, action: PayloadAction<{ chatId: string }>) => {
      const { chatId } = action.payload;

      const chatIndex = state.messageCount.findIndex(
        (chat) => chat.chatId === chatId
      );

      if (chatIndex !== -1) {
        state.messageCount = state.messageCount.filter(
          (chat) => chat.chatId !== chatId
        );
      }
    },
  },
});

export const {
  setChats,
  addMessage,
  setMessages,
  pushMessageCount,
  resetMessageCount,
} = chatSlice.actions;

export default chatSlice.reducer;
