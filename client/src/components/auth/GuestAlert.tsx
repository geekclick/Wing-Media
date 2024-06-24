import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ReactNode } from "react";

interface GuestAlertProps {
  children: ReactNode;
  handleGuestUser: () => void;
}

export default function GuestAlert({
  children,
  handleGuestUser,
}: GuestAlertProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="w-[350px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-danger">
                WARNING
              </ModalHeader>
              <ModalBody className="text-sm">
                <h1 className="text-base font-semibold">
                  Guest account will be deleted in 1 hour
                </h1>
                Guest account is only for testing purposes and it shouldn't be
                used by real user. Data of guest user is not stored all the time
                it will be deleted in 1 hour. So be aware of that if you are
                someone who intended to use the app please login or create a new
                account with email
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Go back
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleGuestUser();
                    onClose();
                  }}
                  className="text-white"
                >
                  Yes i know
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
