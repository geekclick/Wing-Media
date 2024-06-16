import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  User,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { StoreState } from "../interfaces/storeInterface";
import { useDeleteStoryMutation, useGetUserQuery } from "../store/api/api";
import { useAsyncMutation } from "../hooks/hooks";
import DesktopSidebar from "../components/shared/DesktopSidebar";
import Loader from "../components/shared/Loader";

function StoryPage() {
  const { id } = useParams();
  const { user } = useSelector((state: StoreState) => state.userSlice);
  const { stories } = useSelector((state: StoreState) => state.storySlice);
  // const { captionStyle } = useSelector(
  //   (state: StoreState) => state.commonSlice
  // );
  const thisStory = stories.find((story) => story._id === id);
  const { isLoading, data } = useGetUserQuery(thisStory?.user_id);
  const [deleteStory] = useAsyncMutation(useDeleteStoryMutation);

  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  if (value >= 110) navigate("/");

  const handleDelete = async () => {
    try {
      await deleteStory("Deleting", { data: id });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v >= 110 ? 100 : v + 1));
    }, 80);
    return () => clearInterval(interval);
  }, []);
  return isLoading ? (
    <Loader />
  ) : (
    <>
      <DesktopSidebar />
      <motion.section
        className="lg:w-[600px] lg:m-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* header start*/}
        <Progress
          aria-label="Loading..."
          value={value}
          className="absolute z-20"
          radius="none"
          size="sm"
        />
        <div className="p-3 flex justify-between items-center  bg-black/20 fixed text-white z-20 w-full lg:w-[600px] lg:static lg:bg-white lg:text-black">
          <div className="flex justify-center items-center space-x-4">
            <Link to={"/"} className="lg:hidden">
              <BiX className="text-3xl" />
            </Link>
            <Link to={`/user/${thisStory?.user_id}`}>
              <User
                name={data?.data?.name}
                description={data?.data?.username}
                avatarProps={{
                  src: `${data?.data?.avatar?.url}`,
                }}
                classNames={{
                  name: "text-base font-semibold",
                  description: "text-white lg:text-black",
                }}
              />
            </Link>
          </div>
          {user._id == thisStory?.user_id && (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly>
                  <BsThreeDotsVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={handleDelete}
                >
                  Delete story
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <div className="w-full flex justify-center items-center h-screen lg:h-[85vh] lg:w-fit">
          <img
            className="h-auto w-[100vw] lg:w-fit"
            src={thisStory?.story.url}
            alt="jj"
          />
          <h1
            className="text-2xl z-40font-bold w-[80vw] lg:w-fit text-center"
            style={{
              position: "absolute",
              top: "30rem",
            }}
          >
            {thisStory?.caption}
          </h1>
        </div>

        {/* {user._id != thisStory?.user_id && (
        <div className="flex justify-around items-center text-white m-0 bg-black/50 fixed bottom-0 p-2 w-full">
          <Avatar src={user?.avatar?.url} />
          <Input
            placeholder="Add a comment"
            className="w-[250px]"
            isClearable
            variant="underlined"
            classNames={{ input: "text-white" }}
            color="primary"
            startContent={user?.username}
          />
          <BiSend className="text-2xl text-white" />
        </div>
      )} */}
      </motion.section>
    </>
  );
}

export default StoryPage;
