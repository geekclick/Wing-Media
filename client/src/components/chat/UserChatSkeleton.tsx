import { Skeleton } from "@nextui-org/react";

function UserChatSkeleton() {
  return (
    <div className="flex gap-5 my-10 mx-4">
      <Skeleton className="w-14 h-14 rounded-full" />
      <div className="flex flex-col gap-1 items-start justify-center">
        <Skeleton className="w-28 h-4 rounded-lg" />
        <Skeleton className="w-20 h-3 rounded-lg" />
      </div>
    </div>
  );
}

export default UserChatSkeleton;
