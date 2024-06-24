import { ReactNode } from "react";

export interface ChildProps {
  children?: ReactNode;
  login?: boolean;
  show?: boolean;
}

export interface User {
  avatar?: {
    public_id: string;
    url: string;
  };
  _id?: string;
  username?: string;
  name?: string;
  email: string;
  password: string;
  bio?: string;
  posts?: Post[];
  followers?: string[];
  following?: string[];
  created_at?: string | number | Date;
}

export interface Comment {
  _id?: string;
  user: { username: string; avatar: { public_id: string; url: string } };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Like {
  user_id: string;
  created_at: string;
}

export interface Post {
  _id?: string;
  user_id?: string;
  content: string;
  postImage: { publicId: string; url: string };
  created_at?: string;
  updated_at?: string;
  comments?: Comment[];
  likes?: string[];
}

export interface Chat {
  content: string;
  sender: "user" | "other" | undefined;
  _id?: string;
  groupChat: boolean;
  name: string;
  members: string[];
  createdAt?: string;
}

export interface Notification {
  _id?: string;
  sender: {
    _id?: string;
    name: string;
    avatar: string;
  };
}

export interface Message {
  createdAt: string;
  _id: string;
  sender?: string;
  content?: string;
  chatId: string;
  message: {
    chat: string;
    content: string;
    createdAt: string;
    sender: { _id: string };
    _id: string;
  };
}

export interface Story {
  _id: string;
  user_id: string;
  caption: string;
  story: { publicId: string; url: string };
  expirationDate: string;
}
