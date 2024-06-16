import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "../../constants";

export interface RequestResponse {
  status: number;
  message: string;
  data: any;
}

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${SERVER_URL}/api` }),
  tagTypes: ["User", "Post", "Chat", "Auth", "Story"],
  endpoints: (builder) => ({
    getProfile: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/users/me",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    updateProfile: builder.mutation({
      query: ({ data }) => ({
        url: "/users/user/updateProfile",
        credentials: "include",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteProfile: builder.mutation({
      query: (data) => ({
        url: "/users/user/",
        credentials: "include",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    searchUser: builder.query({
      query: (query) => ({
        url: `/users/search?q=${query}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    getNotifications: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/users/notifications",
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    manageRequest: builder.mutation({
      query: (data) => ({
        url: "/users/acceptrequest",
        credentials: "include",
        method: "POST",
        body: data,
      }),
    }),

    sendRequest: builder.mutation({
      query: (data) => ({
        url: "/users/sendrequest",
        credentials: "include",
        method: "POST",
        body: data,
      }),
    }),

    getUser: builder.query<RequestResponse, string | undefined>({
      query: (userId) => ({
        url: `/users/user/${userId}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    getPosts: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/posts",
        credentials: "include",
      }),
      providesTags: ["Post"],
    }),

    newPost: builder.mutation({
      query: ({ data }) => ({
        url: "/posts",
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    deletePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/posts/post/${postId}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    addLike: builder.mutation({
      query: (data) => ({
        url: `/posts/post/like`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    removeLike: builder.mutation({
      query: (data) => ({
        url: `/posts/post/unlike`,
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    addComment: builder.mutation({
      query: (data) => ({
        url: `/posts/comment/${data.postId}`,
        credentials: "include",
        method: "POST",
        body: data.body,
      }),
      invalidatesTags: ["Post"],
    }),

    deleteComment: builder.mutation({
      query: (data) => ({
        url: `/posts/comment/${data.postId}`,
        credentials: "include",
        method: "DELETE",
        body: data.body,
      }),
      invalidatesTags: ["Post"],
    }),

    getChats: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/chats",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    getMessages: builder.query<RequestResponse, void | string>({
      query: (chatId) => ({
        url: `/chats/${chatId}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    createChat: builder.mutation({
      query: ({ data }) => ({
        url: "/chats",
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteMessage: builder.mutation({
      query: (data) => ({
        url: `/chats/chat/${data.id}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    clearMessages: builder.mutation({
      query: (data) => ({
        url: `/chats/chat?chatId=${data.id}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: (data) => ({
        url: `/chats/${data.id}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    getFriends: builder.query<RequestResponse, void | string>({
      query: () => ({
        url: `/users/friends`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    getStory: builder.query<RequestResponse, void>({
      query: () => ({
        url: `/stories/`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    addStory: builder.mutation({
      query: ({ data }) => ({
        url: "/stories",
        credentials: "include",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Story"],
    }),

    deleteStory: builder.mutation({
      query: ({ data }) => ({
        url: `/stories/${data}`,
        credentials: "include",
        method: "DELETE",
      }),
      invalidatesTags: ["Story"],
    }),
  }),
});
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useSearchUserQuery,
  useGetNotificationsQuery,
  useManageRequestMutation,
  useGetUserQuery,
  useGetPostsQuery,
  useNewPostMutation,
  useDeletePostMutation,
  useAddLikeMutation,
  useRemoveLikeMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetChatsQuery,
  useGetMessagesQuery,
  useSendRequestMutation,
  useGetFriendsQuery,
  useClearMessagesMutation,
  useDeleteMessageMutation,
  useDeleteChatMutation,
  useGetStoryQuery,
  useAddStoryMutation,
  useDeleteStoryMutation,
  useCreateChatMutation,
} = api;

export default api;
