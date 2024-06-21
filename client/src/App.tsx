import { BrowserRouter, Route, Routes } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import ProfilePage from "./pages/ProfilePage";
import DiscoverPage from "./pages/DiscoverPage";
import Notification from "./pages/Notification";
import ChatWindow from "./components/chat/ChatWindow";
import Calls from "./pages/Calls";
import UserAuth from "./components/auth/UserAuth";
import EditProfile from "./pages/EditProfile";
import AppLayout from "./layout/AppLayout";
import { useSelector } from "react-redux";
import { StoreState } from "./interfaces/storeInterface";
import OtherUserProfile from "./components/profile/OtherUserProfile";
import FollowingPage from "./pages/FollowingPage";
import ViewPost from "./components/post/ViewPost";
import { AnimatePresence } from "framer-motion";
import FollowersPage from "./pages/FollowersPage";
import StoryPage from "./pages/StoryPage";
import NewStoryPage from "./pages/NewStoryPage";

function App() {
  const { isLoading } = useSelector((state: StoreState) => state.commonSlice);

  return (
    <>
      <BrowserRouter basename="/">
        {!isLoading && <UserAuth />}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chats/:id" element={<ChatWindow />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/user/:id" element={<OtherUserProfile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/following/:id" element={<FollowingPage />} />
            <Route path="/profile/followers/:id" element={<FollowersPage />} />
            <Route path="/user/following/:id" element={<FollowingPage />} />
            <Route path="/user/followers/:id" element={<FollowersPage />} />
            <Route path="/post/:id" element={<ViewPost />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/stories/:id" element={<StoryPage />} />
            <Route path="/stories/new" element={<NewStoryPage />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </>
  );
}
export default AppLayout(App);
