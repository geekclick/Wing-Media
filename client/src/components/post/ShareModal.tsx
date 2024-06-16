import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Snippet,
} from "@nextui-org/react";
import { ReactElement } from "react";
import { POST_URL } from "../../constants";

interface ShareModalProps {
  children: ReactElement;
  postId: string;
}

const ShareModal = ({ children, postId }: ShareModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent className="h-[210px]">
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              Share this post
            </ModalHeader>
            <ModalBody className="p-4 flex flex-col justify-center items-center">
              <p className="text-xs flex">{`${POST_URL + postId}`} </p>
              <Snippet
                size="sm"
                symbol=""
                className="w-fit"
                codeString={`${POST_URL + postId}`}
              >
                Copy Link
              </Snippet>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareModal;
