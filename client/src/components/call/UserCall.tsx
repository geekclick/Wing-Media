import { User } from "@nextui-org/react";
import { MdOutlineCall } from "react-icons/md";

function UserCall() {
  return (
    <div className="py-3 px-4 border-black flex justify-between">
      <User
        name="Jane Doe"
        classNames={{
          name: "text-lg font-semibold text-foreground",
        }}
        description={"May 14, 23:26"}
        avatarProps={{
          size: "md",
          src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        }}
      />
      <div className="flex flex-col items-center justify-center">
        <MdOutlineCall className="text-2xl text-accent" />
      </div>
    </div>
  );
}

export default UserCall;
