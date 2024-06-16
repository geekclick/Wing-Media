import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { useGetUserQuery } from "../store/api/api";
import { Spinner, User as NextUIUser } from "@nextui-org/react";
import DesktopSidebar from "../components/shared/DesktopSidebar";

interface FollowingUserProps {
  userId: string;
}

function FollowingUser({ userId }: FollowingUserProps) {
  const { isLoading, data } = useGetUserQuery(userId);
  return isLoading ? (
    <Spinner size="lg" />
  ) : (
    <NextUIUser
      key={data?.data?._id}
      name={data?.data?.name}
      description={data?.data?.username}
      avatarProps={{
        src: `${data?.data?.avatar?.url}`,
      }}
    />
  );
}

function FollowingPage() {
  const { id } = useParams();
  const { isLoading, data } = useGetUserQuery(id?.toString());

  return isLoading ? (
    <Spinner size="lg" />
  ) : (
    <>
      <DesktopSidebar />
      <div className="lg:w-[600px] lg:m-auto lg:py-6">
        <div className="bg-white">
          <div className="p-4 px-5 flex justify-between items-center ">
            <div className="flex items-center space-x-4 lg:space-x-0">
              <Link to={"/profile"} className="lg:hidden">
                <FaArrowLeft onClick={() => window.history.back()} />
              </Link>
              <h1 className="font-medium text-2xl">Following</h1>
            </div>
            <div className="flex justify-center items-center space-x-3">
              <BiSearch className="text-2xl" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-start m-4 space-y-6">
            {data?.data?.following?.map((userId: string) => (
              <Link to={`/user/${userId}`} key={userId}>
                <FollowingUser userId={userId} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default FollowingPage;
