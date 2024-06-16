import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Badge,
} from "@nextui-org/react";
import { AiFillDingtalkSquare } from "react-icons/ai";
import { BsFillChatHeartFill } from "react-icons/bs";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";

export default function Header() {
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
    <Navbar className="bg-white lg:hidden">
      <NavbarBrand>
        <Link to={"/"}>
          <p className="font-bold text-inherit flex items-center text-2xl space-x-2">
            <AiFillDingtalkSquare />
            Wing
          </p>
        </Link>
      </NavbarBrand>
      {/* mobile view */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Badge
            content={notificationCount == 0 ? null : notificationCount}
            color="danger"
          >
            <Link to={"/notifications"}>
              <IoNotificationsCircleSharp className="text-3xl text-primary" />
            </Link>
          </Badge>
        </NavbarItem>
        <NavbarItem>
          <Badge
            content={
              totalMessageCount == 0 ? null : totalMessageCount.toString()
            }
            color="danger"
          >
            <Link to="/chats">
              <BsFillChatHeartFill className="text-3xl text-primary" />
            </Link>
          </Badge>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
