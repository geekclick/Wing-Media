import { useSelector } from "react-redux";
import BottomNav from "../shared/BottomNav";
import Header from "../shared/Header";
import PostComponent from "./Post";
import { StoreState } from "../../interfaces/storeInterface";
import { useParams } from "react-router-dom";

function ViewPost() {
  const { id } = useParams();
  const posts = useSelector((state: StoreState) => state.postSlice.posts);
  const post = posts.find((p) => p._id == id);

  return (
    <>
      <Header />
      {post && <PostComponent {...post} />}
      <div className="pt-16">
        <BottomNav />
      </div>
    </>
  );
}

export default ViewPost;
