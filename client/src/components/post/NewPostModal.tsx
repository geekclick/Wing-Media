import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  ModalHeader,
  User,
  Textarea,
  ModalFooter,
  Image,
  Chip,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useFileHandler } from "6pp";
import { ChildProps } from "../../interfaces/common";
import { GoClock } from "react-icons/go";
import { BiPencil, BiX } from "react-icons/bi";
import { IoImage, IoVideocam } from "react-icons/io5";
import { FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoading } from "../../store/reducers/commonSlice";
import { StoreState } from "../../interfaces/storeInterface";
import { useAsyncMutation } from "../../hooks/hooks";
import { useNewPostMutation } from "../../store/api/api";
import toast from "react-hot-toast";
import { FiChevronLeft } from "react-icons/fi";
import { motion } from "framer-motion";

export default function NewPostModal({ children }: ChildProps) {
  const device = window.innerWidth;
  const dispatch = useDispatch();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [value, setValue] = useState("");
  const image = useFileHandler("single");
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLInputElement | null>(null);
  const user = useSelector((state: StoreState) => state.userSlice.user);
  const [createPost] = useAsyncMutation(useNewPostMutation);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setIsLoading(true));

    const formData = new FormData();
    formData.append("content", value);
    if (image.file) {
      formData.append("single", image.file);
    }
    if (videoRef.current?.files?.[0]) {
      if (videoRef.current?.files?.[0].size > 10485760) {
        toast.error("Max video size is 10MB");
        dispatch(setIsLoading(false));
        return;
      } else {
        formData.append("single", videoRef.current.files[0]);
      }
    }

    try {
      await createPost("Posting...", { data: formData });
      setValue("");
      setVideoPreview(null);
      image.clear();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  const isLoading = useSelector(
    (state: StoreState) => state.commonSlice.isLoading
  );
  return (
    <>
      <motion.div className="flex flex-col gap-2">
        <span
          onClick={onOpen}
          className="p-0 min-w-0 bg-transparent rounded-none"
        >
          {children}
        </span>
        <Modal
          isOpen={isOpen}
          placement={"bottom-center"}
          size={device >= 1024 ? "2xl" : "full"}
          classNames={{
            closeButton: "left-0 text-2xl pt-5 hidden",
            base: "pt-2 h-[80vh]",
          }}
          scrollBehavior="inside"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <form onSubmit={handleSubmit}>
                  <ModalHeader className="p-2 flex justify-between items-center">
                    <div className="flex justify-center items-center space-x-2">
                      <FiChevronLeft
                        className="text-3xl text-black/50"
                        onClick={onClose}
                      />
                      <User
                        name={user.name}
                        description="🌍Public"
                        avatarProps={{
                          src: `${user.avatar?.url}`,
                        }}
                      />
                    </div>
                    <div className="flex justify-center items-center space-x-4 absolute right-2">
                      <IoImage
                        className={`text-2xl hidden lg:flex ${
                          !image.preview && !videoPreview ? "" : "text-gray-300"
                        }`}
                        onClick={() => {
                          if (!image.preview && !videoPreview)
                            imageRef.current?.click();
                        }}
                      />
                      <IoVideocam
                        className={`text-2xl hidden lg:flex ${
                          !image.preview && !videoPreview ? "" : "text-gray-300"
                        }`}
                        onClick={() => {
                          if (!image.preview && !videoPreview)
                            videoRef.current?.click();
                        }}
                      />
                      <GoClock className="text-2xl" />
                      <Button
                        size="sm"
                        radius="full"
                        color="primary"
                        className="text-white"
                        type="submit"
                        isDisabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner color="current" size="sm" />
                        ) : (
                          "Post"
                        )}
                      </Button>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="py-4">
                      <input
                        type="file"
                        ref={imageRef}
                        onChange={image.changeHandler}
                        className="hidden"
                      />
                      <input
                        type="file"
                        ref={videoRef}
                        onChange={handleVideoChange}
                        className="hidden"
                        accept="video/*"
                      />
                      <Textarea
                        value={value}
                        onValueChange={setValue}
                        autoFocus
                        style={{ height: "70vh" }}
                        color="secondary"
                        size="lg"
                        isRequired
                        errorMessage="Message is required"
                        placeholder="What do you want to talk about?"
                      />
                    </div>
                    {image.preview && (
                      <div className="grid gap-4">
                        <div className="relative w-fit">
                          <BiX
                            className="text-2xl absolute top-2 right-3 z-50 text-white"
                            onClick={image.clear}
                          />
                          <Chip
                            onClick={() => imageRef.current?.click()}
                            startContent={<BiPencil size={16} />}
                            variant="flat"
                            color="secondary"
                            className="text-white absolute top-2 right-10 z-50"
                          >
                            Edit
                          </Chip>
                          <Image
                            // width={300}
                            // height={300}
                            src={image.preview || ""}
                            fallbackSrc="https://via.placeholder.com/300x200"
                            alt="NextUI Image with fallback"
                            className=" max-h-[250px] max-w-[300px]"
                          />
                        </div>
                      </div>
                    )}
                    {videoPreview && (
                      <div className="grid gap-4">
                        <div className="relative w-fit">
                          <BiX
                            className="text-2xl absolute top-2 right-3 z-50 text-white"
                            onClick={() => setVideoPreview(null)}
                          />
                          <Chip
                            onClick={() => videoRef.current?.click()}
                            startContent={<BiPencil size={16} />}
                            variant="flat"
                            color="secondary"
                            className="text-white absolute top-2 right-10 z-50"
                          >
                            Edit
                          </Chip>
                          <video
                            controls
                            width={300}
                            height={300}
                            className="rounded-lg"
                          >
                            <source src={videoPreview} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    )}
                  </ModalBody>
                  <ModalFooter className="absolute bottom-0 right-0 lg:hidden">
                    <IoImage
                      className={`text-2xl ${
                        !image.preview && !videoPreview ? "" : "text-gray-300"
                      }`}
                      onClick={() => {
                        if (!image.preview && !videoPreview)
                          imageRef.current?.click();
                      }}
                    />
                    <IoVideocam
                      className={`text-2xl ${
                        !image.preview && !videoPreview ? "" : "text-gray-300"
                      }`}
                      onClick={() => {
                        if (!image.preview && !videoPreview)
                          videoRef.current?.click();
                      }}
                    />
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </motion.div>
    </>
  );
}
