import { Skeleton } from "@nextui-org/skeleton";
import PostSkeleton from "./PostSkeleton";

function HomeSkeleton() {
  return (
    <>
      <div className="overflow-x-auto whitespace-nowrap flex space-x-6 lg:w-[700px] bg-backgroundp p-3 lg:pb-10 border-y lg:border-0">
        <Skeleton className="w-14 h-14 rounded-lg" />
        <Skeleton className="w-14 h-14 rounded-lg" />
        <Skeleton className="w-14 h-14 rounded-lg" />
      </div>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  );
}

export default HomeSkeleton;
