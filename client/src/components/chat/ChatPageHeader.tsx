import { FaArrowLeft } from "react-icons/fa";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { TbMessageCirclePlus } from "react-icons/tb";
import { Link } from "react-router-dom";
import SearchChatModal from "../search/SearchChatModal";

function ChatPageHeader() {
  return (
    <div className="p-4 px-5 flex justify-between items-center">
      <div className="flex items-center space-x-4 lg:space-x-0">
        <Link to={"/"} className="lg:hidden">
          <FaArrowLeft />
        </Link>
        <h1 className="font-medium text-3xl">Chats</h1>
      </div>
      <div className="flex justify-center items-center space-x-3">
        <SearchChatModal>
          <TbMessageCirclePlus className="text-2xl" />
        </SearchChatModal>
        <PiDotsThreeOutlineVertical className="text-2xl" />
      </div>
    </div>
  );
}

export default ChatPageHeader;
