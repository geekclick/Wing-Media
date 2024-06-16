import { Chat, Post, User, Notification, Story, Message } from "./common";

export interface StoreState {
  authSlice: AuthState;
  postSlice: PostState;
  commonSlice: CommonState;
  userSlice: UserState;
  chatSlice: ChatState;
  storySlice: StoryState;
}

export interface ChatState {
  chats: Chat[];
  messages: Message[];
  messageCount: { chatId: string; count: number }[];
}

export interface UserState {
  user: User;
  users: User[];
  notifications: Notification[];
  notificationCount: number;
}

export interface PostState {
  posts: Post[];
}

export interface StoryState {
  stories: Story[];
}

export interface AuthState {
  isLoggedIn: boolean;
}

export interface CommonState {
  isLoading: boolean;
  captionStyle: CaptionStyle;
  previousRoute: string;
  isOnline: string[];
}

export interface CaptionStyle {
  position: { x: number; y: number };
  textColor: string;
}
