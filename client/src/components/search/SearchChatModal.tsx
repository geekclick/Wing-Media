import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  User,
  Button,
  Spinner,
} from "@nextui-org/react";
import { ChildProps, User as UserInterface } from "../../interfaces/common";
import { LuSearch } from "react-icons/lu";
import { useCreateChatMutation, useGetFriendsQuery } from "../../store/api/api";
import { useMemo, useState } from "react";
import { useAsyncMutation } from "../../hooks/hooks";
import { StoreState } from "../../interfaces/storeInterface";
import { useSelector } from "react-redux";

function SearchChatModal({ children }: ChildProps) {
  const [query, setQuery] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isLoading, data: friends } = useGetFriendsQuery();
  const [createChat] = useAsyncMutation(useCreateChatMutation);
  const { user } = useSelector((state: StoreState) => state.userSlice);

  const handleChat = async (
    _id: string | undefined,
    name: string | undefined
  ) => {
    try {
      const body = { name: `${user.name}-${name}`, members: [user._id, _id] };
      await createChat("Please wait", { data: body });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredFriends =
    useMemo(() => {
      return friends?.data.filter(
        (friend: UserInterface) =>
          friend?.name?.toLowerCase().includes(query.toLowerCase()) ||
          friend?.username?.toLowerCase().includes(query.toLowerCase())
      );
    }, [query]) || friends?.data;

  return isLoading ? (
    <Spinner />
  ) : (
    <div>
      <button onClick={onOpen}>{children}</button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        className="m-4 p-2"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Select Chat
              </ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Search user"
                  endContent={<LuSearch />}
                  value={query}
                  onValueChange={setQuery}
                />
                <div
                  className={`flex flex-col justify-center items-start space-y-8 py-5 overflow-y-scroll ${
                    friends?.data.length > 3 ? "h-[250px]" : "h-fit"
                  }`}
                >
                  {filteredFriends?.map((u: UserInterface) => (
                    <div
                      onClick={() => handleChat(u?._id, u?.name)}
                      key={u._id}
                    >
                      {" "}
                      <User
                        key={u?._id}
                        name={u?.name}
                        description={u?.username}
                        avatarProps={{
                          src: `${u?.avatar?.url}`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SearchChatModal;
