import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import ChatBubble from "./ChatBubble";
import UserHeader from "./UserHeader";
import { useParams } from "react-router-dom";
import { useGetMessagesQuery, useGetUserQuery } from "../../store/api/api";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { getOtherUser } from "../../helpers/helper";
import { useSocket } from "../../socket";
import { resetMessageCount } from "../../store/reducers/chatSlice";
import { Message } from "../../interfaces/common";
import DesktopSidebar from "../shared/DesktopSidebar";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  REFETCH_MESSAGES,
} from "../../constants/events";

interface NewMessage {
  message: string;
  chatId: string | undefined;
  members: string[];
}

const ChatWindow = () => {
  const { id } = useParams();
  const socket = useSocket();
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const { chats, messageCount } = useSelector(
    (state: StoreState) => state.chatSlice
  );
  const chat = chats.filter((c) => c?._id === id)[0];
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const otherUserId = getOtherUser(user?._id, chat?.members);
  const { data: userData } = useGetUserQuery(otherUserId);
  const { data: messageData, refetch: refetchMessages } = useGetMessagesQuery(
    id?.toString()
  );

  useEffect(() => {
    dispatch(resetMessageCount({ chatId: id || "" }));
  }, [messageCount]);

  useEffect(() => {
    if (messageData) {
      scrollToBottom();
    }
  }, [messageData?.data]);

  const handleRefetchMessages = () => {
    refetchMessages();
  };

  useEffect(() => {
    socket?.on(REFETCH_MESSAGES, handleRefetchMessages);
    return () => {
      socket?.off(REFETCH_MESSAGES, handleRefetchMessages);
    };
  }, [handleRefetchMessages, socket]);

  useEffect(() => {
    socket?.emit(CHAT_JOINED, { userId: user?._id, members: chat?.members });
    return () => {
      socket?.emit(CHAT_LEAVED, { userId: user?._id, members: chat?.members });
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: NewMessage = {
        chatId: chat?._id?.toString(),
        members: chat?.members,
        message: message,
      };
      if (socket) socket.emit(NEW_MESSAGE, newMessage);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  return (
    <>
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:py-4">
        <div className="flex flex-col lg:h-[95vh] h-screen p-4">
          <UserHeader otherUser={userData?.data} chatId={chat?._id} />
          <div className="flex-grow overflow-auto my-4 flex flex-col-reverse">
            <div ref={messagesEndRef} />
            {[...messageData?.data].reverse().map((msg: Message) => {
              return <ChatBubble key={msg?._id} {...msg} />;
            })}
          </div>
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className="flex-grow border border-gray-300 p-2 rounded-l-lg"
              placeholder="Type a message..."
              autoFocus
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
