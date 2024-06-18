import { JSX } from "react/jsx-runtime";
import { useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";
import { useInitializeSocket, useSocket } from "../socket";

// store
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../interfaces/storeInterface";
import { setIsLoggedIn } from "../store/reducers/authSlice";
import { setIsLoading, setOnlineUsers } from "../store/reducers/commonSlice";
import { setPostList } from "../store/reducers/postSlice";
import {
  addMessage,
  pushMessageCount,
  setChats,
} from "../store/reducers/chatSlice";
import {
  incrementNotifications,
  setNotification,
  setNotificationCount,
  setUser,
} from "../store/reducers/userSlice";
import {
  useGetChatsQuery,
  useGetNotificationsQuery,
  useGetPostsQuery,
  useGetProfileQuery,
  useGetStoryQuery,
} from "../store/api/api";
import { generateAuthHeader, getOrSaveFromLocal } from "../helpers/helper";
import { setStories } from "../store/reducers/storySlice";
import { Message } from "../interfaces/common";
import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_POSTS,
} from "../constants/events";
import { SERVER_URL } from "../constants";

function AppLayout(WrappedComponent: JSX.ElementType) {
  return function NewAppComponent(props: JSX.IntrinsicAttributes) {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state: StoreState) => state.authSlice);
    const { messageCount } = useSelector(
      (state: StoreState) => state.chatSlice
    );
    const socket = useSocket();
    const connectSocket = useInitializeSocket();
    const profile = useGetProfileQuery();
    const posts = useGetPostsQuery();
    const notifications = useGetNotificationsQuery();
    const chats = useGetChatsQuery();
    const stories = useGetStoryQuery();
    const isAuthorized = useCallback(async () => {
      try {
        const headers = generateAuthHeader();
        const response = await axios.get(
          `${SERVER_URL}/api/auth/authenticate`,
          { headers }
        );
        if (response.data) {
          dispatch(setIsLoggedIn(true));
        } else {
          dispatch(setIsLoggedIn(false));
        }
      } catch (error) {
        dispatch(setIsLoggedIn(false));
        console.error("Authorization error:", error);
      } finally {
        dispatch(setIsLoading(false));
      }
    }, [dispatch]);

    const fetchData = useCallback(async () => {
      dispatch(setIsLoading(true));
      try {
        if (profile.data) dispatch(setUser(profile.data.data));
        if (posts.data) dispatch(setPostList(posts.data.data));
        if (notifications.data) {
          dispatch(setNotification(notifications.data.data));
          dispatch(setNotificationCount(notifications?.data?.data?.length));
        }
        if (chats.data) dispatch(setChats(chats.data.data));
        if (stories.data) dispatch(setStories(stories.data.data));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error in fetching data");
      } finally {
        dispatch(setIsLoading(false));
      }
    }, [
      dispatch,
      profile.data,
      posts.data,
      notifications.data,
      chats.data,
      stories.data,
    ]);

    const refetchData = useCallback(async () => {
      try {
        await profile.refetch();
        await posts.refetch();
        await notifications.refetch();
        await chats.refetch();
        await stories.refetch();
      } catch (error) {
        console.error("Error in refetching data:", error);
        toast.error("Error in refetching data");
      }
    }, [profile, posts, notifications, chats, stories]);

    const handleNewRequest = useCallback(() => {
      dispatch(incrementNotifications());
    }, [dispatch]);

    const handleAlert = useCallback((data: string) => {
      toast.success(data);
    }, []);

    const handleMessage = useCallback((data: Message) => {
      return dispatch(addMessage(data));
    }, []);

    const handleMessageAlert = useCallback((data: { chatId: string }) => {
      return dispatch(pushMessageCount(data));
    }, []);

    const handleRefetchPosts = useCallback(async () => {
      await posts.refetch();
      dispatch(setPostList(posts.data?.data));
    }, [posts, dispatch]);

    const setUserOnline = (data: string[]) => {
      dispatch(setOnlineUsers(data));
    };

    useEffect(() => {
      getOrSaveFromLocal({
        key: "MESSAGE_COUNT",
        value: messageCount,
        get: false,
      });
    }, [messageCount, dispatch]);

    useEffect(() => {
      isAuthorized();
    }, [isAuthorized]);

    useEffect(() => {
      if (isLoggedIn) {
        refetchData();
        fetchData();
        connectSocket();

        socket?.on(NEW_REQUEST, handleNewRequest);
        socket?.on(ALERT, handleAlert);
        socket?.on(NEW_MESSAGE, handleMessage);
        socket?.on(NEW_MESSAGE_ALERT, handleMessageAlert);
        socket?.on(REFETCH_POSTS, handleRefetchPosts);
        socket?.on(ONLINE_USERS, setUserOnline);

        return () => {
          socket?.off(NEW_MESSAGE, handleMessage);
          socket?.off(NEW_MESSAGE_ALERT, handleMessageAlert);
          socket?.off(NEW_REQUEST, handleNewRequest);
          socket?.off(ALERT, handleAlert);
          socket?.off(REFETCH_POSTS, handleRefetchPosts);
          socket?.off(ONLINE_USERS, setUserOnline);
        };
      }
    }, [isLoggedIn, fetchData, handleNewRequest, handleAlert, socket]);

    return (
      <div>
        <WrappedComponent {...props} />
        <Toaster />
      </div>
    );
  };
}

export default AppLayout;
