import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { Message } from "../../interfaces/common";
import { useMemo } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useAsyncMutation } from "../../hooks/hooks";
import { useDeleteMessageMutation } from "../../store/api/api";

const ChatBubble = (message: Message) => {
  const [deleteMsg] = useAsyncMutation(useDeleteMessageMutation);
  const messageTime = useMemo(() => {
    if (message) {
      const date = new Date(message?.createdAt);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }
    return "";
  }, [message]);

  const deleteMessage = async () => {
    try {
      await deleteMsg("Deleting", { id: message._id });
    } catch (error) {
      console.log(error);
    }
  };
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const isUser = user._id && user?._id === message?.sender ? true : false;
  return (
    message && (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
        <div className="flex justify-center items-end space-x-2">
          {user._id != message.sender ? (
            <>
              <div
                className={`max-w-xs p-3 rounded-lg text-white ${
                  isUser ? "bg-blue-500" : "bg-[#909290] text-black"
                }`}
              >
                {message?.content}
              </div>
              <p className="text-[10px]">{messageTime}</p>
            </>
          ) : (
            <>
              <Dropdown>
                <DropdownTrigger>
                  <div
                    className={`max-w-xs p-3 rounded-lg text-white ${
                      isUser ? "bg-blue-500" : "bg-[#909290] text-black"
                    }`}
                  >
                    {message?.content}
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem key="delete" onClick={deleteMessage}>
                    Delete Message
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <p className="text-[10px]">{messageTime}</p>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default ChatBubble;
