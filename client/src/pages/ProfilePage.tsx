import { useDispatch, useSelector } from "react-redux";
import BottomNav from "../components/shared/BottomNav";
import Header from "../components/shared/Header";
import UserProfile from "../components/profile/UserProfile";
import { StoreState } from "../interfaces/storeInterface";
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "../store/api/api";
import { setUser } from "../store/reducers/userSlice";
import DesktopSidebar from "../components/shared/DesktopSidebar";

function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const posts = useSelector((state: StoreState) => state.postSlice.posts);
  const [loader, setLoader] = useState(false);
  const { isLoading, data, refetch } = useGetProfileQuery();

  useEffect(() => {
    refetch();
    setLoader(isLoading);
    dispatch(setUser(data?.data));
  }, [data]);

  return (
    <>
      <Header />
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:py-10">
        <UserProfile user={user} isLoading={loader} posts={posts} />
      </div>
      <div className="pt-16 lg:hidden">
        <BottomNav />
      </div>
    </>
  );
}

export default ProfilePage;
