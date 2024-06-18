import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_URL } from "../../constants";

export interface RequestResponse {
  status: number;
  message: string;
  data: any;
}

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_URL}/api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Post", "Chat", "Auth", "Story"],
  endpoints: (builder) => ({
    getProfile: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/users/me",
      }),
      keepUnusedDataFor: 0,
    }),

    updateProfile: builder.mutation({
      query: ({ data }) => ({
        url: "/users/user/updateProfile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteProfile: builder.mutation({
      query: (data) => ({
        url: "/users/user/",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    searchUser: builder.query({
      query: (query) => ({
        url: `/users/search?q=${query}`,
      }),
      providesTags: ["User"],
    }),

    getNotifications: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/users/notifications",
      }),
      keepUnusedDataFor: 0,
    }),

    manageRequest: builder.mutation({
      query: (data) => ({
        url: "/users/acceptrequest",
        method: "POST",
        body: data,
      }),
    }),

    sendRequest: builder.mutation({
      query: (data) => ({
        url: "/users/sendrequest",
        method: "POST",
        body: data,
      }),
    }),

    getUser: builder.query<RequestResponse, string | undefined>({
      query: (userId) => ({
        url: `/users/user/${userId}`,
      }),
      providesTags: ["User"],
    }),

    getPosts: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/posts",
      }),
      providesTags: ["Post"],
    }),

    newPost: builder.mutation({
      query: ({ data }) => ({
        url: "/posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    deletePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/posts/post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    addLike: builder.mutation({
      query: (data) => ({
        url: `/posts/post/like`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    removeLike: builder.mutation({
      query: (data) => ({
        url: `/posts/post/unlike`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

    addComment: builder.mutation({
      query: (data) => ({
        url: `/posts/comment/${data.postId}`,
        method: "POST",
        body: data.body,
      }),
      invalidatesTags: ["Post"],
    }),

    deleteComment: builder.mutation({
      query: (data) => ({
        url: `/posts/comment/${data.postId}`,
        method: "DELETE",
        body: data.body,
      }),
      invalidatesTags: ["Post"],
    }),

    getChats: builder.query<RequestResponse, void>({
      query: () => ({
        url: "/chats",
      }),
      providesTags: ["Chat"],
    }),

    getMessages: builder.query<RequestResponse, void | string>({
      query: (chatId) => ({
        url: `/chats/${chatId}`,
      }),
      keepUnusedDataFor: 0,
    }),

    createChat: builder.mutation({
      query: ({ data }) => ({
        url: "/chats",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteMessage: builder.mutation({
      query: (data) => ({
        url: `/chats/chat/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    clearMessages: builder.mutation({
      query: (data) => ({
        url: `/chats/chat?chatId=${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: (data) => ({
        url: `/chats/${data.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    getFriends: builder.query<RequestResponse, void | string>({
      query: () => ({
        url: `/users/friends`,
      }),
      keepUnusedDataFor: 0,
    }),

    getStory: builder.query<RequestResponse, void>({
      query: () => ({
        url: `/stories/`,
      }),
      keepUnusedDataFor: 0,
    }),

    addStory: builder.mutation({
      query: ({ data }) => ({
        url: "/stories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Story"],
    }),

    deleteStory: builder.mutation({
      query: ({ data }) => ({
        url: `/stories/${data}`,
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
