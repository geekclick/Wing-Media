import { useSelector } from "react-redux";
import BottomNav from "../components/shared/BottomNav";
import Search from "../components/search/Search";
import { StoreState } from "../interfaces/storeInterface";
import { User as NextUIUser } from "@nextui-org/react";
import { RiUserAddLine } from "react-icons/ri";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useSendRequestMutation } from "../store/api/api";
import { useAsyncMutation } from "../hooks/hooks";
import { GiSandsOfTime } from "react-icons/gi";
import { Link } from "react-router-dom";
import { User } from "../interfaces/common";
import DesktopSidebar from "../components/shared/DesktopSidebar";
import { motion } from "framer-motion";

interface SearchResultProps {
  user: User;
}

function SearchResult({ user }: SearchResultProps) {
  const [btnState, setBtnState] = useState(false);
  const me = useSelector((state: StoreState) => state.userSlice.user);
  const isFriend = me.following?.some((id) => id === user?._id);
  const [sendFriendRequest, isLoading] = useAsyncMutation(
    useSendRequestMutation
  );

  return (
    <div className="flex justify-between items-center w-full">
      <Link to={`/user/${user?._id}`}>
        <NextUIUser
          name={user.name}
          description={user.username}
          avatarProps={{
            src: `${user.avatar?.url}`,
          }}
        />
      </Link>
      {isLoading ? (
        <GiSandsOfTime className="text-xl" />
      ) : !btnState && !isFriend ? (
        <RiUserAddLine
          className="text-xl"
          role="button"
          onClick={async () => {
            await sendFriendRequest("Request sending..", { userId: user?._id });
            setBtnState(true);
          }}
        />
      ) : (
        <FaCheck className="text-xl" />
      )}
    </div>
  );
}

function DiscoverPage() {
  const { user, users } = useSelector((state: StoreState) => state.userSlice);

  return (
    <>
      <DesktopSidebar />
      <motion.div
        className="lg:px-40 lg:pt-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", duration: 0.5 }}
      >
        <div className="lg:w-[600px] lg:m-auto p-4">
          <Search />
          <div className="h-[60vh] m-auto text-center">
            {users.length !== 0 ? (
              <div className="flex flex-col space-y-5 justify-center items-start p-5">
                {users
                  .filter((u) => u?._id !== user?._id)
                  .map((u) => (
                    <SearchResult user={u} key={u?._id} />
                  ))}
              </div>
            ) : (
              <div className="flex h-[50vh]  justify-center items-center">
                <p>No user found!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
}

export default DiscoverPage;
