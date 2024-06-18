import { Avatar, Badge, Button } from "@nextui-org/react";
import { AiFillDingtalkSquare } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StoreState } from "../../interfaces/storeInterface";
import { RiUserSearchFill, RiUserSearchLine } from "react-icons/ri";
import { PiPhoneCallFill, PiPhoneCallLight } from "react-icons/pi";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { BiMessageSquareDots } from "react-icons/bi";
import NewPostModal from "../post/NewPostModal";
import { TbPhoto, TbPhotoFilled } from "react-icons/tb";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { useCurrentPath } from "../../hooks/hooks";

function DesktopSidebar() {
  const path = "/" + useCurrentPath(1);
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const { notificationCount } = useSelector(
    (state: StoreState) => state.userSlice
  );
  const { messageCount } = useSelector((state: StoreState) => state.chatSlice);
  const totalMessageCount = messageCount.reduce(
    (accumulator, currentObject) => {
      return accumulator + currentObject.count;
    },
    0
  );
  return (
    <aside>
      <section className="border-r w-[80px] h-screen fixed lg:flex flex-col items-center hidden">
        <div className="p-10">
          <p className="font-bold text-inherit flex items-center justify-center text-4xl space-x-2">
            <Link to={"/"}>
              <AiFillDingtalkSquare className="lg:text-4xl" />
            </Link>
            <span className="lg:hidden">Wing</span>
          </p>
        </div>
        <div className="lg:w-fit m-4 space-y-6">
          <Button variant="light" fullWidth>
            <Link
              color="foreground"
              to="/"
              className="flex justify-start gap-3 items-center"
            >
              {path == "/" ? (
                <TbPhotoFilled className="text-2xl" />
              ) : (
                <TbPhoto className="text-2xl" />
              )}
              <p className="text-lg font-semibold lg:hidden">Home</p>
            </Link>
          </Button>
          <Button variant="light" fullWidth>
            <Link
              color="foreground"
              to="/discover"
              className="flex flex-col justify-center items-center"
            >
              {path == "/discover" ? (
                <RiUserSearchFill className="text-2xl" />
              ) : (
                <RiUserSearchLine className="text-2xl" />
              )}
              <p className="text-xs font-semibold lg:hidden">Friends</p>
            </Link>
          </Button>
          <Button variant="light" fullWidth>
            <div>
              <NewPostModal>
                <MdOutlineAddToPhotos className="text-2xl" />
                <p className="text-xs font-semibold lg:hidden">Post</p>
              </NewPostModal>
            </div>
          </Button>
          <Button variant="light" fullWidth>
            <Link
              color="foreground"
              to="/calls"
              className="flex flex-col justify-center items-center"
            >
              {path == "/calls" ? (
                <PiPhoneCallFill className="text-2xl" />
              ) : (
                <PiPhoneCallLight className="text-2xl" />
              )}
              <p className="text-xs font-semibold lg:hidden">Calls</p>
            </Link>
          </Button>
          <Button variant="light" fullWidth>
            <Badge
              content={
                totalMessageCount == 0 ? null : totalMessageCount.toString()
              }
              color="danger"
            >
              <Link to="/chats">
                <BiMessageSquareDots className="text-2xl" />
              </Link>
            </Badge>
          </Button>
          <Button variant="light" fullWidth>
            <Badge
              content={notificationCount == 0 ? null : notificationCount}
              color="danger"
            >
              <Link to={"/notifications"}>
                <IoNotificationsCircleOutline className="text-2xl" />
              </Link>
            </Badge>
          </Button>
          <Button variant="light" fullWidth>
            <Link
              to="/profile"
              aria-current="page"
              className="flex flex-col justify-center items-center"
            >
              <Avatar src={user?.avatar?.url} size="sm" showFallback/>
              <p className="text-xs font-semibold lg:hidden">Me</p>
            </Link>
          </Button>
          <Button variant="light" fullWidth></Button>
        </div>
      </section>
    </aside>
  );
}

export default DesktopSidebar;
