import { Navbar, NavbarContent, NavbarItem, Avatar } from "@nextui-org/react";
import { RiUserSearchFill, RiUserSearchLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import NewPostModal from "../post/NewPostModal";
import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { TbPhoto, TbPhotoFilled } from "react-icons/tb";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { useCurrentPath } from "../../hooks/hooks";

export default function BottomNav() {
  const path = "/" + useCurrentPath(1);
  const user = useSelector((state: StoreState) => state.userSlice.user);
  return (
    <Navbar className="fixed top-auto bottom-0 w-screen lg:hidden">
      <NavbarContent
        className="flex gap-4  w-full"
        style={{ justifyContent: "space-around" }}
      >
        <NavbarItem>
          <Link
            color="foreground"
            to="/"
            className="flex flex-col justify-center items-center"
          >
            {path == "/" ? (
              <TbPhotoFilled className="text-2xl" />
            ) : (
              <TbPhoto className="text-2xl" />
            )}
            <p className="text-xs font-semibold  text-center">Feed</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
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
            <p className="text-xs font-semibold  text-center">Friends</p>
          </Link>
        </NavbarItem>
        <NavbarItem>
          {/* <Link color="foreground" to="/upload"> */}
          <NewPostModal>
            <div>
              <MdOutlineAddToPhotos className="text-2xl" />
              <p className="text-xs font-semibold text-center">Post</p>
            </div>
          </NewPostModal>
          {/* </Link> */}
        </NavbarItem>
        {/* <NavbarItem>
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
            <p className="text-xs font-semibold  text-center">Calls</p>
          </Link>
        </NavbarItem> */}
        <NavbarItem isActive>
          <Link
            to="/profile"
            aria-current="page"
            className="flex flex-col justify-center items-center"
          >
            <Avatar src={user?.avatar?.url} size="sm" />
            <p className="text-xs font-semibold  text-center">Me</p>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
