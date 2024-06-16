import { useSelector } from "react-redux";
import BottomNav from "../components/shared/BottomNav";
import Stories from "../components/story/Stories";
import { StoreState } from "../interfaces/storeInterface";
import PostComponent from "../components/post/Post";
import { RiCameraLine } from "react-icons/ri";
import DesktopSidebar from "../components/shared/DesktopSidebar";
import { motion } from "framer-motion";
import Header from "../components/shared/Header";

function Home() {
  const posts = useSelector((state: StoreState) => state.postSlice.posts);
  return (
    <>
      <Header />
      <DesktopSidebar />
      <motion.div
        className="lg:w-[700px] lg:h-full lg:m-auto lg:py-8"
        initial={{ opacity: 0, height: -50 }}
        animate={{ opacity: 1, height: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <Stories />
        <div className="lg:px-10">
          {posts.length !== 0 ? (
            [...posts]
              .reverse()
              .map((post) => <PostComponent key={post._id} {...post} />)
          ) : (
            <div className="h-screen absolute top-0 w-full flex flex-col justify-center items-center">
              <RiCameraLine className="text-9xl text-gray-300" />
              <h1 className="text-2xl text-gray-500/50 font-bold">
                No posts to show
              </h1>
            </div>
          )}
        </div>
        <div className="relative pb-16 lg:hidden">
          <BottomNav />
        </div>
      </motion.div>
    </>
  );
}

export default Home;
