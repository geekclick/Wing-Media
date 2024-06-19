import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  User,
  Avatar,
  Input,
  Spinner,
  AvatarIcon,
} from "@nextui-org/react";
import { ReactElement, useState } from "react";
import { BiSend } from "react-icons/bi";
import { Post } from "../../interfaces/common";
import { AiOutlineDelete } from "react-icons/ai";
import { useSwipeable, SwipeableHandlers } from "react-swipeable";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "../../store/api/api";
import { useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { Link } from "react-router-dom";

interface CommentModalProps {
  children: ReactElement;
  post: Post;
}

function CommentModal({ children, post }: CommentModalProps) {
  const [text, setText] = useState("");
  const { user } = useSelector((state: StoreState) => state.userSlice);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [addComment, loading] = useAsyncMutation(useAddCommentMutation);
  const [deleteComment] = useAsyncMutation(useDeleteCommentMutation);

  const handlers: SwipeableHandlers = useSwipeable({
    onSwipedDown: () => {
      onClose();
    },
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  async function handleComment() {
    await addComment("Posting", {
      postId: post?._id,
      body: {
        user: {
          username: user.username,
          avatar: { public_id: user.avatar?.public_id, url: user?.avatar?.url },
        },
        content: text,
      },
    });
    setText("");
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        <span onClick={onOpen}>{children}</span>
        <Modal
          isOpen={isOpen}
          placement={"bottom-center"}
          size="full"
          classNames={{
            closeButton: "left-0 text-2xl pt-5 hidden",
            base: "pt-2",
          }}
          scrollBehavior="inside"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="p-2  pb-4 border-b flex justify-between items-center">
                  <div
                    {...handlers}
                    className="flex flex-col w-full justify-center items-center"
                  >
                    <div className="w-10 h-1 bg-gray-500/50 rounded-full my-1"></div>
                    <h1>Comments</h1>
                  </div>
                </ModalHeader>
                <ModalBody className="gap-0 pb-10">
                  {post.comments?.length != 0 ? (
                    post.comments?.map((c) => {
                      return (
                        <div key={c?._id}>
                          <div className="py-4 flex w-full justify-between items-center">
                            <Link to={`/user/${c?._id}`}>
                              <User
                                name={c?.user?.username}
                                avatarProps={{
                                  src: `${c?.user?.avatar?.url}`,
                                  showFallback: true,
                                  fallback: <AvatarIcon />,
                                  classNames: { fallback: "w-full" },
                                }}
                                classNames={{
                                  name: "relative bottom-1 text-xs",
                                }}
                              />
                            </Link>
                            {c?.user?.username == user?.username && (
                              <div className="flex space-x-1">
                                <AiOutlineDelete
                                  className="text-danger"
                                  onClick={async () =>
                                    await deleteComment("Deleting", {
                                      postId: post?._id,
                                      body: { comment_id: c?._id },
                                    })
                                  }
                                />
                              </div>
                            )}
                          </div>
                          <div className="text-sm relative bottom-8 ml-12">
                            {c.content}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-full flex justify-center items-center">
                      <h1 className="text-2xl font-bold text-gray-500/50">
                        No comments
                      </h1>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter className="fixed bottom-0 right-0 w-full p-0">
                  <div className="flex justify-around items-center p-4 m-0 bg-white w-full">
                    <Avatar src={user.avatar?.url} showFallback />
                    <Input
                      placeholder="Add a comment"
                      className="w-[250px]"
                      isClearable
                      isRequired
                      value={text}
                      onValueChange={setText}
                    />
                    {loading ? (
                      <Spinner size="lg" />
                    ) : (
                      <BiSend onClick={handleComment} className="text-xl" />
                    )}
                  </div>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default CommentModal;
