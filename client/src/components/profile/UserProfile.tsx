import { Avatar, Button } from "@nextui-org/react";
import PostComponent from "../post/Post";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Post, User } from "../../interfaces/common";
import { LuLogOut } from "react-icons/lu";
import axios from "axios";
import { setIsLoggedIn } from "../../store/reducers/authSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../shared/Loader";
import { SERVER_URL } from "../../constants";

interface UserProfileProps {
  user: User;
  isLoading: boolean;
  posts: Post[];
}

function UserProfile({ user, posts, isLoading }: UserProfileProps) {
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      if (response) {
        dispatch(setIsLoggedIn(false));
        toast.success("Log out Successful!");
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  return isLoading ? (
    <Loader />
  ) : (
    <section className="bg-white flex flex-col">
      {/* Zoomed avatar section */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="w-full h-[100vh] absolute z-50 bg-black/80 flex justify-center pt-40"
        >
          <Avatar src={user?.avatar?.url} className="w-44 h-44 text-large" />
        </div>
      )}

      {/* User info section */}
      <div className="flex justify-evenly items-center py-5">
        <Avatar
          onClick={() => setZoom(true)}
          src={user?.avatar?.url}
          className="w-20 h-20 text-large"
        />
        <div className="flex flex-col space-y-5">
          <div className="flex justify-center items-center space-x-3">
            <h1 className="text-2xl font-medium">{user?.username}</h1>
          </div>
          <div className="flex space-x-4 justify-center items-center">
            <Button size="sm" className="font-medium w-20">
              {/* Use Link component for navigation */}
              <Link to="/profile/edit">Edit Profile</Link>
            </Button>
            <button onClick={handleLogout}>
              <LuLogOut className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* User bio section */}
      <div className="px-6 pb-8 lg:ml-24">
        <h1 className="font-bold">{user?.name}</h1>
        <p>{user?.bio}</p>
      </div>

      {/* User stats section */}
      <div className=" flex justify-around items-center p-3 border-y">
        <div className="text-center">
          <h1 className="font-bold">{user?.posts?.length}</h1>
          <p>posts</p>
        </div>
        <Link to={`/profile/followers/${user?._id}`}>
          <div className="text-center">
            <h1 className="font-bold">{user?.followers?.length}</h1>
            <p>followers</p>
          </div>
        </Link>
        <Link to={`/profile/following/${user?._id}`}>
          <div className="text-center">
            <h1 className="font-bold">{user?.following?.length}</h1>
            <p>following</p>
          </div>
        </Link>
      </div>

      {posts
        ?.filter((p) => p.user_id == user?._id)
        .reverse()
        .map((post) => (
          <PostComponent key={post.created_at} {...post} />
        ))}
    </section>
  );
}

export default UserProfile;
