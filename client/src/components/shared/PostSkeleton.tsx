import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@nextui-org/react";

function PostSkeleton() {
  return (
    <div>
      <Card className="max-w-screen rounded-none shadow-sm">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1 items-start justify-center">
              <Skeleton className="w-24 h-3 rounded-lg" />
              <Skeleton className="w-16 h-2 rounded-lg" />
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-3 py-1 text-small text-default-400 flex items-center">
          <Skeleton className="w-[340px] h-[200px] rounded-sm" />
        </CardBody>
        <CardFooter className="flex-col rounded-none">
          <div className="px-2 flex justify-between w-full h-full">
            <Skeleton className="w-24 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
          <div className="text-sm w-full px-3 m-1">
            <Skeleton className="w-14 h-4 rounded-sm" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PostSkeleton;
