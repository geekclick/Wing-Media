import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { Post } from "../../interfaces/common";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useClearMessagesMutation,
  useDeleteChatMutation,
} from "../../store/api/api";
import { StoreState } from "../../interfaces/storeInterface";
import { useSelector } from "react-redux";
import { useMemo } from "react";
interface User {
  avatar?: { public_id: string; url: string };
  _id?: string;
  username?: string;
  name?: string;
  email?: string;
  password?: string;
  bio?: string;
  posts?: Post[];
  followers?: string;
  following?: string;
}

interface UserHeaderProps {
  chatId: string | undefined;
  otherUser: User;
}

function UserHeader({ chatId, otherUser }: UserHeaderProps) {
  const navigate = useNavigate();
  const [clear] = useAsyncMutation(useClearMessagesMutation);
  const [deleteChat] = useAsyncMutation(useDeleteChatMutation);
  const onlineUsers = useSelector(
    (state: StoreState) => state.commonSlice.isOnline
  );

  const isOnline = useMemo(() => {
    return otherUser?._id && onlineUsers?.includes(otherUser?._id);
  }, [onlineUsers]);
  const chatDelete = async () => {
    try {
      await deleteChat("Deleting", { id: chatId });
      navigate("/chats");
    } catch (error) {
      console.log(error);
    }
  };
  const clearChat = async () => {
    try {
      await clear("Clearing", { id: chatId });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2 flex justify-between items-center border-b">
      <div className="flex justify-center items-center space-x-3 lg:space-x-0">
        <Link to={"/chats"} className="lg:hidden">
          <FaArrowLeft />
        </Link>
        <Link to={`/user/${otherUser?._id}`}>
          <Badge
            content=""
            color={isOnline ? "success" : "default"}
            shape="circle"
            placement="bottom-right"
          >
            <Avatar radius="full" src={otherUser?.avatar?.url} showFallback />
          </Badge>
        </Link>
        <div className="flex flex-col justify-center items-start px-4">
          <Link to={`/user/${otherUser?._id}`}>
            <h1 className="font-bold text-xl">{otherUser?.name}</h1>
            {false ? (
              <p className="text-xs font-semibold animate-pulse">Typing...</p>
            ) : (
              <p className="text-xs font-semibold">
                {isOnline ? "Online" : "Offline"}
              </p>
            )}
          </Link>
        </div>
      </div>
      <div>
        <div className="flex space-x-3">
          <LuSearch />
          <Dropdown>
            <DropdownTrigger>
              <button>
                <PiDotsThreeOutlineVerticalLight />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="delete" onClick={chatDelete}>
                Delete chat
              </DropdownItem>
              <DropdownItem key="messsages" onClick={clearChat}>
                Clear Mesaages
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
