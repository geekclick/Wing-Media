import Header from "../shared/Header";
import BottomNav from "../shared/BottomNav";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "../../store/api/api";
import { useEffect, useState } from "react";
import { Avatar, Button } from "@nextui-org/react";
import PostComponent from "../post/Post";
import { Post } from "../../interfaces/common";
import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { useSendRequestMutation } from "../../store/api/api";
import { useAsyncMutation } from "../../hooks/hooks";
import { useSocket } from "../../socket";
import DesktopSidebar from "../shared/DesktopSidebar";
import Loader from "../shared/Loader";
import { UNFOLLOW_USER } from "../../constants/events";

function OtherUserProfile() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { user: me } = useSelector((state: StoreState) => state.userSlice);
  const { id: userId } = useParams<{ id: string }>();
  if (me?._id == userId) navigate("/profile");
  const [zoom, setZoom] = useState(false);
  const posts = useSelector((state: StoreState) => state.postSlice.posts);
  const { isLoading, data, refetch } = useGetUserQuery(userId);

  const [user, setUser] = useState(data?.data);

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data]);

  const isFriend = me.following?.some((id) => id == userId);
  const [btnState, setBtnState] = useState<boolean | undefined>(isFriend);

  const [sendFriendRequest] = useAsyncMutation(useSendRequestMutation);

  const handleFollow = async () => {
    if (!btnState) {
      await sendFriendRequest("Request sending..", {
        userId: userId,
      });
      setBtnState(true);
    } else {
      socket?.emit(UNFOLLOW_USER, { userA: me?._id, userB: userId });
      setBtnState(false);
    }
  };
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <DesktopSidebar />
      <section className="lg:w-[600px] lg:m-auto lg:py-6">
        <div className="bg-white flex flex-col">
          {/* Zoomed avatar section */}
          {zoom && (
            <div
              onClick={() => setZoom(false)}
              className="w-full h-[100vh] absolute z-50 bg-black/80 flex justify-center pt-40"
            >
              <Avatar
                src={user?.avatar?.url}
                className="w-44 h-44 text-large"
                showFallback
              />
            </div>
          )}

          {/* User info section */}
          <div className="flex justify-evenly items-center py-5">
            <Avatar
              onClick={() => setZoom(true)}
              src={user?.avatar?.url}
              className="w-20 h-20 text-large"
              showFallback
            />
            <div className="flex flex-col space-y-5">
              <div className="flex justify-center items-center space-x-3">
                <h1 className="text-2xl font-medium">{user?.username}</h1>
              </div>
              <div className="space-x-2">
                <Button
                  className={
                    btnState
                      ? "bg-transparent text-foreground border-default-200"
                      : "text-white"
                  }
                  color="primary"
                  fullWidth
                  radius="full"
                  size="md"
                  variant={btnState ? "bordered" : "solid"}
                  onPress={handleFollow}
                >
                  {btnState ? "Unfollow" : "Follow"}
                </Button>
              </div>
            </div>
          </div>

          {/* User bio section */}
          <div className="px-6 pb-8 lg:w-[400px]">
            <h1 className="font-bold">{user?.name}</h1>
            <p>{user?.bio}</p>
          </div>

          {/* User stats section */}
          <div className="flex justify-around items-center p-3 border-y">
            <div className="text-center">
              <h1 className="font-bold">{user?.posts?.length}</h1>
              <p>posts</p>
            </div>
            <Link to={`/user/followers/${user?._id}`}>
              <div className="text-center">
                <h1 className="font-bold">{user?.followers?.length}</h1>
                <p>followers</p>
              </div>
            </Link>
            <Link to={`/user/following/${user?._id}`}>
              <div className="text-center">
                <h1 className="font-bold">{user?.following?.length}</h1>
                <p>following</p>
              </div>
            </Link>
          </div>

          {posts
            ?.filter((p) => p?.user_id == userId)
            .reverse()
            ?.map((post: Post) => (
              <PostComponent key={post.created_at} {...post} />
            ))}
        </div>
        <div className="pt-16">
          <BottomNav />
        </div>
      </section>
    </>
  );
}

export default OtherUserProfile;
