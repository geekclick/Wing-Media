import "../../assets/HeartAnimation.css";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { RiChat1Line } from "react-icons/ri";
import { TbSend } from "react-icons/tb";
import { MdSaveAlt } from "react-icons/md";
import { Image } from "@nextui-org/react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { Post, User } from "../../interfaces/common";
import { timeAgo } from "../../helpers/helper";
import {
  useAddLikeMutation,
  useGetUserQuery,
  useRemoveLikeMutation,
} from "../../store/api/api";
import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import ShareModal from "./ShareModal";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import PostMenuDropdown from "./PostMenuDropdown";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import CommentModal from "../comment/CommentModal";
import { useDoubleTap } from "../../hooks/hooks";

export default function PostComponent({ ...post }: Post) {
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const [postUser, setPostUser] = useState<User | null>(null);
  const [addLike] = useAddLikeMutation();
  const [removeLike] = useRemoveLikeMutation();
  const { data } = useGetUserQuery(post?.user_id);
  const [showHeart, setShowHeart] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const [isLiked, setIsLiked] = useState(
    user?._id && post.likes?.includes(user?._id)
  );

  const handleLike = () => {
    if (!isLiked) {
      addLike({ postId: post?._id });
      setIsLiked(true);
    } else {
      removeLike({ postId: post?._id });
      setIsLiked(false);
    }
  };

  useEffect(() => {
    setPostUser(data?.data);
  });

  const handleDoubleTap = () => {
    setShowHeart(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setShowHeart(false), 500);
    if (!isLiked) {
      handleLike();
    }
  };
  const onDoubleTap = useDoubleTap(handleDoubleTap);

  return (
    <>
      <Card className="max-w-screen rounded-none shadow-sm">
        <CardHeader className="justify-between">
          <Link to={`/user/${post?.user_id}`}>
            <div className="flex gap-5">
              <Avatar
                radius="full"
                color="primary"
                size="md"
                src={postUser?.avatar?.url}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {postUser?.name}
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  {postUser?.username}
                </h5>
              </div>
            </div>
          </Link>
          <PostMenuDropdown userId={post?.user_id} postId={post?._id}>
            <BsThreeDots className="text-xl mx-2" />
          </PostMenuDropdown>
        </CardHeader>
        <CardBody
          className="px-3 py-1 text-small text-default-400 flex items-center"
          onClick={onDoubleTap}
        >
          {post?.postImage?.url ? (
            <>
              <Image
                className="h-fit rounded-none"
                alt="NextUI hero Image with delay"
                src={post?.postImage?.url || ""}
                loading="lazy"
              />
              <div
                className={`relative ${
                  post.postImage.url.endsWith("4") ? "flex" : "hidden"
                } justify-center items-center`}
              >
                <ReactPlayer
                  url={post?.postImage?.url}
                  playing={playing}
                  width="100%"
                  height="auto"
                  onEnded={() => setPlaying(false)}
                />
                {!playing ? (
                  <FaPlay
                    className="absolute z-10 text-6xl text-white"
                    onClick={() => setPlaying(true)}
                  />
                ) : (
                  <div
                    className="w-40 h-40 absolute "
                    onClick={() => setPlaying(false)}
                  ></div>
                )}
              </div>
            </>
          ) : (
            <div className="py-10 flex">
              <h1 className="text-2xl font-semibold text-black">
                {post.content}
              </h1>
            </div>
          )}
          <div className={`heart ${showHeart ? "show" : ""}`} />
        </CardBody>
        <CardFooter className="flex-col rounded-none">
          <div className="px-2 flex justify-between w-full h-full">
            <div className=" space-y-1 justify-center items-center">
              <div className="flex text-2xl space-x-2">
                <span onClick={handleLike}>
                  {isLiked ? (
                    <GoHeartFill className="text-accent" role="button" />
                  ) : (
                    <GoHeart role="button" />
                  )}
                </span>
                <CommentModal post={post}>
                  <RiChat1Line />
                </CommentModal>
                <ShareModal postId={post?._id || ""}>
                  <TbSend />
                </ShareModal>
              </div>
              <h1 className="font-bold text-sm">
                {post?.likes?.length || 0} likes
              </h1>
            </div>
            <div className="text-2xl">
              {post?.postImage?.url && (
                <Link
                  to={post?.postImage?.url}
                  download={"wing-media"}
                  target="_blank"
                >
                  <MdSaveAlt />
                </Link>
              )}
            </div>
          </div>
          <div className="text-sm w-full px-3">
            <p>{post?.postImage?.url && post.content}</p>
            <span className="pt-2">
              {/* #FrontendWithZoey */}
              <span className="py-2" aria-label="computer" role="img">
                {/* 💻 */}
              </span>
            </span>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {/* View More */}
              </p>
            </div>
            <p className="text-xs font-semibold">
              {post?.comments && post?.comments[0]?.user?.username}{" "}
              {post?.comments && post?.comments[0]?.content}
            </p>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-xs">
                {post.created_at && timeAgo(post?.created_at)}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
