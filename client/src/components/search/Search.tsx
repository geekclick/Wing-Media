import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
} from "@nextui-org/react";
import { KeyboardEvent, useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../../interfaces/storeInterface";
import { User } from "../../interfaces/common";
import { useSearchUserQuery } from "../../store/api/api";
import { setUsers } from "../../store/reducers/userSlice";

export default function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const { user, users } = useSelector((state: StoreState) => state.userSlice);
  const formatedUsers = users.filter((u) => u?._id !== user?._id);
  const { data } = useSearchUserQuery(query);

  useEffect(() => {
    if (query.trim() !== "") dispatch(setUsers(data?.data));
  }, [query]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      dispatch(setUsers(data?.data));
    }
  };

  return (
    <div className="">
      <Autocomplete
        classNames={{
          base: "max-w-screen rounded-xl bg-white",
          listboxWrapper: "max-h-[320px]",
          selectorButton: "text-default-500",
        }}
        defaultItems={formatedUsers}
        inputProps={{
          classNames: {
            input: "ml-1",
            inputWrapper: "h-[48px]",
          },
          onValueChange: setQuery,
          onKeyDown: handleKeyDown,
        }}
        listboxProps={{
          hideSelectedIcon: true,
          itemClasses: {
            base: [
              "rounded-medium",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "dark:data-[hover=true]:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[hover=true]:bg-default-200",
              "data-[selectable=true]:focus:bg-default-100",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        aria-label="Select an employee"
        placeholder="Search by username"
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-large",
            content: "p-1 border-small border-default-100 bg-background",
          },
        }}
        startContent={
          <LuSearch className="text-default-400" strokeWidth={2.5} size={20} />
        }
        variant="bordered"
        size="lg"
      >
        {(item: User) => (
          <AutocompleteItem key={item.email} textValue={item.username}>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Avatar
                  alt={item.name}
                  className="flex-shrink-0"
                  size="sm"
                  src={item.avatar?.url}
                  showFallback
                />
                <div className="flex flex-col">
                  <span className="text-small ">{item?.name}</span>
                  <span className="text-tiny text-default-400">
                    {item.username}
                  </span>
                </div>
              </div>
              <Button
                className="border-small mr-0.5 font-medium shadow-small"
                radius="full"
                size="sm"
                variant="bordered"
              >
                Search
              </Button>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
