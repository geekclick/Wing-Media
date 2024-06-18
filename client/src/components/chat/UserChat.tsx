import {
  AvatarIcon,
  Badge,
  User as NextUiUser,
} from "@nextui-org/react";
import { Chat } from "../../interfaces/common";
import { useEffect, useMemo } from "react";
import { useGetMessagesQuery, useGetUserQuery } from "../../store/api/api";
import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { getOtherUser } from "../../helpers/helper";
import Loader from "../shared/Loader";

function UserChat({ _id, members }: Chat) {
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const chats = useSelector(
    (state: StoreState) => state.chatSlice.messageCount
  );
  const messageCountObj = chats.find((mc) => mc.chatId === _id);
  const userId = getOtherUser(user?._id, members);

  const { data: userData, refetch: refetchUser } = useGetUserQuery(userId);
  const { isLoading, data: messageData } = useGetMessagesQuery(_id);

  useEffect(() => {
    refetchUser();
  }, [userId, refetchUser]);

  const latestMessage = useMemo(() => {
    if (messageData && messageData.data.length > 0) {
      return messageData.data[messageData.data.length - 1];
    }
    return null;
  }, [messageData]);

  const messageTime = useMemo(() => {
    if (latestMessage) {
      const date = new Date(latestMessage.createdAt);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
    return "";
  }, [latestMessage]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="py-3 px-4 my-6 border-black flex justify-between">
      <NextUiUser
        name={userData?.data?.name}
        classNames={{
          name: "text-lg font-semibold text-foreground",
        }}
        description={latestMessage ? latestMessage.content : ""}
        avatarProps={{
          size: "lg",
          src: `${userData?.data.avatar?.url}`,
          showFallback: true,
          fallback: <AvatarIcon />,
          classNames: { fallback: "w-full" },
        }}
      />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-xs font-medium text-black/70">{messageTime}</h1>
        <Badge
          content={messageCountObj?.count === 0 ? null : messageCountObj?.count}
          size="lg"
          className="text-white bg-accent"
        >
          {null}
        </Badge>
      </div>
    </div>
  );
}

export default UserChat;
