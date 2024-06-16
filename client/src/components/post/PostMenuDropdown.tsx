import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { ReactElement, useState } from "react";
import {
  useDeletePostMutation,
  useSendRequestMutation,
} from "../../store/api/api";
import { useSocket } from "../../socket";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hooks";
import { UNFOLLOW_USER } from "../../constants/events";
import { POST_URL } from "../../constants";
interface PostMenuDropdownProps {
  children: ReactElement;
  userId: string | undefined;
  postId: string | undefined;
}
export default function PostMenuDropdown({
  children,
  userId,
  postId,
}: PostMenuDropdownProps) {
  const socket = useSocket();
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const isFriend = user.following?.some((id) => id == userId);
  const [btnState, setBtnState] = useState(isFriend);
  const [deletePost] = useAsyncMutation(useDeletePostMutation);
  const [sendFriendRequest] = useSendRequestMutation();

  const handleDelete = async () => {
    await deletePost("Deleting post", { postId: postId });
  };

  const handleUnfollow = async () => {
    socket?.emit(UNFOLLOW_USER, { userA: user._id, userB: userId });
    setBtnState(false);
  };

  const handleFollow = async () => {
    await sendFriendRequest({
      userId: userId,
    });
    setBtnState(true);
  };

  const handleCopy = () => {
    if (POST_URL) {
      navigator.clipboard
        .writeText(POST_URL + postId)
        .then(() => {
          toast.success("Copied!");
        })
        .catch((error) => toast.error("Error copying to clipboard:", error));
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <span>{children}</span>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {userId != user?._id ? (
          !btnState ? (
            <DropdownItem key="follow" onPress={handleFollow}>
              Follow
            </DropdownItem>
          ) : (
            <DropdownItem key="follow" onPress={handleUnfollow}>
              Unollow
            </DropdownItem>
          )
        ) : (
          <DropdownItem
            key="delete"
            color="danger"
            className="text-danger"
            onPress={handleDelete}
          >
            Delete
          </DropdownItem>
        )}
        <DropdownItem key="copy" onPress={handleCopy}>
          Copy link
        </DropdownItem>
        <DropdownItem key="go-to-post" textValue="Go to post">
          <>
            <Link to={`/post/${postId}`}>Go to post</Link>
          </>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
