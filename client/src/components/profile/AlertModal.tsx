import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ChildProps } from "../../interfaces/common";
import { useDeleteProfileMutation } from "../../store/api/api";
import { StoreState } from "../../interfaces/storeInterface";
import { useDispatch, useSelector } from "react-redux";
import { setIsLoggedIn } from "../../store/reducers/authSlice";
import axios from "axios";
import { SERVER_URL } from "../../constants";
import { useNavigate } from "react-router-dom";

function AlertModal({ children }: ChildProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: StoreState) => state.userSlice);
  const [deleteProfile] = useDeleteProfileMutation();

  const handleDeleteProfile = async () => {
    try {
      if (user?._id) {
        await deleteProfile({ data: user?._id });
        const response = await axios.get(`${SERVER_URL}/api/auth/logout`, {
          withCredentials: true,
        });
        if (response) {
          dispatch(setIsLoggedIn(false));
          localStorage.removeItem("token");
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <div onClick={onOpen} className="w-fit m-auto">
        {children}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="m-2"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete your account?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm flex flex-col">
                  <span className="text-warning">WARNING</span>
                  <span>
                    Deleting your account is a permanent action and cannot be
                    undone. All your data, including your profile information,
                    posts, and any other associated content, will be permanently
                    removed from our servers. You will not be able to recover
                    your account or any of its data once this action is
                    completed.
                  </span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  No Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleDeleteProfile}
                  className="text-white font-semibold"
                >
                  Yes Sure
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default AlertModal;
