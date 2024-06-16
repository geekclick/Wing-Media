import { Avatar } from "@nextui-org/react";
import { BiCamera } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { Story } from "../../interfaces/common";
import {
  useDeleteStoryMutation,
  useGetStoryQuery,
  useGetUserQuery,
} from "../../store/api/api";
import { useEffect, useMemo } from "react";
import { setStories } from "../../store/reducers/storySlice";
import Loader from "../shared/Loader";

function Stories() {
  const dispatch = useDispatch();
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const stories = useSelector((state: StoreState) => state.storySlice.stories);

  const { data: storyData, refetch } = useGetStoryQuery();

  useEffect(() => {
    if (storyData) {
      dispatch(setStories(storyData.data));
    }
  }, [storyData, dispatch]);

  const [deleteStory] = useDeleteStoryMutation();

  const checkValidStories = async () => {
    const now = new Date();
    const expiredStories = stories.filter(
      (story) => new Date(story.expirationDate) <= now
    );

    for (const story of expiredStories) {
      if (story?._id) {
        await deleteStory({ data: story?._id });
      }
    }

    refetch();
  };

  useEffect(() => {
    const intervalId = setInterval(checkValidStories, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(intervalId);
  }, [stories, deleteStory, refetch]);

  const myStory = useMemo(
    () => stories.find((story) => story?.user_id === user?._id),
    [stories, user?._id]
  );

  return (
    <section className="overflow-x-auto whitespace-nowrap flex space-x-6 lg:w-[700px] bg-backgroundp p-3 lg:pb-10 border-y lg:border-0">
      {!myStory ? (
        <>
          <Link to="/stories/new">
            <Avatar
              isBordered
              color="primary"
              radius="lg"
              size="lg"
              className="flex-shrink-0"
              showFallback
              fallback={
                <BiCamera className="animate-pulse text-white text-3xl text-center" />
              }
            />
          </Link>
        </>
      ) : (
        <Link to={`/stories/${myStory?._id}`}>
          <Avatar
            isBordered
            color="primary"
            radius="lg"
            size="lg"
            className="flex-shrink-0"
            showFallback
            src={user.avatar?.url}
            fallback={
              <BiCamera className="animate-pulse text-white text-3xl text-center" />
            }
          />
        </Link>
      )}

      {stories.map((story) => (
        <OtherUserStory key={story?._id} story={story} />
      ))}
    </section>
  );
}

export default Stories;

export function OtherUserStory({ story }: { story: Story }) {
  const { isLoading, data } = useGetUserQuery(story?.user_id);
  const user = useSelector((state: StoreState) => state.userSlice.user);

  const notFollowing = useMemo(
    () => user?.following?.includes(story?.user_id),
    [user?.following, story?.user_id]
  );

  if (story?.user_id === user?._id || !notFollowing) return null;

  return isLoading ? (
    <Loader />
  ) : (
    <Link to={`/stories/${story?._id}`}>
      <Avatar
        isBordered
        color="primary"
        radius="lg"
        size="lg"
        className="flex-shrink-0"
        src={data?.data?.avatar?.url}
      />
    </Link>
  );
}
