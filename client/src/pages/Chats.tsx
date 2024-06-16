import { Link } from "react-router-dom";
import ChatPageHeader from "../components/chat/ChatPageHeader";
import UserChat from "../components/chat/UserChat";
import { useSelector } from "react-redux";
import { StoreState } from "../interfaces/storeInterface";
import DesktopSidebar from "../components/shared/DesktopSidebar";
import { Chat as ChatInterface } from "../interfaces/common";
import { useEffect } from "react";
import { useSocket } from "../socket";
import { CHAT_JOINED, CHAT_LEAVED } from "../constants/events";

interface ChatProps {
  user: string | undefined;
  chat: ChatInterface;
}

export const Chat = ({ user, chat }: ChatProps) => {
  const socket = useSocket();
  useEffect(() => {
    if (user) {
      socket?.emit(CHAT_JOINED, { userId: user, members: chat.members });
      return () => {
        socket?.emit(CHAT_LEAVED, { userId: user, members: chat.members });
      };
    }
  }, []);

  return (
    <Link to={`/chats/${chat._id}`}>
      <UserChat {...chat} />
    </Link>
  );
};

function Chats() {
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const { chats } = useSelector((state: StoreState) => state.chatSlice);
  const validChats = chats?.filter(
    (c: ChatInterface) => user._id && c.members?.includes(user._id)
  );
  return (
    <>
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:py-6">
        <ChatPageHeader />
        {validChats?.map((chat: ChatInterface) => {
          return <Chat user={user._id} chat={chat} key={chat._id} />;
        })}
      </div>
    </>
  );
}

export default Chats;
