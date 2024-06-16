import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import { useLocation } from "react-router-dom";

type Handler = (...args: any) => void;
type Handlers = {
  [event: string]: Handler;
};

const useSocketEvents = (socket: Socket | null, handlers: Handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket?.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket?.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

const useAsyncMutation = (
  mutationHook: any
): [(toastMessage: string, args: any) => Promise<void>, boolean, any] => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const [mutate] = mutationHook();

  const executeMutation = async (
    toastMessage: string,
    args: any
  ): Promise<void> => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");
    try {
      const res = await mutate({ ...args });

      if (res.data) {
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

function useCurrentPath(n: number) {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[n];
  return currentPath;
}

const useDoubleTap = (onDoubleTap: () => void) => {
  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // 300ms for detecting double-tap
      onDoubleTap();
    }
    setLastTap(now);
  };

  return handleDoubleTap;
};

export { useSocketEvents, useAsyncMutation, useCurrentPath, useDoubleTap };
